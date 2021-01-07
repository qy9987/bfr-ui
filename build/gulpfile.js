'use strict';
/* eslint-disable @typescript-eslint/no-var-requires */
const { series, src, dest } = require('gulp');
const less = require('gulp-less');
const path = require('path');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');

const noElPrefixFile = /(index|base|display)/;

function compile() {
  return src('../packages/theme/src/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ],
    }))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cssmin())
    .pipe(rename(function (path) {
      if(!noElPrefixFile.test(path.basename)) {
        path.basename = `bfr-${path.basename}`;
      }
    }))
    .pipe(dest('../lib/theme'));
}

function copyfont() {
  return src('packages/theme/src/fonts/**')
    .pipe(cssmin())
    .pipe(dest('../lib/theme/fonts'));
}

exports.build = series(compile, copyfont);
