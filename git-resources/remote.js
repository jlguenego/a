const { execute, notSignificant, log } = require('../core');

module.exports = {
    list: 'git remote -v',
    empty: notSignificant,
    async create(name, url) {
        // Ex: a remote create upstream https://github.com/jlguenego/a.git
        await execute(`git remote add "${name}" "${url}"`);
    },
    retrieve: 'git remote show <repository>',
    update: notSignificant,
    async delete(name) {
        await execute(`git remote remove "${name}"`);
    },
};
