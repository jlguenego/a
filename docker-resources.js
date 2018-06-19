const { handle, execute, notSignificant } = require('./core');

const resources = {
    image: {
        list: 'git log --reverse',
        retrieve: 'git show',
        create: async function (message) {
            await execute('git add *');
            await execute(`git commit -m "${message}"`);
        },
        delete: async function (id) {
            if (id === 'last') {
                // remove last commit.
                await execute('git reset --hard HEAD~1');
            }
        },
        update: async function (id, message) {
            console.log('id', id);
            if (id === 'last') {
                await execute('git add *');
                await execute(`git commit --amend -m "${message}"`);
            }
        },
    },
    container: {
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
    },
};

module.exports = resources;