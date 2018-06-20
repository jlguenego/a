const { handle, execute, list, buildResources, log } = require('./core');
const { getConfig, setConfig, initConfig } = require('./config');

const resources = {
    '.resource': {
        list: (mode = 'available') => {
            const resources = Object.keys(buildResources());
            list(`Current mode: ${getConfig().currentMode}`, resources.filter(r => !r.startsWith('.')));
        },
    },
    '.plugin': {
        list: () => list('List of plugins', Object.keys(getConfig().plugins)),
        get: (id) => {
            console.log(`List of resources inside the plugin ${id}:`);
            const plugin = require(`./${id}-resources.js`);
            Object.keys(plugin).forEach(r => console.log(r));
        },
        delete: (pluginId) => {
            const config = getConfig();
            if (!(pluginId in config.plugins)) {
                console.error(`Error: ${pluginId} not in config.plugins.`)
                return;
            }

            delete config.plugins[pluginId];
            setConfig(config);
        },
        create(name, type) {
            const config = getConfig();
            config.plugins[name] = `./${name}-resources.js`;
            setConfig(config);
        }

    },
    '.mode': {
        help: log(`  DESCRIPTION

Mode is a concept allowing users to navigate with a reasonable number of resources.
Having too much resources limits the possibilities for abbreviation.

  USAGE

    a .mode                list all modes
    a .mode select <name>  select the mode <name>

  EXAMPLE

    To select the mode just list them all:
      $> a .mode
        git
      * docker
        all

    Then select one of them:
      $> a .mode select git
      mode git selected.

`),
        list: () => {
            const config = getConfig();
            Object.keys(config.modes).forEach(mode => console.log(`${config.currentMode === mode ? '*' : ' '} ${mode}`));
        },
        retrieve: (mode) => {

            const config = getConfig();
            console.log(`
Detailed view on mode ${mode}, list the plugins of the mode:
${JSON.stringify(config.modes[mode], null, 4)}
`);
        },
        select: (mode) => {
            const config = getConfig();
            if (!mode) {
                console.error(`Error: mode not specified.`);
                return;
            }
            if (!(mode in config.modes)) {
                console.error(`Error: ${mode} not in config.modes.`);
                return;
            }

            config.currentMode = mode;
            setConfig(config);
            console.log(`mode ${mode} selected.`)
        },
        create(name, type) {
            const config = getConfig();
            config.plugins[name] = `./${name}-resources.js`;
            setConfig(config);
        }

    },
    '.hidden-resource': {
        list: () => {
            const resources = Object.keys(buildResources());
            list(`Core resources:`, resources.filter(r => r.startsWith('.') && !['.hidden-resource', '.resource'].includes(r)));
        },
    },
    '.config': {
        list: () => {
            console.log(`
Config file content:

${JSON.stringify(getConfig(), null, 4)}

`)
        },
        empty: () => {
            console.log('reset the config file to its default.')
            initConfig();
            resources['.config'].list();
        },
        get: (name) => {
            const config = getConfig();
            console.log(config[name])
        },
        set: (name, value) => {
            const config = getConfig();
            config[name] = value;
            setConfig(config);
        },
    },
    '.tutorial': {
        list: log(`Welcome to the tutorial!
There is 3 parts.

To access one of them, please type a long or abbreviated form:

a .tutorial retrieve 1

a .tuto ret 2

a .t r 3

`),

        retrieve: (name) => {
            if (name === '1') {
                console.log(`
TUTORIAL Part #1
================


Prerequisite: git must be installed.

1) List the '.mode' core resource:
$> a -m

2) Select the git mode
$> a -m git

3) What resources you can use (in git mode):
$> a

`);
            }
            if (name === '2') {
                console.log(`
TUTORIAL Part #2
================
Prerequisite: do the tutorial part 1.

1) Create a git repository
$> a repository create myproject
$> cd myproject

2) Create a file and commit it.
$> echo coucou > toto.txt
$> a commit create ok

3) List the branches
$> a branch

4) Check the documentation for the branch resource
$> a branch help

Note: you can also use -h instead of help.

5) Create a new branch 'devel'
$> a branch create devel

6) Check the branch is created.
$> a b

 `);
            }
            if (name === '3') {
                console.log(`
TUTORIAL Part #3
================
Prerequisite: do the tutorial part 1 and 2.

1) select the default branch to 'devel'
$> a b s devel
Note: you do not need to type the entire resource or verb.
Just indicate enough characters to disambiguate.

2) select the default branch to 'master' using abreviation.
$> a b s master

Note: this is equivalent to "a branch select master".

3) remove the 'devel' branch using abbreviation.
$> a b d devel

4) Check that the branch is removed
$> a b

5) Congratulations! That is it!
`);
            }

        },
    },
};

module.exports = resources;