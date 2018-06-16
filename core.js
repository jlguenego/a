const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function execute(cmd) {
    console.log('executing:', cmd);
    const { stdout, stderr } = await exec(cmd);
    console.log('finished');
    console.log(stdout);
    console.error(stderr);
}

async function handle(spec) {
    if (typeof spec === 'string') {
        const cmd = spec + ' ' + args.join(' ');
        await execute(cmd);
        return;
    }
    // spec should be a async function.
    await spec(...args);

}

module.exports = {
    execute, 
    handle,
};