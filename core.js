const path = require('path');
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
                if (config.plugins[key].startsWith('.')) {
                    Object.assign(resources, require(config.plugins[key])({ execute, log }));
                    return;
                }
                const prefix = config.globalModulesDir;
                Object.assign(resources, require(path.resolve(prefix, config.plugins[key]))({ execute, log }));

            } catch (e) {
                console.error(`problem trying to load plugin ${key} ${config.plugins[key]}`, e);
            }
        });

        Object.assign(resources, require('./core-resources/main.js'));
        return resources;
    } catch (e) {
        console.error('Cannot build the resources, there is something wrong with the config. error: ', e);
        process.exit(1);
    }
}

async function execute(cmd, exit = true) {
    try {
        console.log('executing:', cmd);
        const { stdout, stderr } = await exec(cmd);
        console.log(stdout);
        console.error(stderr);
        return { stdout, stderr };
    } catch (e) {
        console.log(e.stdout);
        console.error(e.stderr);
        if (exit) {
            process.exit(e.code);
        }
        throw e;
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
        printDefaultHelp(program, resources, resource, args);
        return;
    }
    if (!resources[resource][verb]) {
        console.log(`a ${resource} ${verb}: no implementation.`);
        process.exit(1);
    }
    // resource verb exist.
    // check if verb take help itself.
    if (['-h', '--help'].includes(args[0])) {
        if (resources[resource][verb] instanceof Function && resources[resource][verb].includedHelp) {
            // ok nothing to do.
        } else {
            printDefaultHelpforVerb(program, resources, resource, verb, args);
        }
    }

    let procedure;
    if (typeof resources[resource][verb] === 'string') {
        procedure = async function () {
            const cmd = parseCommand(resources[resource][verb], args);
            try {
                await execute(cmd);
            } catch (e) {
                console.log(e);
            }
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
    printTipsInfo(program, resources, resource, verb, args);
}

function parseCommand(str, args) {
    let i = 0;
    const result = str.replace(/([<\[].*?[>\]])/g, (match) => {
        if (match.startsWith('[...')) {
            return args.join(' ');
        }
        if (match.startsWith('<')) {
            if (i >= args.length) {
                console.error(`Argument missing, usage: ${str}`);
                process.exit(1);
            }
            return `"${args[i++]}"`;
        }
        if (match.startsWith('[')) {
            if (i in args) {
                return `"${args[i++]}"`;
            } else {
                const defaultVal = match.match(/^\[.*?=.*?\]$/) ? match.replace(/^\[.*?=(.*?)\]$/, '$1') : '';
                return defaultVal;
            }
        }
        throw new Error('cannot parse command', str, args);
    });
    return result;
}

function printTipsInfo(program, resources, resource, verb, args) {
    if (getConfig().tips !== true || verb === 'help') {
        return;
    }

    const crudle = ['create', 'retrieve', 'update', 'delete', 'list', 'empty'];
    const crudVerbs = crudle.filter(v => Object.keys(resources[resource]).includes(v));
    const otherVerbs = Object.keys(resources[resource]).filter(v => !crudle.includes(v)).sort();

    console.log(`


+-------------
|TIPS INFO
+-------------
|Command executed: a ${resource} ${verb} ${args.join(' ')}
|Getting help: a ${resource} help
|Using <verb>: a ${resource} <verb>
|
|REST verbs: ${crudVerbs.join(' | ')}
|
|${otherVerbs.length > 0 ? otherVerbs.join(' | ') : 'No other verbs.'}
|
+-------------
|To switch off tips info: 
|  $> a .config set tips false
+-------------
`);
}

function printDefaultHelp(program, resources, resource, args) {
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

function printDefaultHelpforVerb(program, resources, resource, verb, args) {
    if (['create', 'retrieve', 'update', 'delete'].includes(verb)) {
        console.log(`
  Usage: a ${resource} ${verb} <name>

  ${verb.replace(/^(.)/, (match) => match.toUpperCase())} a ${resource}.
`);
    } else if (['list', 'empty'].includes(verb)) {
        console.log(`
        Usage: a ${resource} ${verb}
      `);
    } else {
        console.log(`
        Sorry, no help implemented for command: a ${resource} ${verb}.

        But...

        I can give you the source code that should be executed: 

    ${resources[resource][verb].toString()}
      `);
    }
    console.log(`
  No custom help
`);
    process.exit(0);
}

/**
 * Sometimes the user don't remember if it is delete or remove, retrieve or get, etc.
 *
 * @param {*} verb
 * @returns
 */
function manageVerbSynonym(program, resource, verb) {
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
        ['set'],
        ['merge'],
        ['push'],
        ['pull'],
    ];
    const verbs = verbMatrix.reduce((acc, n) => acc.concat(n), []).filter(v => Object.keys(program.resources[resource]).includes(v));
    if (!verbs.includes('help')) {
        verbs.push('help');
        verbs.push('-h');
    }
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

const log = str => () => console.log(str);

module.exports = {
    list,
    execute,
    handle,
    manageVerbSynonym,
    disambiguate,
    buildResources,
    log,
    parseCommand,
};