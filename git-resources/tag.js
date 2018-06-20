const { execute, notSignificant, log } = require('../core');

module.exports = {
    async list(filter) {
        if (filter) {
            await execute(`git tag -l "${filter}"`);
            return;
        }
        await execute(`git tag`);
    },
    async create(tagname, message = 'ok', commit = '') {
        if (!tagname) {
            throw new Error('Cannot create tag without tagname');
        }
        // annotated tag
        await execute(`git tag -a "${tagname}" -m "${message}" ${commit}`);
    },
    async retrieve(tagname) {
        if (!tagname) {
            throw new Error('Cannot retrieve tag without tagname');
        }
        // retrieve annotated tag
        await execute(`git show "${tagname}"`);
    },
    async delete(tagname) {
        if (!tagname) {
            throw new Error('Cannot delete tag without tagname');
        }
        await execute(`git tag -d "${tagname}"`);
    },
};
