const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const { stdin, stdout } = process;

stdout.write(`add your text here\n`);
stdin.on('data', data => {
    output.write(data);
    if (data.toString().trim() === 'exit') {
        process.exit();
    }
});

process.on('exit', () => stdout.write(`\ngood luck!\n`));
process.on('SIGINT', () => process.exit());