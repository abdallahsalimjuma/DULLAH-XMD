const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../xmd');
const filePath = path.join(dataDir, 'isAdmin.json');

// Ensure directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// JSON helpers
function loadIsAdminData() {
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return new Set(Array.isArray(data) ? data : []);
    } catch {
        return new Set();
    }
}

function saveIsAdminData(data) {
    try {
        fs.writeFileSync(
            filePath,
            JSON.stringify([...data], null, 2)
        );
    } catch (error) {
        console.error('ISADMIN SAVE ERROR:', error);
    }
}

const onlyAdminGroups = loadIsAdminData();

// Normalize JID
function normalizeJid(jid) {
    if (!jid || typeof jid !== 'string') return '';

    return jid
        .trim()
        .toLowerCase()
        .replace(/:\d+(?=@)/, '');
}

// Get participant identifiers
function getParticipantIds(participant) {
    if (!participant) return [];

    return [
        participant.id,
        participant.jid,
        participant.lid,
        participant.phoneNumber,
        participant.userJid
    ]
        .filter(Boolean)
        .map(normalizeJid);
}

// Compare two WhatsApp identifiers
function sameJid(id1, id2) {
    if (!id1 || !id2) return false;

    const first = normalizeJid(id1);
    const second = normalizeJid(id2);

    if (first === second) return true;

    // Compare phone JIDs only
    if (
        first.endsWith('@s.whatsapp.net') &&
        second.endsWith('@s.whatsapp.net')
    ) {
        return first.split('@')[0] === second.split('@')[0];
    }

    // Compare LIDs only
    if (
        first.endsWith('@lid') &&
        second.endsWith('@lid')
    ) {
        return first.split('@')[0] === second.split('@')[0];
    }

    return false;
}

// Main function
const isAdmin = async (zk, chatId, senderId) => {
    try {
        const metadata = await zk.groupMetadata(chatId);
        const participants = metadata.participants || [];

        // Bot identifiers
        const botIds = [
            zk.user?.id,
            zk.user?.lid
        ].filter(Boolean);

        // Sender identifiers
        const senderIds = [
            senderId
        ].filter(Boolean);

        // Find participant
        const botParticipant = participants.find(participant =>
            getParticipantIds(participant).some(pid =>
                botIds.some(bid => sameJid(pid, bid))
            )
        );

        const senderParticipant = participants.find(participant =>
            getParticipantIds(participant).some(pid =>
                senderIds.some(sid => sameJid(pid, sid))
            )
        );

        // Admin status
        const isBotAdmin = Boolean(
            botParticipant &&
            ['admin', 'superadmin'].includes(botParticipant.admin)
        );

        const isSenderAdmin = Boolean(
            senderParticipant &&
            ['admin', 'superadmin'].includes(senderParticipant.admin)
        );

        return {
            isSenderAdmin,
            isBotAdmin,
            onlyAdminGroups
        };

    } catch (error) {
        console.error('❌ Error in isAdmin:', error);

        return {
            isSenderAdmin: false,
            isBotAdmin: false,
            onlyAdminGroups
        };
    }
};

// Only-admin helpers
async function addGroupToOnlyAdminList(groupJid) {
    onlyAdminGroups.add(groupJid);
    saveIsAdminData(onlyAdminGroups);
}

async function removeGroupFromOnlyAdminList(groupJid) {
    onlyAdminGroups.delete(groupJid);
    saveIsAdminData(onlyAdminGroups);
}

async function isGroupOnlyAdmin(groupJid) {
    return onlyAdminGroups.has(groupJid);
}

// Exports
module.exports = {
    isAdmin,
    addGroupToOnlyAdminList,
    removeGroupFromOnlyAdminList,
    isGroupOnlyAdmin
};