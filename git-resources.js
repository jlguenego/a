const { handle, execute } = require('./core');

module.exports = {
    'commit': {
        list: 'git log',
        get: 'git show',
        create: async function (message) {
            await execute('git add *');
            await execute('git commit -m ' + message);
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
    'modified': {
        list: 'git status'
    }
};