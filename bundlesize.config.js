// Simple bundle size monitoring config
// Since bundlesize package has issues, we'll create a simple size checker

const fs = require('fs');
const path = require('path');
const { gzipSize } = require('gzip-size');

const BUNDLE_LIMITS = {
  'dist/frost-glass.min.css': 20 * 1024, // 20KB gzipped (maintaining current ~15KB)
  'dist/frost-glass.min.js': 10 * 1024,  // 10KB gzipped for vanilla JS
  'dist/frost-glass.esm.js': 12 * 1024,  // 12KB for ESM (unminified)
  'dist/frost-glass.umd.js': 12 * 1024   // 12KB for UMD (unminified)
};

async function checkBundleSizes() {
  console.log('\n📦 Bundle Size Check\n');
  
  let hasErrors = false;
  
  for (const [filePath, limit] of Object.entries(BUNDLE_LIMITS)) {
    const fullPath = path.resolve(filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  ${filePath} - File not found (skipping)`);
      continue;
    }
    
    const stats = fs.statSync(fullPath);
    const uncompressedSize = stats.size;
    
    let compressedSize;
    try {
      const fileContent = fs.readFileSync(fullPath);
      compressedSize = await gzipSize(fileContent);
    } catch (error) {
      console.log(`❌ ${filePath} - Error calculating gzip size:`, error.message);
      hasErrors = true;
      continue;
    }
    
    const withinLimit = compressedSize <= limit;
    const status = withinLimit ? '✅' : '❌';
    const percentage = Math.round((compressedSize / limit) * 100);
    
    console.log(`${status} ${filePath}`);
    console.log(`   Size: ${formatBytes(uncompressedSize)} → ${formatBytes(compressedSize)} (gzipped)`);
    console.log(`   Limit: ${formatBytes(limit)} (${percentage}% used)`);
    
    if (!withinLimit) {
      hasErrors = true;
      console.log(`   ⚠️  OVER LIMIT by ${formatBytes(compressedSize - limit)}`);
    }
    
    console.log('');
  }
  
  if (hasErrors) {
    console.log('❌ Bundle size check failed - some files exceed limits');
    process.exit(1);
  } else {
    console.log('✅ All bundle sizes within limits');
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run if called directly
if (require.main === module) {
  checkBundleSizes().catch(console.error);
}

module.exports = { checkBundleSizes, BUNDLE_LIMITS };