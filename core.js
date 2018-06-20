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
        console.error(e);
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
        console.log(`Implemented verb for ${resource}:`);
        printHateoas(resources, resource);
        return;
    }
    if (!resources[resource][verb]) {
        console.log(`a ${resource} ${verb}: no implementation.`);
        process.exit(1);
    }
    let procedure;
    if (typeof resources[resource][verb] === 'string') {
        procedure = async function() {
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
    if (verb === 'list') {
        // hateoas
        console.log('links:')
        printHateoas(resources, resource);
    }
}

function printHateoas(resources, resource) {
    Object.keys(resources[resource]).sort((a, b) => {
        const crudle = ['create', 'retrieve', 'update', 'delete', 'list', 'empty'];
        let ia = crudle.indexOf(a);
        let ib = crudle.indexOf(b);
        ia = (ia === -1) ? crudle.length : ia;
        ib = (ib === -1) ? crudle.length : ib;
        if (ia === ib) {
            if (ia < crudle.length) {
                return 0;
            }
            return a < b ? -1 : a > b ? 1 : 0

        }
        return ia < ib ? -1 : 1;
    }).forEach(verb => console.log(`a ${resource} ${verb}`));
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