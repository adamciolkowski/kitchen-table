const typescript = require('typescript');
const tsConfig = require('./tsconfig.json');

function isTypescriptFile(path) {
    return path.endsWith('.ts') || path.endsWith('.tsx');
}

module.exports = {
    process(src, path) {
        if (isTypescriptFile(path)) {
            return typescript.transpile(src, tsConfig.compilerOptions, path, []);
        }
        return src;
    }
};
