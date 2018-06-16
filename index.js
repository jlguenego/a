#! /usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const package = require('./package');
const { handle, execute } = require('./core');

const gitResources = require('./git-resources');

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

const resources = Object.assign({}, gitResources);


const [resource, verb = 'list', ...args] = argv._;

if (argv._.length === 0) {
    console.log('Available resources:\n');
    console.log(Object.keys(resources).join('\n'));
    return;
}

if (!(resources[resource] && resources[resource][verb])) {
    console.log('No associated command for:', cmd);
    process.exit(1);
}

handle(resources[resource][verb], args);