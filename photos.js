const {writeFile} = require('./io');

class Photo {
  constructor(id, orientation, tags) {
    this.id= id;
    this.orientation = orientation;
    this.tags = tags;
  };

  toString() {
    return `Photo ${this.id} -> ${this.orientation}, ${this.tags}`;
  }
}

const run = (input, outputFile) => {
  const photos = getPhotos(input);
  writeFile(`./output/${outputFile}`, input);
  return input;
};

function getPhotos(input) {
  const photos = [];
  const NUMBER_OF_PHOTOS = input[0];
  for (let i = 0; i < NUMBER_OF_PHOTOS; i++) {
    const lineSplit = input[i + 1].split(' ');
    const tags = [];
    for (let tag = 0; tag < parseInt(lineSplit[1]); tag++) {
      tags.push(lineSplit[tag + 2]);
    }
    const photo = new Photo(i, lineSplit[0], tags);
    photos.push(photo);
    console.log(photo.toString());
  }
  return photos;
}

module.exports = run;
