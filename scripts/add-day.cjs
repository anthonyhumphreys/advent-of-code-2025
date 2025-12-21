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

