const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SERVICE_DIR = path.resolve(__dirname, '../../d2r-service');
const FUNCTIONS_DIR = path.resolve(__dirname, '../functions');

console.log('Building d2r-service...');
execSync('npm run build', { cwd: SERVICE_DIR, stdio: 'inherit' });

console.log('Syncing to functions/...');
fs.rmSync(FUNCTIONS_DIR, { recursive: true, force: true });
fs.mkdirSync(FUNCTIONS_DIR, { recursive: true });

fs.cpSync(path.join(SERVICE_DIR, 'dist'), path.join(FUNCTIONS_DIR, 'dist'), { recursive: true });

for (const file of ['package.json', 'd2r.sqlite']) {
  fs.copyFileSync(path.join(SERVICE_DIR, file), path.join(FUNCTIONS_DIR, file));
}

console.log('Installing dependencies...');
execSync('npm install', { cwd: FUNCTIONS_DIR, stdio: 'inherit' });

console.log('Done.');
