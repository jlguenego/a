const homedir = require('os').homedir();
const fs = require('fs');
const path = require('path');

const configFilename = path.resolve(homedir, './.aconfig.json');

function initConfig() {
    const config = {
        plugins: {
            git: './git-resources/main.js',
            git2: './git-resources/git2.js',
            docker: './docker-resources.js',
        },
        currentMode: 'git',
        modes: {
            'git': ['git'],
            'git-advanced': ['git', 'git2'],
            'docker': ['docker'],
            'all': ['git', 'docker'],
        },
        tips: false
    };
    setConfig(config);
    return config;
}

function getConfig() {
    try {
        return JSON.parse(fs.readFileSync(configFilename));
    } catch (e) {
        return initConfig();
    }
}

function setConfig(config) {
    fs.writeFileSync(configFilename, JSON.stringify(config, null, 2));
}

module.exports = {
    getConfig,
    setConfig,
    initConfig,
    configFilename,
};