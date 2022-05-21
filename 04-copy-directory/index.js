const fs = require('fs');
const path = require('path');

async function copyDir() {
    await fs.promises.mkdir(path.resolve(__dirname, 'files-copy'), { recursive: true });

    const filesCopy = await fs.promises.readdir(path.resolve(__dirname, 'files-copy'));
    for (const file of filesCopy) {
        await fs.promises.rm(path.resolve(__dirname, 'files-copy', file))
    };

    const files = await fs.promises.readdir(path.resolve(__dirname, 'files'));
    for (const file of files) {
        const filePath = path.resolve(__dirname, 'files', file);
        const fileCopyPath = path.resolve(__dirname, 'files-copy', file);
        await fs.promises.copyFile(filePath, fileCopyPath);
    }
}

copyDir();