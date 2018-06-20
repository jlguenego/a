const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { getConfig } = require('./config');

function buildResources() {
    try {
        const config = getConfig();
        const resources = {};
        const plugins = config.modes[config.currentMode];

        plugins.forEach(key => {
            try {
                Object.assign(resources, require(config.plugins[key]));
            } catch (e) {
                console.error(`problem trying to load plugin ${key} ${config.plugins[key]}`, e);
            }
        });


        Object.assign(resources, require('./core-resources'));
        return resources;
    } catch (e) {
        console.error('Cannot build the resources, there is something wrong with the config. error: ', e);
        process.exit(1);
    }
}

async function execute(cmd) {
    try {
        console.log('executing:', cmd);
        const { stdout, stderr } = await exec(cmd);
        console.log(stdout);
        console.error(stderr);
    } catch (e) {
        console.log(e.stdout);
        console.error(e.stderr);
        throw new Error('Stop!!!');
    }
}

async function handle(program, resource, verb, args) {
    const resources = program.resources;
    if (program.simulation) {
        console.log('Simulation mode: show the source code without execution.');
    }
    if (!resources[resource]) {
        console.log(`a ${resource} : resource not found.`);
        process.exit(1);
    }
    if (verb === 'help' && !resources[resource].help) {
        printDefaultHelp(program, resources, resource, verb, args);
        return;
    }
    if (!resources[resource][verb]) {
        console.log(`a ${resource} ${verb}: no implementation.`);
        process.exit(1);
    }
    let procedure;
    if (typeof resources[resource][verb] === 'string') {
        procedure = async function () {
            const cmd = resources[resource][verb] + args.map(a => `"${a}"`).join(' ');
            await execute(cmd);
        };
    } else {
        procedure = resources[resource][verb];
    }
    if (program.simulation) {
        console.log(resources[resource][verb].toString());
        console.log(`args: ${JSON.stringify(args)}`);
        return;
    }
    await procedure(...args);
    printVerboseInfo(program, resources, resource, verb, args);
}

function printVerboseInfo(program, resources, resource, verb, args) {
    if (program.config.verbose !== 'true' || verb === 'help') {
        return;
    }
    console.log('\n\n\n--> verbose info start');
    console.log('Command executed: a', resource, verb, ...args);
    console.log('To get help: a', resource, 'help');

    const crudle = ['create', 'retrieve', 'update', 'delete', 'list', 'empty'];
    const crudVerbs = crudle.filter(v => Object.keys(resources[resource]).includes(v));
    const otherVerbs = Object.keys(resources[resource]).filter(v => !crudle.includes(v)).sort();
    console.log('REST verbs: ' + crudVerbs.join(' | ') + '\n');
    if (otherVerbs.length > 0) {
        console.log('Other verbs: ' + otherVerbs.join(' | ') + '\n');
    }
    console.log('--> verbose info end');
}

function printDefaultHelp(program, resources, resource, verb, args) {
    console.log('Default help for resource', resource);
    const crudle = ['create', 'retrieve', 'update', 'delete', 'list', 'empty'];
    const crudVerbs = crudle.filter(v => Object.keys(resources[resource]).includes(v));
    const otherVerbs = Object.keys(resources[resource]).filter(v => !crudle.includes(v)).sort();
    console.log('REST verbs: ' + crudVerbs.join(' | '));
    if (otherVerbs.length > 0) {
        console.log('Other verbs: ' + otherVerbs.join(' | '));
    } else {
        console.log('No other verb.');
    }
    console.log(`Syntax: a ${resource} <verb> ...`);
}

/**
 * Sometimes the user don't remember if it is delete or remove, retrieve or get, etc.
 *
 * @param {*} verb
 * @returns
 */
function manageVerbSynonym(verb) {
    const verbMatrix = [
        ['create'],
        ['retrieve'],
        ['update'],
        ['delete'],

        ['list'],
        ['empty'],

        ['help', '-h'],

        ['select'],
        ['get'],
        ['set']
    ];
    const verbs = verbMatrix.reduce((acc, n) => acc.concat(n), []);
    verb = disambiguate('verb', verb, verbs);
    verb = verbMatrix.reduce((acc, n) => n.includes(acc) ? n[0] : acc, verb);
    return verb;
}

function disambiguate(type, name, names) {
    const array = (names instanceof Array) ? names : Object.keys(names);
    const filteredNames = array.filter(r => r.startsWith(name));
    if (filteredNames.length > 1) {
        console.error(`Please disambiguate ${type} "${name}" from `, filteredNames);
        process.exit(1);
    }
    if (filteredNames.length === 0) {
        if (type === 'resource') {
            console.error(`Cannot understand ${type} "${name}".`);
        }
        if (type === 'verb') {
            console.error(`Cannot understand ${type} "${name}".
Please use only CRUD verb: "${array.join(', ')}".`);
        }
        process.exit(1);
    }
    return filteredNames[0];
}

function list(prefix, array) {
    console.log(prefix + '\n');
    array.sort().forEach(i => console.log('a ' + i));
}


function notSignificant() {
    console.log('Sorry. Not implemented. Because it is not significant for this resource.');
}

const log = str => () => console.log(str);


module.exports = {
    list,
    execute,
    handle,
    manageVerbSynonym,
    disambiguate,
    buildResources,
    notSignificant,
    log,
};