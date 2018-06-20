const { log } = require('../core');

module.exports = {
    list: log(`Welcome to the tutorial!
There is 3 parts.

To access one of them, please type a long or abbreviated form:

a .tutorial retrieve 1
a .tuto ret 2
a .t r 3

`),

    retrieve: (name) => {
        if (name === '1') {
            console.log(`
TUTORIAL Part #1
================


Prerequisite: git must be installed.

1) List the '.mode' core resource:
$> a -m

2) Select the git mode
$> a -m git

3) What resources you can use (in git mode):
$> a

`);
        }
        if (name === '2') {
            console.log(`
TUTORIAL Part #2
================
Prerequisite: do the tutorial part 1.

1) Create a git repository
$> a repository create myproject
$> cd myproject

2) Create a file and commit it.
$> echo coucou > toto.txt
$> a commit create ok

3) List the branches
$> a branch

4) Check the documentation for the branch resource
$> a branch help

Note: you can also use -h instead of help.

5) Create a new branch 'devel'
$> a branch create devel

6) Check the branch is created.
$> a b

 `);
        }
        if (name === '3') {
            console.log(`
TUTORIAL Part #3
================
Prerequisite: do the tutorial part 1 and 2.

1) select the default branch to 'devel'
$> a b s devel
Note: you do not need to type the entire resource or verb.
Just indicate enough characters to disambiguate.

2) select the default branch to 'master' using abreviation.
$> a b s master

Note: this is equivalent to "a branch select master".

3) remove the 'devel' branch using abbreviation.
$> a b d devel

4) Check that the branch is removed
$> a b

5) Congratulations! That is it!
`);
        }

    },
};
