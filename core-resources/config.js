const { log } = require('../core');
const { getConfig, setConfig, configFilename, initConfig } = require('../config');

const config = {
    list: () => {
        console.log(`
Config file location: ${configFilename}
Config file content:

${JSON.stringify(getConfig(), null, 4)}

`)
    },
    empty: () => {
        console.log('reset the config file to its default.')
        initConfig();
    },
    get: (name) => {
        const config = getConfig();
        console.log(config[name])
    },
    set: (name, value) => {
        const config = getConfig();
        if (value === "false") {
            value = false;
        }
        if (value === "true") {
            value = true;
        }
        config[name] = value;
        setConfig(config);
    },
    delete: (name) => {
        const config = getConfig();
        delete config[name];
        setConfig(config);
    }
};

config.retrieve = config.get;
config.update = config.set;

module.exports = config;
