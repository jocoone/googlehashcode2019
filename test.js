const {writeFile} = require('./io');

const run = (input, outputFile) => {
  writeFile(`./output/${outputFile}`, input);
  return input;
};

module.exports = run;
