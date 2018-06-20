const { log } = require('../core');
const { getConfig, setConfig } = require('../config');

module.exports = {
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

};
