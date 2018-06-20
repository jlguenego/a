const { execute, notSignificant, log } = require('../core');

module.exports = {
    help: log(`
    DESCRIPTION
    
      Manage git remote branches.
  
    USAGE

      a rbranch list
        git branch --remotes
        
      a rbranch retrieve <rbranch>
        git rev-parse <rbranch>
        
      a rbranch delete <rbranch>
        git push -d origin <rbranch>

`),
    list: 'git rbranch --remotes',
    retrieve: 'git rev-parse <rbranch>',
    delete: 'git push -d origin <rbranch>'

};
