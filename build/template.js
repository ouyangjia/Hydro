const fs = require('fs');
const root = require('./root');

function getFiles(folder) {
    const files = [];
    const f = fs.readdirSync(root(folder));
    for (const i of f) {
        if (!i.startsWith('.')) {
            if (fs.statSync(root(`${folder}/${i}`)).isDirectory()) {
                const g = getFiles(`${folder}/${i}`);
                for (const j of g) files.push(`${i}/${j}`);
            } else files.push(i);
        }
    }
    return files;
}

const build = (dirOrObject, exclude = []) => {
    let templates = {};
    if (typeof dirOrObject === 'string') {
        const files = getFiles(dirOrObject);
        for (const i of files) {
            const template = fs.readFileSync(root(`${dirOrObject}/${i}`)).toString();
            templates[i] = template;
        }
    } else templates = dirOrObject;
    for (const i in templates) {
        if (!exclude.includes(i)) {
            templates[i] = templates[i]
                .trim()
                .replace(/ *\n */gmi, ' ')
                .replace(/, /gmi, ',')
                .replace(/%} {%/gmi, '%}{%')
                .replace(/ %}/gmi, '%}')
                .replace(/{% /gmi, '{%')
                .replace(/> </gmi, '><')
                .replace(/}} </gmi, '}}<')
                .replace(/> {{/gmi, '>{{')
                .replace(/{{ /gmi, '{{')
                .replace(/ }}/gmi, '}}')
                .replace(/%} </gmi, '%}<')
                .replace(/> {%/gmi, '>{%')
                .replace(/= /gmi, '=')
                .replace(/ =/gmi, '=')
                .trim();
        }
    }
    return templates;
};

module.exports = build;