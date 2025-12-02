# Advent of Code 2025: Human vs AI Benchmark

> A comprehensive comparison of human-written solutions against leading AI models solving Advent of Code 2025 challenges.

## 🎯 Overview

This repository benchmarks human problem-solving approaches against state-of-the-art AI models on Advent of Code 2025 puzzles. Each solution is implemented across multiple programming languages (Python, Rust, TypeScript) to provide a fair, multi-dimensional comparison of code quality, performance, and problem-solving strategies.

AI solutions are generated using Cursor Pro with the relevant model engaged and no MCPs enabled.

## 🤖 AI Models Tested

- **GPT-5.1 Codex** - OpenAI's latest code generation model
- **Claude Opus 4.5** - Anthropic's advanced reasoning model
- **Claude Sonnet 4.5** - Anthropic's balanced performance model
- **Gemini 3.0** - Google's multimodal AI model
- **Composer 1** - Cursor's AI coding assistant

## 🛠️ Languages & Technologies

Solutions are implemented in:

- **Python** - For rapid prototyping and readability
- **Rust** - For performance-critical implementations
- **TypeScript** - For web-focused solutions

## 📊 Project Structure

```
├── human-solutions/     # Hand-crafted solutions by me
│   └── {day}/
│       ├── python/
│       ├── rust/
│       └── js/
├── ai-solutions/        # AI-generated solutions
│   └── {day}/
│       ├── {model}/
│           ├── python/
│           ├── rust/
│           └── ts/
└── inputs/              # Puzzle inputs
```

## 🚀 Getting Started

### Prerequisites

- Python3
- Rust
- Node.js LTS

### Running Solutions

**Python:**

```bash
cd human-solutions/01/python
python main.py
```

**Rust:**

```bash
cd human-solutions/01/rust
cargo run
```

**TypeScript:**

```bash
cd human-solutions/01/js
npm install
npm start
```

## 📈 Benchmarks & Metrics

Each solution is evaluated on:

- **Correctness** - Does it produce the correct answer?
- **Performance** - Execution time and memory usage
- **Code Quality** - Readability, maintainability, best practices
- **Problem-Solving Approach** - Algorithmic efficiency and elegance

### Running Evaluations

Use the `run_solutions.py` script to execute all solutions for a given day and generate evaluation data:

```bash
# Run all solutions for day 1 and output to stdout
python3 run_solutions.py 1

# Save results to a file
python3 run_solutions.py 1 --output results/day01.json

# Use a custom input file
python3 run_solutions.py 1 --input custom_input.txt
```

The script outputs JSON data with:

- Execution time for each solution
- Success/failure status
- Output and error messages
- Summary statistics by source and language

Example output structure:

```json
{
  "day": "01",
  "input_file": "inputs/01.txt",
  "timestamp": 1234567890.123,
  "solutions": [...],
  "summary": {
    "total": 15,
    "successful": 12,
    "failed": 3,
    "by_source": {...},
    "by_language": {...}
  }
}
```

## 🤝 Contributing

Contributions are welcome! Whether you're:

- Adding alternative human solutions in other languages (yes please!)
- Improving existing implementations
- Enhancing documentation or tooling

Please read our contributing guidelines and submit a pull request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Advent of Code](https://adventofcode.com/) by Eric Wastl for the amazing puzzles
- All contributors who have shared their solutions
- The open-source community for inspiration and feedback

## 🔗 Links

- [Advent of Code 2025](https://adventofcode.com/2025)
- [Issues](https://github.com/yourusername/advent-of-code-2025/issues)
- [Discussions](https://github.com/yourusername/advent-of-code-2025/discussions)

---

**Built with ❤️ by @anthonyhumphreys, for fellow developers. Let's see how we stack up against the machines.**
