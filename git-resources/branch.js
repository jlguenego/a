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
    
    a branch merge <name>
        Merge a git branch to the current one: git merge <name>
    
    a branch push
        Push the current git branch to the remote: git push [remote=origin]
`),
    list: 'git branch',
    create: 'git branch -- <name>',
    retrieve: 'git rev-parse <name>',
    select: 'git checkout <name>',
    update: 'git branch -m <oldname> <newname>',
    delete: 'git branch -d -- <name>',
    merge: 'git merge <name>',
    push: 'git push [remote=origin] [branch=]',
};
