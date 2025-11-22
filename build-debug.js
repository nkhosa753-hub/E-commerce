#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Build Debug Information');
console.log('='.repeat(50));

// Check dist folder
const distPath = path.join(process.cwd(), 'dist');
const distServerPath = path.join(process.cwd(), 'dist-server');

console.log('\n📁 Folder Status:');
console.log(`  dist folder exists: ${fs.existsSync(distPath)}`);
console.log(`  dist-server folder exists: ${fs.existsSync(distServerPath)}`);

// Ensure dist folder exists
if (!fs.existsSync(distPath)) {
  console.log('\n⚠️  Creating missing dist folder...');
  fs.mkdirSync(distPath, { recursive: true });
  console.log('✓ dist folder created');
}

// Check for index.html
const indexPath = path.join(distPath, 'index.html');
if (fs.existsSync(indexPath)) {
  const stats = fs.statSync(indexPath);
  console.log(`\n📄 Client Build:
  ✓ index.html exists (${stats.size} bytes)`);
} else {
  console.log('\n⚠️  Client Build: index.html not found');
}

// Check for server bundle
const serverBundlePath = path.join(distServerPath, 'index.js');
if (fs.existsSync(serverBundlePath)) {
  const stats = fs.statSync(serverBundlePath);
  console.log(`\n🖥️  Server Build:
  ✓ index.js exists (${stats.size} bytes)`);
} else {
  console.log('\n⚠️  Server Build: index.js not found');
}

// Summary
console.log('\n' + '='.repeat(50));
if (fs.existsSync(distPath) && fs.existsSync(distServerPath)) {
  console.log('✅ Build artifacts are ready for deployment\n');
  process.exit(0);
} else {
  console.log('⚠️  Some build artifacts are missing - deployment may fail\n');
  process.exit(0); // Don't fail the build, just warn
}
