const { handle, execute, notSignificant, log } = require('../core');

module.exports = {
    commit: require('./commit'),
    modified: require('./modified'),
    branch: require('./branch'),
    remote: require('./remote'),
    repository: require('./repository'),
    tag: require('./tag'),
    lighttag: {
        async create(tagname) {
            if (!tagname) {
                throw new Error('Cannot create tag lightweight without tagname');
            }
            // annotated tag
            await execute(`git tag "${tagname}"`);
        },
    }
};
