import { copyFileSync, mkdirSync, writeFileSync, existsSync, cpSync } from 'fs';
import { join } from 'path';

console.log('📦 Preparing Vercel output structure...');

const root = process.cwd();
const vercelOutput = join(root, '.vercel', 'output');
const nitroOutput = join(root, '.output');

// Ensure .vercel/output exists
mkdirSync(vercelOutput, { recursive: true });

// Create Vercel Build Output API v3 config
const config = {
  version: 3,
  routes: [
    {
      src: '/(.*)',
      dest: '/__nitro'
    }
  ]
};

writeFileSync(
  join(vercelOutput, 'config.json'),
  JSON.stringify(config, null, 2)
);

console.log('✅ Created config.json');

// Copy Nitro's function output to Vercel's expected location
const nitroServerOutput = join(nitroOutput, 'server');
const vercelFunctionOutput = join(vercelOutput, 'functions', '__nitro.func');

if (existsSync(nitroServerOutput)) {
  mkdirSync(vercelFunctionOutput, { recursive: true });
  
  // Copy server files
  cpSync(nitroServerOutput, vercelFunctionOutput, { recursive: true });
  
  console.log('✅ Copied serverless function');
} else {
  console.error('❌ Nitro server output not found!');
  process.exit(1);
}

// Copy static assets
const nitroPublicOutput = join(nitroOutput, 'public');
const vercelStaticOutput = join(vercelOutput, 'static');

if (existsSync(nitroPublicOutput)) {
  cpSync(nitroPublicOutput, vercelStaticOutput, { recursive: true });
  console.log('✅ Copied static assets');
}

console.log('🎉 Vercel output structure prepared successfully!');
