const { log } = require('../core');

module.exports = {
    list: log(`Welcome to the tutorial!
+----------------+
|Table of Content|
+----------------+

Note: to access the different part, type:
$> a .t r <title>
with <title> below:


- 1_mode
- 2_config
- 3_git


`),

    retrieve: (name) => {
        if (name === '1_mode') {
            console.log(`
TUTORIAL Part #1 : Mode
=======================

1) List the modes
$> a -m

In fact this is a shortcut to the command:
$> a .mode list

2) Select a mode (for instance docker)
$> a -m docker
$> a -m

3) Update the mode to 'git'.
$> a -m git

4) List the resources you can use in git mode:
$> a

That's it!

`);
        }
        if (name === '2_config') {
            console.log(`
TUTORIAL Part #2: Config
========================
Prerequisite: 
 - Having git installed.
 - Understood tutorial 1_mode


1) Show all the core resources:
$> a -c

2) Show the config file location and content:
$> a .config
You can do shorter because there is no conflict with another resource name:
$> a .c

3) Check the help regarding the .config resource:
a .c help

4) Set a new value for the tips property.
false means no more tips message
$> a .c set tips false

5) You should not see the tips message
$> a

6) Put back the tips property
$> a .c set tips true

5) You should see the tips message
$> a

 `);
        }
        if (name === '3_git') {
            console.log(`
TUTORIAL Part #3: Git
=====================
Prerequisite: 
 - Having git installed.
 - Understood tutorial 1_mode and 2_config

1) Create a new repository
$> a repository create myproject
$> cd myproject
Note: you do not need to type the entire resource or verb.
Just indicate enough characters to disambiguate.

2) Get the branch list
$> a branch

3) Add a file and commit it.
$> echo coucou > toto.txt
$> a commit create

3) Create a new branch
$> a b c titi

4) Select the branch titi and commit something.
$> a b s titi
$> echo coucou > tata.txt
$> a c c

5) Merge the branch titi to master
$> a b s master
$> a b m titi

6) Congratulations! That is it!
`);
        }

    },
};
