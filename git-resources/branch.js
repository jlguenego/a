const { execute, notSignificant, log } = require('../core');

module.exports = {
    help: log(`
  DESCRIPTION
  
    Manage git branches, only the local branches.

  USAGE

    a branch create <name>
        Create a git branch: git branch -- <name>
    
    a branch retrieve <name>
        Retrieve a git branch: git rev-parse <name>

    a branch delete <name>
        Delete a git branch: git branch -d -- <name>

    a branch                 
        List local git branches: git branch

    Other verbs:

    a branch select <name>
        Select the new current branch: git checkout <name>

    a branch rename <oldname> <newname>
        Rename a git branch: git branch -m <oldname> <newname>
`),
    list: 'git branch',
    create: 'git branch -- <name>',
    async retrieve(name) {
        await execute(`git rev-parse "${name}"`);
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
};
