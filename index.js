#! /usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const package = require('./package');

if (argv.v || argv.version) {
    console.log(package.version);
    return;
}

if (argv.h || argv.help) {
    console.log(`Usage: a [-v] [-h] <resource> <verb> <param>
-v: version
-h: help`);
    return;
}

console.log('Available resources');

