'use strict';

var __svg__ = { path: './assets/svgstore/**/*.svg', name: './img/svgstore.[hash].svg' };

require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__);