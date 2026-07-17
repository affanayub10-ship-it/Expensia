import { copyFileSync, mkdirSync, writeFileSync, existsSync, cpSync, readdirSync } from 'fs';
import { join } from 'path';

console.log('📦 Preparing Vercel output structure...');

const root = process.cwd();
const vercelOutput = join(root, '.vercel', 'output');

// Check what Nitro actually created
console.log('Contents of .vercel/output:', readdirSync(vercelOutput));

// Nitro with vercel preset already creates the correct structure
// We just need to ensure the config.json exists with proper routing

const configPath = join(vercelOutput, 'config.json');

if (!existsSync(configPath)) {
  const config = {
    version: 3
  };
  
  writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('✅ Created config.json');
} else {
  console.log('✅ config.json already exists');
}

console.log('🎉 Vercel output structure ready!');

