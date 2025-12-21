#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const AI_MODELS = [
  'composer-1',
  'gemini-3-pro',
  'gpt-5.1-codex',
  'opus-4.5',
  'sonnet-4.5'
];

const LANGUAGES = ['js', 'python', 'rust'];

// Get day number from command line argument
const dayArg = process.argv[2];

if (!dayArg) {
  console.error('Usage: node add-day.js <day_number>');
  console.error('Example: node add-day.js 6');
  process.exit(1);
}

const dayNumber = parseInt(dayArg, 10);

if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 25) {
  console.error('Error: Day number must be between 1 and 25');
  process.exit(1);
}

// Format day number with leading zero if needed
const dayFormatted = dayNumber.toString().padStart(2, '0');

const rootDir = path.resolve(__dirname, '..');
const humanSolutionsDir = path.join(rootDir, 'human-solutions');
const aiSolutionsDir = path.join(rootDir, 'ai-solutions');

/**
 * Create a directory if it doesn't exist
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`  ✓ Created: ${path.relative(rootDir, dirPath)}`);
    return true;
  }
  console.log(`  - Exists: ${path.relative(rootDir, dirPath)}`);
  return false;
}

/**
 * Create template files for each language
 */
function createTemplateFiles(basePath, dayNum) {
  const jsPath = path.join(basePath, 'js', 'index.js');
  const pythonPath = path.join(basePath, 'python', 'main.py');
  const rustMainPath = path.join(basePath, 'rust', 'src', 'main.rs');
  const rustCargoPath = path.join(basePath, 'rust', 'Cargo.toml');

  // JavaScript template
  if (!fs.existsSync(jsPath)) {
    fs.writeFileSync(jsPath, `const fs = require('fs');
const path = require('path');

// Read input file
const inputPath = path.join(__dirname, '../../../inputs/${dayNum}.txt');
const input = fs.readFileSync(inputPath, 'utf8').trim();

function part1(input) {
  // TODO: Implement part 1
  return 0;
}

function part2(input) {
  // TODO: Implement part 2
  return 0;
}

console.log('Part 1:', part1(input));
console.log('Part 2:', part2(input));
`);
    console.log(`  ✓ Created template: ${path.relative(rootDir, jsPath)}`);
  }

  // Python template
  if (!fs.existsSync(pythonPath)) {
    fs.writeFileSync(pythonPath, `import os

def read_input():
    input_path = os.path.join(os.path.dirname(__file__), '../../../inputs/${dayNum}.txt')
    with open(input_path, 'r') as f:
        return f.read().strip()

def part1(input_data):
    # TODO: Implement part 1
    return 0

def part2(input_data):
    # TODO: Implement part 2
    return 0

if __name__ == '__main__':
    input_data = read_input()
    print(f'Part 1: {part1(input_data)}')
    print(f'Part 2: {part2(input_data)}')
`);
    console.log(`  ✓ Created template: ${path.relative(rootDir, pythonPath)}`);
  }

  // Rust main.rs template
  if (!fs.existsSync(rustMainPath)) {
    fs.writeFileSync(rustMainPath, `use std::fs;

fn read_input() -> String {
    let input_path = format!("../../../inputs/${dayNum}.txt");
    fs::read_to_string(&input_path)
        .expect("Failed to read input file")
        .trim()
        .to_string()
}

fn part1(input: &str) -> i32 {
    // TODO: Implement part 1
    0
}

fn part2(input: &str) -> i32 {
    // TODO: Implement part 2
    0
}

fn main() {
    let input = read_input();
    println!("Part 1: {}", part1(&input));
    println!("Part 2: {}", part2(&input));
}
`);
    console.log(`  ✓ Created template: ${path.relative(rootDir, rustMainPath)}`);
  }

  // Rust Cargo.toml template
  if (!fs.existsSync(rustCargoPath)) {
    fs.writeFileSync(rustCargoPath, `[package]
name = "day${dayNum}"
version = "0.1.0"
edition = "2021"

[dependencies]
`);
    console.log(`  ✓ Created template: ${path.relative(rootDir, rustCargoPath)}`);
  }
}

/**
 * Set up human solutions folder structure
 */
function setupHumanSolutions() {
  console.log(`\n📁 Setting up human-solutions/${dayFormatted}/`);
  
  const dayDir = path.join(humanSolutionsDir, dayFormatted);
  ensureDir(dayDir);
  
  for (const lang of LANGUAGES) {
    const langDir = path.join(dayDir, lang);
    ensureDir(langDir);
    
    // Create rust src directory
    if (lang === 'rust') {
      ensureDir(path.join(langDir, 'src'));
    }
  }
  
  // Create template files
  createTemplateFiles(dayDir, dayFormatted);
}

/**
 * Set up AI solutions folder structure
 */
function setupAISolutions() {
  console.log(`\n📁 Setting up ai-solutions/${dayFormatted}/`);
  
  const dayDir = path.join(aiSolutionsDir, dayFormatted);
  ensureDir(dayDir);
  
  for (const model of AI_MODELS) {
    console.log(`\n  Model: ${model}`);
    const modelDir = path.join(dayDir, model);
    ensureDir(modelDir);
    
    for (const lang of LANGUAGES) {
      const langDir = path.join(modelDir, lang);
      ensureDir(langDir);
      
      // Create rust src directory
      if (lang === 'rust') {
        ensureDir(path.join(langDir, 'src'));
      }
    }
    
    // Create template files for this model
    createTemplateFiles(modelDir, dayFormatted);
    
    // Create notes.md file
    const notesPath = path.join(modelDir, 'notes.md');
    if (!fs.existsSync(notesPath)) {
      fs.writeFileSync(notesPath, `# Day ${dayNumber} - ${model}\n\n## Notes\n\n`);
      console.log(`  ✓ Created: ${path.relative(rootDir, notesPath)}`);
    }
  }
}

/**
 * Create placeholder input file if it doesn't exist
 */
function setupInputFile() {
  console.log(`\n📄 Setting up input file`);
  
  const inputPath = path.join(rootDir, 'inputs', `${dayFormatted}.txt`);
  
  if (!fs.existsSync(inputPath)) {
    fs.writeFileSync(inputPath, '');
    console.log(`  ✓ Created: inputs/${dayFormatted}.txt`);
  } else {
    console.log(`  - Exists: inputs/${dayFormatted}.txt`);
  }
}

// Main execution
console.log(`\n🎄 Setting up Advent of Code Day ${dayNumber} (${dayFormatted})`);
console.log('='.repeat(50));

setupHumanSolutions();
setupAISolutions();
setupInputFile();

console.log('\n✅ Day setup complete!');
console.log(`\nNext steps:`);
console.log(`  1. Add your puzzle input to: inputs/${dayFormatted}.txt`);
console.log(`  2. Start coding in: human-solutions/${dayFormatted}/`);
console.log(`  3. AI solutions go in: ai-solutions/${dayFormatted}/`);

