const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'userGroupData.json');

// Default data structure
const defaultData = {
    antibadword: {},
    antibot: {},
    antilink: {},
    antitag: {},
    welcome: {},
    goodbye: {},
    chatbot: {},
    warnings: {},
    sudo: []
};

// Ensure data directory exists
function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

// Load data
function loadUserGroupData() {
    try {
        ensureDataDir();

        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(
                DATA_FILE,
                JSON.stringify(defaultData, null, 2)
            );
            return { ...defaultData };
        }

        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

        return {
            ...defaultData,
            ...data,
            antibadword: data.antibadword || {},
            antibot: data.antibot || {},
            antilink: data.antilink || {},
            antitag: data.antitag || {},
            welcome: data.welcome || {},
            goodbye: data.goodbye || {},
            chatbot: data.chatbot || {},
            warnings: data.warnings || {},
            sudo: data.sudo || []
        };

    } catch (error) {
        console.error('Error loading user group data:', error);
        return { ...defaultData };
    }
}

// Save data
function saveUserGroupData(data) {
    try {
        ensureDataDir();

        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify(data, null, 2)
        );

        return true;
    } catch (error) {
        console.error('Error saving user group data:', error);
        return false;
    }
}

// ================= ANTILINK =================

function setAntilink(groupId, value) {
    const data = loadUserGroupData();
    data.antilink[groupId] = value;
    return saveUserGroupData(data);
}

function getAntilink(groupId) {
    const data = loadUserGroupData();
    return data.antilink[groupId];
}

function removeAntilink(groupId) {
    const data = loadUserGroupData();
    delete data.antilink[groupId];
    return saveUserGroupData(data);
}

// ================= ANTITAG =================

function setAntitag(groupId, value) {
    const data = loadUserGroupData();
    data.antitag[groupId] = value;
    return saveUserGroupData(data);
}

function getAntitag(groupId) {
    const data = loadUserGroupData();
    return data.antitag[groupId];
}

function removeAntitag(groupId) {
    const data = loadUserGroupData();
    delete data.antitag[groupId];
    return saveUserGroupData(data);
}

// ================= ANTIBOT =================

function setAntibot(groupId, value) {
    const data = loadUserGroupData();
    data.antibot[groupId] = value;
    return saveUserGroupData(data);
}

function getAntibot(groupId) {
    const data = loadUserGroupData();
    return data.antibot[groupId];
}

function removeAntibot(groupId) {
    const data = loadUserGroupData();
    delete data.antibot[groupId];
    return saveUserGroupData(data);
}

// ================= WARNINGS =================

function incrementWarningCount(groupId, userId) {
    const data = loadUserGroupData();

    if (!data.warnings[groupId]) {
        data.warnings[groupId] = {};
    }

    if (!data.warnings[groupId][userId]) {
        data.warnings[groupId][userId] = 0;
    }

    data.warnings[groupId][userId]++;

    saveUserGroupData(data);

    return data.warnings[groupId][userId];
}

function resetWarningCount(groupId, userId) {
    const data = loadUserGroupData();

    if (data.warnings[groupId]) {
        delete data.warnings[groupId][userId];

        if (Object.keys(data.warnings[groupId]).length === 0) {
            delete data.warnings[groupId];
        }
    }

    return saveUserGroupData(data);
}

// ================= SUDO =================

function isSudo(userId) {
    const data = loadUserGroupData();
    return data.sudo.includes(userId);
}

function addSudo(userId) {
    const data = loadUserGroupData();

    if (!data.sudo.includes(userId)) {
        data.sudo.push(userId);
    }

    return saveUserGroupData(data);
}

function removeSudo(userId) {
    const data = loadUserGroupData();

    data.sudo = data.sudo.filter(id => id !== userId);

    return saveUserGroupData(data);
}

function getSudoList() {
    const data = loadUserGroupData();
    return data.sudo;
}

// ================= WELCOME =================

function setWelcome(groupId, value) {
    const data = loadUserGroupData();
    data.welcome[groupId] = value;
    return saveUserGroupData(data);
}

function getWelcome(groupId) {
    const data = loadUserGroupData();
    return data.welcome[groupId];
}

function removeWelcome(groupId) {
    const data = loadUserGroupData();
    delete data.welcome[groupId];
    return saveUserGroupData(data);
}

// ================= GOODBYE =================

function setGoodbye(groupId, value) {
    const data = loadUserGroupData();
    data.goodbye[groupId] = value;
    return saveUserGroupData(data);
}

function getGoodbye(groupId) {
    const data = loadUserGroupData();
    return data.goodbye[groupId];
}

function removeGoodbye(groupId) {
    const data = loadUserGroupData();
    delete data.goodbye[groupId];
    return saveUserGroupData(data);
}

// ================= ANTIBADWORD =================

function setAntiBadword(groupId, value) {
    const data = loadUserGroupData();
    data.antibadword[groupId] = value;
    return saveUserGroupData(data);
}

function getAntiBadword(groupId) {
    const data = loadUserGroupData();
    return data.antibadword[groupId];
}

function removeAntiBadword(groupId) {
    const data = loadUserGroupData();
    delete data.antibadword[groupId];
    return saveUserGroupData(data);
}

// ================= CHATBOT =================

function setChatbot(groupId, value) {
    const data = loadUserGroupData();
    data.chatbot[groupId] = value;
    return saveUserGroupData(data);
}

function getChatbot(groupId) {
    const data = loadUserGroupData();
    return data.chatbot[groupId];
}

function removeChatbot(groupId) {
    const data = loadUserGroupData();
    delete data.chatbot[groupId];
    return saveUserGroupData(data);
}

// ================= EXPORTS =================

module.exports = {
    loadUserGroupData,
    saveUserGroupData,

    setAntilink,
    getAntilink,
    removeAntilink,

    setAntitag,
    getAntitag,
    removeAntitag,

    setAntibot,
    getAntibot,
    removeAntibot,

    incrementWarningCount,
    resetWarningCount,

    isSudo,
    addSudo,
    removeSudo,
    getSudoList,

    setWelcome,
    getWelcome,
    removeWelcome,

    setGoodbye,
    getGoodbye,
    removeGoodbye,

    setAntiBadword,
    getAntiBadword,
    removeAntiBadword,

    setChatbot,
    getChatbot,
    removeChatbot
};