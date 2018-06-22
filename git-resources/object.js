const { execute, notSignificant, log } = require('../core');
const util = require('util');
const exec = util.promisify(require('child_process').exec);


module.exports = {
    help: log(`
  DESCRIPTION
  
    Manage git internal objects.

  USAGE

    a object create <name>
        Create a git branch: git branch -- <name>
    
    a branch retrieve <name>
        Retrieve a git branch: git rev-parse <name>

    a object                 
        List all objects
`),
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
    retrieve: 'git cat-file -p <sha1>',
    list: 'git rev-list --objects --all',
   
};
