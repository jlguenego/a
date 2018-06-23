const { execute, log } = require('../core');
const { Command } = require('commander');

async function create(...args) {
    const program = new Command();
    program
        .name('a tag create')
        .usage('[options] <tagname>')
        .description(`Create a tag, annotated or lightweight.`)

        .option('-a, --annotated <message>', 'create a annotated tag.')
        .option('-c, --commit <commit>', 'specify a commit if not current one.')
        ;
    
    const myArgs = ['node', 'a-tag-create', ...args];
    program.parse(myArgs);
    const tagname = program.args[0];
    const message = program.annotated ? `-m "${program.annotated}" `: '';
    const commit = program.commit ? `-m "${program.commit}" `: '';
    await execute(`git tag ${program.annotated ? '-a': ''} "${tagname}" ${message} ${commit}`);
};
create.includedHelp = true;

module.exports = {
    async list(filter) {
        if (filter) {
            await execute(`git tag -l "${filter}"`);
            return;
        }
        await execute(`git tag`);
    },
    create,
    async retrieve(tagname) {
        if (!tagname) {
            throw new Error('Cannot retrieve tag without tagname');
        }
        // retrieve annotated tag
        await execute(`git show "${tagname}"`);
    },
    async delete(tagname) {
        if (!tagname) {
            throw new Error('Cannot delete tag without tagname');
        }
        await execute(`git tag -d "${tagname}"`);
    },
};
