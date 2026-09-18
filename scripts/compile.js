import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const isWindows = process.platform === 'win32';
console.log(`[VeilBid Compiler] Compiling contracts/auction.compact on ${process.platform}...`);

try {
  if (isWindows) {
    execSync('wsl bash -c "~/.local/bin/compact update 0.31.1 2>/dev/null || true; ~/.local/bin/compact compile contracts/auction.compact managed"', { stdio: 'inherit' });
  } else {
    try {
      execSync('compact update 0.31.1 2>/dev/null || true; compact compile contracts/auction.compact managed', { stdio: 'inherit' });
    } catch {
      execSync('~/.local/bin/compact update 0.31.1 2>/dev/null || true; ~/.local/bin/compact compile contracts/auction.compact managed', { stdio: 'inherit' });
    }
  }

  // Ensure public/managed directory exists and copy files
  const managedSrc = path.resolve('managed');
  const managedDest = path.resolve('public/managed');

  if (fs.existsSync(managedSrc)) {
    fs.cpSync(managedSrc, managedDest, { recursive: true });
    console.log('✅ Compiled artifacts copied to public/managed successfully!');
  }
} catch (err) {
  console.error('❌ Compilation failed:', err);
  process.exit(1);
}
