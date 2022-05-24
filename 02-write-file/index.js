const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const { stdin, stdout } = process;

stdout.write(`add your text here\n`);
stdin.on('data', data => {
    if (data.toString().trim() === 'exit') {
        process.exit();
    }
    output.write(data);
});

process.on('exit', () => stdout.write(`\ngood luck!\n`));
process.on('SIGINT', () => process.exit());