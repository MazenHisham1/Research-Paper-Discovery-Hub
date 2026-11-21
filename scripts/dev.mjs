import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log('\x1b[36m%s\x1b[0m', ' Starting Research-Paper-Discovery-Hub Dev Environment ');
console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log('\x1b[32m%s\x1b[0m', 'Backend:  http://localhost:5023');
console.log('\x1b[34m%s\x1b[0m', 'Frontend: http://localhost:3000');
console.log('Press Ctrl+C to shut down both services.\n');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const pnpmCmd = isWindows ? 'pnpm.cmd' : 'pnpm';

// 1. Spawn Backend Server
const serverProcess = spawn('node', ['application/server/server.mjs'], {
  cwd: rootDir,
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: isWindows,
});

serverProcess.stdout.on('data', (data) => {
  const lines = data.toString().trimEnd().split('\n');
  for (const line of lines) {
    console.log('\x1b[32m[Backend]\x1b[0m ' + line);
  }
});

serverProcess.stderr.on('data', (data) => {
  const lines = data.toString().trimEnd().split('\n');
  for (const line of lines) {
    console.error('\x1b[31m[Backend Err]\x1b[0m ' + line);
  }
});

// 2. Spawn Frontend (try pnpm first, fallback to npm)
let frontendProcess;
try {
  frontendProcess = spawn(pnpmCmd, ['--prefix', 'application/frontend', 'run', 'dev'], {
    cwd: rootDir,
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: isWindows,
  });
} catch {
  frontendProcess = spawn(npmCmd, ['--prefix', 'application/frontend', 'run', 'dev'], {
    cwd: rootDir,
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: isWindows,
  });
}

frontendProcess.stdout.on('data', (data) => {
  const lines = data.toString().trimEnd().split('\n');
  for (const line of lines) {
    console.log('\x1b[34m[Frontend]\x1b[0m ' + line);
  }
});

frontendProcess.stderr.on('data', (data) => {
  const lines = data.toString().trimEnd().split('\n');
  for (const line of lines) {
    console.error('\x1b[33m[Frontend Msg]\x1b[0m ' + line);
  }
});

function cleanup() {
  console.log('\nShutting down dev environment...');
  try {
    if (serverProcess) serverProcess.kill();
  } catch {}
  try {
    if (frontendProcess) frontendProcess.kill();
  } catch {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
