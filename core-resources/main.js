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
    '.mode': require('./mode'),
    '.hidden-resource': {
        list: () => {
            const resources = Object.keys(buildResources());
            list(`Core resources:`, resources.filter(r => r.startsWith('.') && !['.hidden-resource', '.resource'].includes(r)));
        },
    },
    '.config': require('./config'),
    '.tutorial': require('./tutorial'),

};

module.exports = resources;