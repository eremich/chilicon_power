// Runs a local CLI (vite, storybook) with this project as the working directory.
// Lets preview tools started from another folder launch this project's servers.
const { spawn } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const [bin, ...args] = process.argv.slice(2);
const entry = { vite: 'node_modules/vite/bin/vite.js', storybook: 'node_modules/storybook/dist/bin/dispatcher.js' }[bin];
const child = spawn(process.execPath, [path.join(root, entry), ...args], { cwd: root, stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
