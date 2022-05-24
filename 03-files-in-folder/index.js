const fs = require('fs');
const path = require('path');

fs.promises.readdir(path.resolve(__dirname, 'secret-folder')).then((files) => {
    files.forEach(file => {
        const filePath = path.resolve(__dirname, 'secret-folder', file);
        fs.promises.stat(filePath).then((fileInfo) => {
            if (!fileInfo.isFile()) { return }
            const {name, ext} = path.parse(filePath);
            console.log(`${name} - ${ext.slice(1)} - ${fileInfo.size}`)
        });
    })
});

