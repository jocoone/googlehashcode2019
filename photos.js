const {writeFile} = require('./io');
const intersection = require('lodash/intersection');
const difference = require('lodash/difference');
const uniq = require('lodash/uniq');
const min = require('lodash/min');
const max = require('lodash/max');
const maxBy = require('lodash/maxBy');
const minBy = require('lodash/minBy');
const findIndex = require('lodash/findIndex');
const pullAt = require('lodash/pullAt');
const orderBy = require('lodash/orderBy');

let MAX_SCORE = 0;

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
  constructor(id, photos, tags) {
    this.id = id;
    this.photos = photos;
    this.tags = tags;
    this.scores = {};
  }

  getScoreWithSlide(slide) {
    if (this.scores[slide.id]) {
      return this.scores[slide.id];
    }
    const common = intersection(this.tags, slide.tags);
    if (common === 0) {
      this.scores[slide.id] = 0;
      return 0;
    }
    const aNotB = difference(this.tags, slide.tags);
    if (aNotB === 0) {
      this.scores[slide.id] = 0;
      return 0;
    }
    const bNotA = difference(slide.tags, this.tags);
    const tagsinfo = {common, aNotB, bNotA,};
    const result = min([tagsinfo.common.length, tagsinfo.aNotB.length, tagsinfo.bNotA.length]);

    this.scores[slide.id] = result;

    return result;
  }

  toString() {
    return `${this.photos}: ${this.tags}`;
  }
}

const run = (input, outputFile) => {
  console.time('photos');
  const photos = getPhotos(input);
  const slidesToSort = getSlides(photos);
  //const x = removeZeros(slidesToSort);
  const result = [];
  while (slidesToSort.length > 0) {
    const l = slidesToSort.splice(0, 80);
    const slides = sortSlides(l);
    result.push(...slides);
    console.log(slidesToSort.length);
  }
  writeFile(`./output/${outputFile}`, slidesToString(result));
  console.timeEnd('photos');
  return input;
};

function sortSlides2(slides) {
  return orderBy(slides, (slide) => (slide.tags.length), 'desc');
}

function removeZeros(slides) {
  const result =[];
  for (let i = 0; i < slides.length; i++) {
    const slide1 = slides[i];

    const notZero = slides.some((s) => {
      return slide1.getScoreWithSlide(s) > 0;
    });

    if (notZero) {
      result.push(slide1);
    } else {
      console.log('niet toegevoegd');
    }
  }
  console.log('before', slides.length);
  console.log('after', result.length);
  return result;
}

function sortSlides(slides) {
  const result = [slides[0]];
  slides.splice(0, 1);
  while(slides.length !== 0) {
    const comparingSlide = result[result.length - 1];
    const maxSlide = maxBy(slides, (slide) => comparingSlide.getScoreWithSlide(slide));
    result.push(maxSlide);
    const indexToRemove = findIndex(slides, s => s.id === maxSlide.id);
    slides.splice(indexToRemove, 1);
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
  let i = 0;
  for (let hor = 0; hor < horizontals.length; hor++) {
    slides.push(new Slide(i++, [horizontals[hor].id], horizontals[hor].tags));
  }
  for (let ver = 0; ver < verticals.length; ver+=2) {
    const photo1 = verticals[ver];
    const photo2 = verticals[ver + 1];
    slides.push(new Slide(i++, [photo1.id, photo2.id], uniq([...photo1.tags, ...photo2.tags])));
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
