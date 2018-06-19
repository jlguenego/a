const { handle, execute, notSignificant, log } = require('./core');
const fs = require('fs');
const rimraf = require('rimraf');
const util = require('util');

const resources = {
    commit: {
        list: 'git log --reverse',
        retrieve: 'git show',
        create: async function (message = 'ok') {
            await execute('git add *');
            await execute(`git commit -m "${message}"`);
        },
        delete: async function (id, message = 'ok') {
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
    },
    modified: {
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
    branch: {
        help: log(`
  DESCRIPTION
  
    Manage git branches

  USAGE

    a branch create <name>
        Create a git branch: git branch -- <name>
    
    a branch delete <name>
        Delete a git branch: git branch -d -- <name>

    a branch                 
        List local git branches: git branch



    a branch select <name>
        Select the new current branch: git checkout <name>

    a branch rename <oldname> <newname>
        Rename a git branch: git branch -m <oldname> <newname>
`),
        list: 'git branch',
        async create(name) {
            await execute(`git branch -- "${name}"`);
        },
        async select(name) {
            await execute(`git checkout "${name}"`);
        },
        async update(oldName, newName) {
            await execute(`git branch -m "${oldName}" "${newName}"`);
        },
        async delete(name) {
            await execute(`git branch -d -- "${name}"`);
        }
    },
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
        async create(tagname, message = 'ok') {
            if (!tagname) {
                throw new Error('Cannot create tag without tagname');
            }
            // annotated tag
            await execute(`git tag -a "${tagname}" -m "${message}"`);
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
    }
};

module.exports = resources;