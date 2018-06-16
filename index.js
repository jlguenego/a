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
        create: async function (message) {
            await execute('git add *');
            await execute('git commit -m ' + message);
        },
        delete: async function (id) {
            // remove last commit.
            await execute('git reset --hard HEAD~1');
        },
    },
    'modified': {
        list: 'git status'
    }
};

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

async function execute(cmd) {
    console.log('executing:', cmd);
    const { stdout, stderr } = await exec(cmd);
    console.log('finished');
    console.log(stdout);
    console.error(stderr);
    return;
}

async function handle(spec) {
    if (typeof spec === 'string') {
        const cmd = spec + ' ' + args.join(' ');
        await execute(cmd);
    }
    // spec should be a async function.
    await spec(args);

}

handle(resources[resource][verb]);