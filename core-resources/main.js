const { handle, execute, list, buildResources, log } = require('../core');
const { getConfig, setConfig, initConfig } = require('../config');

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
    '.tutorial': require('./tutorial'),

};

module.exports = resources;