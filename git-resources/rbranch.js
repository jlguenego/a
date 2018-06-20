const { execute, notSignificant, log } = require('../core');

module.exports = {
    help: log(`
    DESCRIPTION
    
      Manage git remote branches.
  
    USAGE

      a rbranch list
        git branch -r

`),
    list: 'git branch -r',
    retrieve: 'git rev-parse'

};