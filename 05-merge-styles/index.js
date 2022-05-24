const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'bundle.css'));

fs.promises.readdir(path.resolve(__dirname, 'styles')).then((files) => {
    files.forEach(file => {
        const filePath = path.resolve(__dirname, 'styles', file);
        fs.promises.stat(filePath).then((fileInfo) => {
            if (!fileInfo.isFile()) { return }
            const ext = path.extname(filePath);
            if (ext !== '.css') { return }
            const readableStream = fs.createReadStream(path.resolve(__dirname, 'styles', file), 'utf-8');
            readableStream.on('data', data => output.write(data)); 
        });
    })
});