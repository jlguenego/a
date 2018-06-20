const { execute, notSignificant, log } = require('../core');

module.exports = {
    list: 'git status',
    empty: 'git reset --hard',
    delete: async function (file) {
        await execute(`git checkout -- "${file}"`);
    },
    create: notSignificant,
    retrieve: async function (file) {
        await execute(`git diff HEAD "${file}"`);
    },
    update: notSignificant,
};
