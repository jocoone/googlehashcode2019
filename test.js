const {writeFile} = require('./io');

const run = (input, outputFile) => {
  const NUMBER_OF_PHOTOS = input[0];
  console.log(input);

  writeFile(`./output/${outputFile}`, input);
  return input;
};

module.exports = run;
