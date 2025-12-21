# Add Day Script

This script automates the setup of directory structure and template files for a new Advent of Code day.

## Usage

### Option 1: Using npm script (recommended)

```bash
npm run add-day <day_number>
```

### Option 2: Direct node execution

```bash
node scripts/add-day.cjs <day_number>
```

### Example

```bash
npm run add-day 6
# or
node scripts/add-day.cjs 6
```

This will create:
- Day 06 in the specified format

## What it does

### 1. Human Solutions Structure
Creates a folder structure in `human-solutions/`:
```
human-solutions/
└── 06/
    ├── js/
    │   └── index.js (template)
    ├── python/
    │   └── main.py (template)
    └── rust/
        ├── Cargo.toml (template)
        └── src/
            └── main.rs (template)
```

### 2. AI Solutions Structure
Creates folder structures in `ai-solutions/` for each model:
```
ai-solutions/
└── 06/
    ├── composer-1/
    │   ├── notes.md
    │   ├── js/
    │   │   └── index.js (template)
    │   ├── python/
    │   │   └── main.py (template)
    │   └── rust/
    │       ├── Cargo.toml (template)
    │       └── src/
    │           └── main.rs (template)
    ├── gemini-3-pro/
    │   └── (same structure)
    ├── gpt-5.1-codex/
    │   └── (same structure)
    ├── opus-4.5/
    │   └── (same structure)
    └── sonnet-4.5/
        └── (same structure)
```

### 3. Input File
Creates a placeholder input file at `inputs/06.txt` (if it doesn't exist)

## Template Files

Each template file includes:
- **JavaScript**: Basic structure with file reading and part1/part2 functions
- **Python**: Basic structure with file reading and part1/part2 functions
- **Rust**: Basic Cargo project with main.rs and part1/part2 functions

All templates are pre-configured to read from the correct input file path.

## Configuration

The script uses these AI models (edit in the script to modify):
- composer-1
- gemini-3-pro
- gpt-5.1-codex
- opus-4.5
- sonnet-4.5

Languages supported:
- JavaScript (js)
- Python (python)
- Rust (rust)

## Safety

The script will:
- ✅ Create directories if they don't exist
- ✅ Skip directories that already exist
- ✅ Skip files that already exist
- ❌ Never overwrite existing files

