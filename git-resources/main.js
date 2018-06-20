const { handle, execute, notSignificant, log } = require('../core');
const fs = require('fs');
const rimraf = require('rimraf');
const util = require('util');

const resources = {
    commit: require('./commit'),
    modified: require('./modified'),
    branch: require('./branch'),
    rbranch: require('./rbranch'),
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

module.exports = resources;