const {writeFile} = require('./io');
const intersection = require('lodash/intersection');
const difference = require('lodash/difference');
const uniq = require('lodash/uniq');
const min = require('lodash/min');
const max = require('lodash/max');
const maxBy = require('lodash/maxBy');
const findIndex = require('lodash/findIndex');
const pullAt = require('lodash/pullAt');

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

class Slide {
  constructor(photos, tags) {
    this.photos = photos;
    this.tags = tags;
  }

  getScoreWithSlide(slide) {
    const tagsinfo = {
      common: intersection(this.tags, slide.tags),
      aNotB: difference(this.tags, slide.tags),
      bNotA: difference(slide.tags, this.tags)
    };

    return min([tagsinfo.common.length, tagsinfo.aNotB.length, tagsinfo.bNotA.length])
  }

  toString() {
    return `${this.photos}: ${this.tags}`;
  }
}

const run = (input, outputFile) => {
  console.time('photos');
  const photos = getPhotos(input);
  const slidesToSort = getSlides(photos);
  const slides = sortSlides(slidesToSort);
  writeFile(`./output/${outputFile}`, slidesToString(slides));
  console.timeEnd('photos');
  return input;
};

function sortSlides(slides) {
  const result = [slides[0]];
  slides.splice(0, 1);
  while(slides.length !== 0) {
    const comparingSlide = result[result.length - 1];
    const maxSlide = maxBy(slides, (slide) => comparingSlide.getScoreWithSlide(slide));
    result.push(maxSlide);
    const indexToRemove = findIndex(slides, s => s.id === maxSlide.id);
    slides.splice(indexToRemove, 1);
    if (result.length % 100 === 0) {
      console.log(result.length);
    }
  }
  return result;
}

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
