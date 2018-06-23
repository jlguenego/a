const { execute, log } = require('../core');
const fs = require('fs');
const util = require('util');
const rimraf = require('rimraf');

module.exports = {
    async create(name) {
        await execute(`git init ${name}`);
    },
    async delete(name) {
        // check that name/.git exists.
        try {
            const stat = fs.statSync(`${name}/.git`);
            if (!stat.isDirectory()) {
                throw 'not a directory';
            }
            await util.promisify(rimraf)(name);
        } catch (e) {
            console.error(`Error: ${name} is not a git repository`, e);
        }

    },
};
