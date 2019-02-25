const yargs = require('yargs').argv;
const { readLines } = require('./io');

const run = () => {
  const code = require(`./${yargs.run}`);
  const result = code(readLines(`./input/${yargs.input}`), yargs.output);
};

run();
