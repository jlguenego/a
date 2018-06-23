const { execute, log } = require('../core');
const util = require('util');
const exec = util.promisify(require('child_process').exec);


module.exports = {
    help: log(`
  DESCRIPTION
  
    Manage git internal objects.

  USAGE

    a object create <name>
        
    
    a object retrieve <name>
        Retrieve an object: git cat-file -p <sha1>

    a object                 
        List all objects: git rev-list --objects --all
`),
    create: async (name) => {
        
    },
    retrieve: 'git cat-file -p <sha1>',
    list: 'git rev-list --objects --all',
   
};
