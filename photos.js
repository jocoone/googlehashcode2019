const {writeFile} = require('./io');
const intersection = require('lodash/intersection');
const difference = require('lodash/difference');
const uniq = require('lodash/uniq');

class Photo {
  constructor(id, orientation, tags) {
    this.id= id;
    this.orientation = orientation;
    this.tags = tags;
  };

  getTagsInfo(photo) {
    return {
      id1: this.id,
      id2: photo.id,
      common: intersection(this.tags, photo.tags),
      aNotB: difference(this.tags, photo.tags),
      bNotA: difference(photo.tags, this.tags)
    };
  }

  toString() {
    return `Photo ${this.id} -> ${this.orientation}, ${this.tags}`;
  }
}

class Slide {
  constructor(photos, tags) {
    this.photos = photos;
    this.tags = tags;
  }

  toString() {
    return `${this.photos}: ${this.tags}`;
  }
}

const run = (input, outputFile) => {
  console.time('photos');
  const photos = getPhotos(input);
  const slides = getSlides(photos);

  /*for (let photo = 0; photo < photos.length; photo++) {
    const otherPhotos = photos.filter(p => p.id !== photos[photo].id);
    for (let x = 0; x < otherPhotos.length; x++) {
      console.log(photos[photo].getTagsInfo(otherPhotos[x]));
    }
  }

  console.log(test);*/
  writeFile(`./output/${outputFile}`, slidesToString(slides));
  console.timeEnd('photos');
  return input;
};

function slidesToString(slides) {
  let result = '' + slides.length +'\n';
  for (let slide = 0; slide < slides.length; slide++) {
    result += slides[slide].photos.join(' ') + '\n';
  }
  return result;
}

function getSlides(photos) {
  const horizontals = getHorizontals(photos);
  const verticals = getVerticals(photos);

  const slides = [];
  for (let hor = 0; hor < horizontals.length; hor++) {
    slides.push(new Slide([horizontals[hor].id], horizontals[hor].tags));
  }
  for (let ver = 0; ver < verticals.length; ver+=2) {
    const photo1 = verticals[ver];
    const photo2 = verticals[ver + 1];
    slides.push(new Slide([photo1.id, photo2.id], uniq([...photo1.tags, ...photo2.tags])));
  }
  return slides;
}

function getVerticals(photos) {
  return photos.filter(p => p.orientation === 'V');
}

function getHorizontals(photos) {
  return photos.filter(p => p.orientation === 'H');
}

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
    //console.log(photo.toString());
  }
  return photos;
}

module.exports = run;
