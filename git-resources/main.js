const { handle, execute, notSignificant, log } = require('../core');
const fs = require('fs');
const rimraf = require('rimraf');
const util = require('util');

const resources = {
    commit: require('./commit'),
    modified: require('./modified'),
    branch: require('./branch'),
    rbranch: require('./rbranch'),
    remote: {
        list: 'git remote -v',
        empty: notSignificant,
        async create(name, url) {
            // Ex: a remote create upstream https://github.com/jlguenego/a.git
            await execute(`git remote add "${name}" "${url}"`);
        },
        retrieve: notSignificant,
        update: notSignificant,
        async delete(name) {
            await execute(`git remote remove "${name}"`);
        },
    },
    repository: {
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
                console.error(`Error: ${name} is not a git repository`);
            }

        },
    },
    tag: {
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
    },
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