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

async function getCurrentBranch() {
    const { stdout } = await exec('git rev-parse --abbrev-ref HEAD');
    const array = stdout.replace(/\* /, '').split(/\r?\n/).map(l => l.trim()).filter(line => line !== '');
    return array[0];
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
    
    a branch push [branch1] [branch2]
        Copy a branch1 to another branch2 (at least one branch must be local)
        By default branch1 is the selected local branch.
        By default branch2 is the tracked remote branch of the selected local branch.
`),
    list: async () => {
        console.log(`Local branches: `);
        await execute('git branch -vv');
        console.log(`Remote branches: `);
        await execute('git branch --remotes');
    },
    create: async (name) => {
        if (isRemote(name)) {
            const [remote, branch] = name.split('/');
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
            const [remote, branch] = name.split('/');
            await execute(`git push -d ${remote} ${branch}`);
            return;
        }
        await execute(`git branch -d -- ${name}`);
    },

    select: 'git checkout <localbranch>',
    rename: async (oldname, newname) => {
        if (isRemote(oldname) || isRemote(newname)) {
            console.error('Sorry, rename work only for local branches.');
            process.exit(1);
        }
        await execute('git branch -m <oldname> <newname>');
    },
    merge: 'git merge <name>',
    push: async (branch1, branch2) => {
        const currentBranch = await getCurrentBranch();
        console.log('current branch is:', currentBranch);
        if (branch1 === undefined) {
            await execute('git push');
            return;
        }
        if (isRemote(branch1)) {
            const [remote1, name1] = branch1.split('/');
            if (branch2 === undefined) {
                await execute(`git pull ${remote1} ${name1}`);
                return;
            }
            await execute(`git pull ${remote1} ${name1}:${branch2}`);
            return;
        }
        // branch1 is local
        if (branch2 === undefined) {
            await execute(`git checkout ${branch1}`);
            await execute('git push');
            await execute(`git checkout ${currentBranch}`);
            return;
        }
        if (isRemote(branch2)) {
            const [remote2, name2] = branch2.split('/');
            await execute(`git push ${remote2} ${branch1}:${name2}`);
            return;
        }
        if (currentBranch !== branch2) {
            await execute(`git checkout ${branch2}`);
        }
        try {
            await execute(`git merge -q --no-edit ${branch1}`, false);
        } catch (e) {
            console.log(e.stdout);
            console.log(e.stderr);
            await execute(`git merge --abort`);
            if (currentBranch !== branch2) {
                await execute(`git checkout ${currentBranch}`);
            }
            process.exit(e.code);
        }

        if (currentBranch !== branch2) {
            await execute(`git checkout ${currentBranch}`);
        }
        return;
    },
};
