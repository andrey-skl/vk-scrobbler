#!/usr/bin/env bash

cp -rv -X ./blocks dist/blocks
cp -rv -X ./_locales dist/_locales
cp -rv -X ./img dist/img
mkdir -p dist/node_modules/js-md5/build
cp node_modules/js-md5/build/md5.min.js dist/node_modules/js-md5/build/md5.min.js
cp manifest.json dist/
