#! /usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const package = require('./package');
const util = require('util');
const exec = util.promisify(require('child_process').exec);



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

const resources = {
    'commit': {
        list: 'git log',
        get: 'git show',
        create: 'git commit -m '
    }
};

const [resource, verb = 'list', ...args] = argv._;

if (argv._.length === 0) {
    console.log('Available resources:\n');
    console.log(Object.keys(resources).join('\n'));
    return;
}

const cmd = resources[resource][verb] + ' ' + args.join(' ');
if (!cmd) {
    console.log('No associated command for command:', cmd);
    process.exit(1);
}



async function execute(cmd) {
    console.log('executing:', cmd);

    const { stdout, stderr } = await exec(cmd);
    console.log('finished');
    console.log(stdout);
    console.error(stderr);
    return 0;
}

execute(cmd);