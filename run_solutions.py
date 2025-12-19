#!/usr/bin/env python3
"""
Run all solutions (human and AI) for a given Advent of Code day.
Outputs evaluation data in JSON format for parsing.
"""

import json
import os
import subprocess
import sys
import time
import argparse
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict


@dataclass
class SolutionResult:
    """Result of running a solution."""
    day: str
    source: str
    language: str
    path: str
    success: bool
    exit_code: int
    execution_time_ms: float
    stdout: str
    stderr: str
    error: Optional[str] = None
    # Extra analysis fields (not required for solving, useful for blog/metrics)
    matches_baseline: Optional[bool] = None
    baseline_source: Optional[str] = None
    baseline_language: Optional[str] = None
    code_stats: Optional[Dict[str, int]] = None  # e.g. {"loc": 123, "files": 3}


def compute_code_stats(path: Path, language: str) -> Dict[str, int]:
    """
    Compute simple code statistics for a solution directory.
    Currently:
      - total_loc: total lines of code for primary language files
      - file_count: number of primary language files
    This is intentionally cheap and approximate but good enough for comparison.
    """
    ext_map = {
        "python": [".py"],
        "rust": [".rs"],
        "js": [".js", ".mjs", ".cjs", ".ts"],
        "ts": [".ts"],
    }
    exts = ext_map.get(language, [])
    total_loc = 0
    file_count = 0

    if not exts:
        return {"total_loc": 0, "file_count": 0}

    for file_path in path.rglob("*"):
        if not file_path.is_file():
            continue
        if file_path.suffix not in exts:
            continue
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                total_loc += sum(1 for _ in f)
                file_count += 1
        except Exception:
            # Best-effort; ignore unreadable files
            continue

    return {"total_loc": total_loc, "file_count": file_count}


def find_solutions(day: str, base_path: Path) -> List[Tuple[str, str, str, Path]]:
    """
    Find all solutions for a given day.
    Returns list of (source, language, path) tuples.
    """
    solutions = []
    day_str = day.zfill(2)
    
    human_path = base_path / "human-solutions" / day_str
    if human_path.exists():
        for lang_dir in ["python", "rust", "js"]:
            lang_path = human_path / lang_dir
            if lang_path.exists():
                solutions.append(("human", lang_dir, lang_path))
    
    ai_path = base_path / "ai-solutions" / day_str
    if ai_path.exists():
        for model_dir in ai_path.iterdir():
            if model_dir.is_dir():
                model_name = model_dir.name
                for lang_dir in ["python", "rust", "js"]:
                    lang_path = model_dir / lang_dir
                    if lang_path.exists():
                        solutions.append((model_name, lang_dir, lang_path))
    
    return solutions


def run_python_solution(path: Path, input_file: Path) -> Tuple[int, str, str, float]:
    """Run a Python solution."""
    main_file = path / "main.py"
    if not main_file.exists():
        main_file = path / "solution.py"
    if not main_file.exists():
        py_files = list(path.glob("*.py"))
        if py_files:
            main_file = py_files[0]
        else:
            return 1, "", f"No Python file found in {path}", 0.0
    
    start = time.perf_counter()
    try:
        result = subprocess.run(
            [sys.executable, str(main_file), str(input_file)],
            capture_output=True,
            text=True,
            timeout=60,
            cwd=str(path)
        )
        elapsed = (time.perf_counter() - start) * 1000
        return result.returncode, result.stdout, result.stderr, elapsed
    except subprocess.TimeoutExpired:
        elapsed = (time.perf_counter() - start) * 1000
        return 124, "", f"Solution timed out after 60 seconds", elapsed
    except Exception as e:
        elapsed = (time.perf_counter() - start) * 1000
        return 1, "", str(e), elapsed


def run_rust_solution(path: Path, input_file: Path) -> Tuple[int, str, str, float]:
    """Run a Rust solution."""
    cargo_toml = path / "Cargo.toml"
    if cargo_toml.exists():
        build_result = subprocess.run(
            ["cargo", "build", "--release"],
            capture_output=True,
            text=True,
            cwd=str(path),
            timeout=120
        )
        if build_result.returncode != 0:
            return 1, "", f"Build failed: {build_result.stderr}", 0.0
        
        # Try to get package name from Cargo.toml
        package_name = path.name  # Default to directory name
        try:
            with open(cargo_toml, "r") as f:
                in_package_section = False
                for line in f:
                    line = line.strip()
                    if line.startswith("[package]"):
                        in_package_section = True
                    elif line.startswith("[") and in_package_section:
                        break
                    elif in_package_section and line.startswith("name ="):
                        package_name = line.split("=", 1)[1].strip().strip('"').strip("'")
                        break
        except Exception:
            pass
        
        # Check common binary locations
        binary_path = path / "target" / "release" / package_name
        if not binary_path.exists():
            for name in [package_name, path.name, "main", "solution"]:
                test_path = path / "target" / "release" / name
                if test_path.exists():
                    binary_path = test_path
                    break
        
        if not binary_path.exists():
            return 1, "", f"Binary not found after build (checked: {package_name}, {path.name}, main, solution)", 0.0
        
        start = time.perf_counter()
        try:
            # Use absolute path for input file and run from solution directory
            abs_input_file = input_file.resolve()
            result = subprocess.run(
                [str(binary_path), str(abs_input_file)],
                capture_output=True,
                text=True,
                timeout=60,
                cwd=str(path)
            )
            elapsed = (time.perf_counter() - start) * 1000
            return result.returncode, result.stdout, result.stderr, elapsed
        except subprocess.TimeoutExpired:
            elapsed = (time.perf_counter() - start) * 1000
            return 124, "", f"Solution timed out after 60 seconds", elapsed
        except Exception as e:
            elapsed = (time.perf_counter() - start) * 1000
            return 1, "", str(e), elapsed
    else:
        rs_files = list(path.glob("*.rs"))
        if not rs_files:
            return 1, "", f"No Rust files found in {path}", 0.0
        
        main_file = rs_files[0]
        binary_name = main_file.stem
        start = time.perf_counter()
        try:
            compile_result = subprocess.run(
                ["rustc", "-o", str(path / binary_name), str(main_file)],
                capture_output=True,
                text=True,
                timeout=30
            )
            if compile_result.returncode != 0:
                return 1, "", f"Compilation failed: {compile_result.stderr}", 0.0
            
            abs_input_file = input_file.resolve()
            run_result = subprocess.run(
                [str(path / binary_name), str(abs_input_file)],
                capture_output=True,
                text=True,
                timeout=60,
                cwd=str(path)
            )
            elapsed = (time.perf_counter() - start) * 1000
            (path / binary_name).unlink(missing_ok=True)
            return run_result.returncode, run_result.stdout, run_result.stderr, elapsed
        except Exception as e:
            elapsed = (time.perf_counter() - start) * 1000
            return 1, "", str(e), elapsed


import re


def looks_like_commonjs(source: str) -> bool:
    """
    Heuristic to detect if JS source uses CommonJS syntax.
    Many AI solutions use `require(...)` but live under a repo-level `"type": "module"`,
    so Node treats `.js` as ESM and crashes with "require is not defined".
    """
    return bool(
        re.search(r'\brequire\s*\(', source) or
        re.search(r'\bmodule\.exports\b', source) or
        re.search(r'\bexports\.[A-Za-z_$][\w$]*\b', source)
    )


def run_js_solution(path: Path, input_file: Path) -> Tuple[int, str, str, float]:
    """Run a JavaScript/TypeScript solution."""
    package_json = path / "package.json"
    node_modules = path / "node_modules"
    
    if package_json.exists() and not node_modules.exists():
        subprocess.run(
            ["npm", "install"],
            capture_output=True,
            cwd=str(path),
            timeout=60
        )
    
    main_file = path / "index.js"
    if not main_file.exists():
        main_file = path / "main.js"
    if not main_file.exists():
        main_file = path / "solution.js"
    if not main_file.exists():
        main_file = path / "index.ts"
        if not main_file.exists():
            main_file = path / "main.ts"
        if not main_file.exists():
            main_file = path / "solution.ts"
    
    if not main_file.exists():
        js_files = list(path.glob("*.js")) + list(path.glob("*.ts"))
        if js_files:
            main_file = js_files[0]
        else:
            return 1, "", f"No JavaScript/TypeScript file found in {path}", 0.0
    
    is_ts = main_file.suffix == ".ts"
    
    start = time.perf_counter()
    try:
        if is_ts:
            for runner in ["tsx", "ts-node"]:
                try:
                    result = subprocess.run(
                        [runner, str(main_file), str(input_file)],
                        capture_output=True,
                        text=True,
                        timeout=60,
                        cwd=str(path)
                    )
                    elapsed = (time.perf_counter() - start) * 1000
                    return result.returncode, result.stdout, result.stderr, elapsed
                except FileNotFoundError:
                    continue
            return 1, "", "TypeScript runner (tsx/ts-node) not found", 0.0
        else:
            # Check if the source looks like CommonJS
            # If so, run it as .cjs to avoid ESM issues from root package.json "type": "module"
            try:
                source_content = main_file.read_text(encoding='utf-8')
            except Exception:
                source_content = ""
            
            if source_content and looks_like_commonjs(source_content):
                # Create a temporary .cjs file to run as CommonJS
                tmp_cjs = path / f".tmp-bench-{main_file.stem}.cjs"
                try:
                    tmp_cjs.write_text(source_content, encoding='utf-8')
                    result = subprocess.run(
                        ["node", str(tmp_cjs), str(input_file)],
                        capture_output=True,
                        text=True,
                        timeout=60,
                        cwd=str(path)
                    )
                    elapsed = (time.perf_counter() - start) * 1000
                    return result.returncode, result.stdout, result.stderr, elapsed
                finally:
                    try:
                        tmp_cjs.unlink(missing_ok=True)
                    except Exception:
                        pass
            else:
                result = subprocess.run(
                    ["node", str(main_file), str(input_file)],
                    capture_output=True,
                    text=True,
                    timeout=60,
                    cwd=str(path)
                )
                elapsed = (time.perf_counter() - start) * 1000
                return result.returncode, result.stdout, result.stderr, elapsed
    except subprocess.TimeoutExpired:
        elapsed = (time.perf_counter() - start) * 1000
        return 124, "", f"Solution timed out after 60 seconds", elapsed
    except Exception as e:
        elapsed = (time.perf_counter() - start) * 1000
        return 1, "", str(e), elapsed


def run_solution(source: str, language: str, path: Path, day: str, input_file: Path) -> SolutionResult:
    """Run a single solution and return the result."""
    lang_map = {
        "python": run_python_solution,
        "rust": run_rust_solution,
        "js": run_js_solution,
        "ts": run_js_solution,
    }
    
    runner = lang_map.get(language)
    if not runner:
        return SolutionResult(
            day=day,
            source=source,
            language=language,
            path=str(path),
            success=False,
            exit_code=1,
            execution_time_ms=0.0,
            stdout="",
            stderr="",
            error=f"Unknown language: {language}"
        )
    
    exit_code, stdout, stderr, elapsed = runner(path, input_file)
    success = exit_code == 0
    
    error = None
    if not success:
        error = stderr if stderr else f"Exit code: {exit_code}"
    
    return SolutionResult(
        day=day,
        source=source,
        language=language,
        path=str(path),
        success=success,
        exit_code=exit_code,
        execution_time_ms=round(elapsed, 2),
        stdout=stdout.strip(),
        stderr=stderr.strip(),
        error=error,
        code_stats=compute_code_stats(path, language)
    )


def main():
    parser = argparse.ArgumentParser(
        description="Run all solutions for a given Advent of Code day"
    )
    parser.add_argument(
        "day",
        type=str,
        help="Day number (e.g., '1' or '01')"
    )
    parser.add_argument(
        "--input",
        type=str,
        default=None,
        help="Path to input file (default: inputs/{day}.txt)"
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Output JSON file (default: stdout)"
    )
    parser.add_argument(
        "--base-path",
        type=str,
        default=".",
        help="Base path of the project (default: current directory)"
    )
    parser.add_argument(
        "--baseline-mode",
        type=str,
        choices=["none", "first_success", "human"],
        default="first_success",
        help=(
            "How to choose a baseline implementation for correctness comparison: "
            "'none' (disable), 'first_success' (first successful run), "
            "'human' (first successful human solution, if present)."
        ),
    )
    
    args = parser.parse_args()
    
    base_path = Path(args.base_path).resolve()
    day = args.day.zfill(2)
    
    # Find input file
    if args.input:
        input_file = Path(args.input)
    else:
        input_file = base_path / "inputs" / f"{day}.txt"
    
    if not input_file.exists():
        print(f"Error: Input file not found: {input_file}", file=sys.stderr)
        sys.exit(1)
    
    # Find all solutions
    solutions = find_solutions(day, base_path)
    
    if not solutions:
        print(f"Error: No solutions found for day {day}", file=sys.stderr)
        sys.exit(1)
    
    # Run all solutions
    results: List[SolutionResult] = []
    print(f"Running {len(solutions)} solutions for day {day}...", file=sys.stderr)
    
    for source, language, path in solutions:
        print(f"  Running {source}/{language}...", file=sys.stderr, end=" ")
        result = run_solution(source, language, path, day, input_file)
        results.append(result)
        
        status = "✓" if result.success else "✗"
        time_str = f"{result.execution_time_ms:.2f}ms"
        print(f"{status} ({time_str})", file=sys.stderr)

    # Determine a baseline stdout for correctness comparison
    baseline_stdout: Optional[str] = None
    baseline_source: Optional[str] = None
    baseline_language: Optional[str] = None

    if args.baseline_mode != "none":
        if args.baseline_mode == "human":
            # Prefer a successful human solution if available
            for r in results:
                if r.source == "human" and r.success:
                    baseline_stdout = r.stdout
                    baseline_source = r.source
                    baseline_language = r.language
                    break
        if baseline_stdout is None:
            # Fallback: first successful result regardless of source
            for r in results:
                if r.success:
                    baseline_stdout = r.stdout
                    baseline_source = r.source
                    baseline_language = r.language
                    break

    # Annotate results with baseline comparison
    if baseline_stdout is not None:
        for r in results:
            r.matches_baseline = (r.stdout == baseline_stdout) if r.success else None
            r.baseline_source = baseline_source
            r.baseline_language = baseline_language
    
    output_data = {
        "day": day,
        "input_file": str(input_file),
        "timestamp": time.time(),
        "solutions": [asdict(r) for r in results],
        "summary": {
            "total": len(results),
            "successful": sum(1 for r in results if r.success),
            "failed": sum(1 for r in results if not r.success),
            "by_source": {},
            "by_language": {}
        }
    }
    
    # Generate summary statistics
    for result in results:
        # By source
        if result.source not in output_data["summary"]["by_source"]:
            output_data["summary"]["by_source"][result.source] = {
                "total": 0,
                "successful": 0,
                "failed": 0,
                "avg_time_ms": []
            }
        source_stats = output_data["summary"]["by_source"][result.source]
        source_stats["total"] += 1
        if result.success:
            source_stats["successful"] += 1
            source_stats["avg_time_ms"].append(result.execution_time_ms)
        else:
            source_stats["failed"] += 1
        
        # By language
        if result.language not in output_data["summary"]["by_language"]:
            output_data["summary"]["by_language"][result.language] = {
                "total": 0,
                "successful": 0,
                "failed": 0,
                "avg_time_ms": []
            }
        lang_stats = output_data["summary"]["by_language"][result.language]
        lang_stats["total"] += 1
        if result.success:
            lang_stats["successful"] += 1
            lang_stats["avg_time_ms"].append(result.execution_time_ms)
        else:
            lang_stats["failed"] += 1
    
    # Calculate averages
    for source_stats in output_data["summary"]["by_source"].values():
        if source_stats["avg_time_ms"]:
            source_stats["avg_time_ms"] = round(
                sum(source_stats["avg_time_ms"]) / len(source_stats["avg_time_ms"]), 2
            )
        else:
            source_stats["avg_time_ms"] = None
    
    for lang_stats in output_data["summary"]["by_language"].values():
        if lang_stats["avg_time_ms"]:
            lang_stats["avg_time_ms"] = round(
                sum(lang_stats["avg_time_ms"]) / len(lang_stats["avg_time_ms"]), 2
            )
        else:
            lang_stats["avg_time_ms"] = None
    
    # Output results
    output_json = json.dumps(output_data, indent=2)
    
    if args.output:
        with open(args.output, "w") as f:
            f.write(output_json)
        print(f"\nResults written to {args.output}", file=sys.stderr)
    else:
        print(output_json)


if __name__ == "__main__":
    main()

