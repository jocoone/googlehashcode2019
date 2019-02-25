const readFileSync = require('fs').readFileSync;
const writeFileSync = require('fs').writeFileSync;

const readCompleteFile = path => readFileSync(path, 'utf8');
const readLines = path => readCompleteFile(path).split('\n');
const writeFile = (path, content, options) => writeFileSync(`${path}.out`, content, options);

module.exports = {
  readFile: readCompleteFile,
  readLines,
  writeFile
};
