const { execute, notSignificant, log } = require('../core');

module.exports = {
    list: 'git log --reverse --pretty=oneline',
    async retrieve(commitId) {
        if (!commitId) {
            throw new Error('Cannot retrieve tag without commitId');
        }
        await execute(`git show --format=fuller "${commitId}"`);
    },
    create: async function (message = 'commit') {
        try {
            await execute('git add .');
            await execute(`git commit -m "${message}"`);
        } catch (e) {}
        
    },
    delete: async function (id, message = 'commit') {
        if (id === 'last') {
            // remove last commit.
            await execute('git reset --hard HEAD~1');
        }
        id = +id;
        if (id >= 0) {
            await execute(`git reset --soft HEAD~${id} && git commit -m "${message}"`);
        }
    },
    update: async function (id, message) {
        console.log('id', id);
        if (id === 'last') {
            await execute('git add *');
            await execute(`git commit --amend -m "${message}"`);
        }
    },
};
