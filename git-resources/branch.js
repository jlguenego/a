const { execute, notSignificant, log } = require('../core');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

function isRemote(name) {
    return name.match(/\//);
}

async function getLocalBranches() {
    const { stdout } = await exec('git branch');
    const array = stdout.replace(/\* /, '').split(/\r?\n/).map(l => l.trim()).filter(line => line !== '');
    return array;
}

module.exports = {
    help: log(`
  DESCRIPTION
  
    Manage git branches, both local and remote branches.

    Note: remote branch syntax: <remote>/<branch>

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
        Limitation: work only with local branches.
    
    a branch merge <name>
        Merge a git branch to the current one: git merge <name>
    
    a branch push
        Push the current git branch to the remote: git push
`),
    list: async () => {
        console.log(`Local branches: `);
        await execute('git branch -vv');
        console.log(`Remote branches: `);
        await execute('git branch --remotes');
    },
    create: async (name) => {
        if (isRemote(name)) {
            const [ remote, branch ] = name.split('/');
            const localBranches = await getLocalBranches();
            if (localBranches.includes(branch)) {
                await execute(`git push -u ${remote} ${branch}`);
                return;
            }
            // if local branch does not exist with the same name, throw an error (political choice).
            console.error(`Politic choice: you must have a local branch with the same name.`);
            process.exit(1);
        }
        await execute(`git branch -- ${name}`)
    },
    retrieve: 'git rev-parse <name>',
    
    
    delete: async (name) => {
        if (isRemote(name)) {
            const [ remote, branch ] = name.split('/');
            await execute(`git push -d ${remote} ${branch}`);
            return;
        }
        await execute(`git branch -d -- ${name}`);
    },

    select: 'git checkout <localbranch>',
    rename: async (oldname, newname) => {
        if (isRemote(oldname) || isRemote(newname)) {
            console.error('Politic choice: not implemented for remote branch. Please pull to local branch and push to the new one.');
            process.exit(1);
        }
        await execute('git branch -m <oldname> <newname>');
    },
    merge: 'git merge <name>',
    push: 'git push',
};
