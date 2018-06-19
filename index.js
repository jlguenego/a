#! /usr/bin/env node

const program = require('commander');
const package = require('./package');
const { handle, execute, manageVerbSynonym, disambiguate, list, buildResources, printUnderstoodCommand } = require('./core');

program
	.name('a')
	.usage('[options] <resource> [<verb> [<args...>]]')

	.option('-s, --simulation', 'simulation mode.')
	.option('-c, --core', 'list hidden core resources.')
	.option('-m, --mode [newmode]', 'print mode or set [newmode]\n')
	.on('--help', () => {
		console.log(`

  Getting started

    +----------------+
    |$> a .tutorial  |
    +----------------+

License: ISC
Author: Jean-Louis GUENEGO <jlguenego@gmail.com> (https://jlg-consulting.com)

`)
	})
	.version(package.version, '-v, --version')
	;

program.parse(process.argv);
program.resources = buildResources();

if (program.mode === true) {
	handle(program, '.mode', 'list', []);
	return;
}
if (typeof program.mode === 'string') {
	handle(program, '.mode', 'select', [program.mode]);
	return;
}

let defaultResource = '.resource';
if (program.core) {
	defaultResource = '.hidden-resource';
}

// console.log(program);



let [r = defaultResource, v = 'list', ...args] = program.rawArgs.slice(program.simulation || program.core ? 3 : 2);
const resource = disambiguate('resource', r, program.resources);
const verb = manageVerbSynonym(v);

if (resource !== r || verb != v || program.args.length > 0) {
	console.log('Command executed: a', resource, verb, ...args, '\n');
}
handle(program, resource, verb, args);
