module.exports = a => ({
    commit: require('./commit'),
    modified: require('./modified'),
    branch: require('./branch'),
    remote: require('./remote'),
    repository: require('./repository'),
    tag: require('./tag'),
});
