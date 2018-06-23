const { execute, log } = require('../core');

module.exports = {
    list: 'git remote -v',
    async create(name, url) {
        // Ex: a remote create upstream https://github.com/jlguenego/a.git
        await execute(`git remote add "${name}" "${url}"`);
    },
    retrieve: 'git remote show <repository>',
    async delete(name) {
        await execute(`git remote remove "${name}"`);
    },
};
