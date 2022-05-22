const fs = require('fs');
const path = require('path');

const mergeStyles = (src, dest) => {
    const outputCss = fs.createWriteStream(dest);

    fs.promises.readdir(src).then((files) => {
        files.forEach(file => {
            const filePath = path.resolve(src, file);
            fs.promises.stat(filePath).then((fileInfo) => {
                if (!fileInfo.isFile()) { return }
                const ext = file.split('.')[1];
                if (ext !== 'css') { return }
                const readableStream = fs.createReadStream(path.resolve(src, file), 'utf-8');
                readableStream.on('data', data => outputCss.write(data));
            });
        })
    });
}

const copyDir = async (src, dest) => {
    await fs.promises.rm(dest, { recursive: true, force: true });
    await fs.promises.mkdir(dest, { recursive: true });

    const files = await fs.promises.readdir(src);
    for (const file of files) {
        const filePath = path.resolve(src, file);
        const fileCopyPath = path.resolve(dest, file);
        fs.promises.stat(filePath).then((fileInfo) => {
            if (fileInfo.isFile()) {
                fs.promises.copyFile(filePath, fileCopyPath).then();
            } else {
                copyDir(filePath, fileCopyPath)
            }
        })
    }
}

const createHtml = async (src, dest, data) => {
    const template = await fs.promises.readFile(src);
    let html = template.toString();
    const components = await fs.promises.readdir(data);
    for (const component of components) {
        const componentName = component.split('.')[0];
        const componentPath = path.resolve(data, component);
        const componentData = await fs.promises.readFile(componentPath);
        const componentDataStr = componentData.toString();
        html = html.replace(`{{${componentName}}}`, componentDataStr);
    }
    await fs.promises.writeFile(dest, html);
}

const buildPage = async () => {
    await fs.promises.mkdir(path.resolve(__dirname, 'project-dist'), { recursive: true });

    const srcHtml = path.resolve(__dirname, 'template.html');
    const destHtml = path.resolve(__dirname, 'project-dist', 'index.html');
    const dataHtml = path.resolve(__dirname, 'components');
    createHtml(srcHtml, destHtml, dataHtml);

    const srcCss = path.resolve(__dirname, 'styles');
    const destCss = path.resolve(__dirname, 'project-dist', 'style.css');
    mergeStyles(srcCss, destCss);

    const srcAssets = path.resolve(__dirname, 'assets');
    const destAssets = path.resolve(__dirname, 'project-dist', 'assets');
    copyDir(srcAssets, destAssets);
}

buildPage();