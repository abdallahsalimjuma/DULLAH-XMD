const settings = require('../set');
const { loadSudoList } = require('./sudo');

const {
    findParticipant,
    buildComparableIds
} = require('./jidHelper');

async function isOwnerOrSudo(senderId, sock = null, chatId = null) {
    if (!senderId) return false;

    const cleanNumber = (jid) => {
        if (!jid || typeof jid !== 'string') return '';

        return jid.split('@')[0]
            .split(':')[0]
            .replace(/\D/g, '');
    };

    const ownerNumber = String(
        settings.NUMERO_OWNER || process.env.BOT_OWNER || ''
    ).replace(/\D/g, '');

    const senderNumber = cleanNumber(senderId);

    // OWNER CHECK
    if (ownerNumber && senderNumber === ownerNumber) {
        return true;
    }

    const sudoUsers = loadSudoList();

    // Compare JID and phone number
    const matchesSudo = (jid) => {
        if (!jid) return false;

        const number = cleanNumber(jid);

        if (number && sudoUsers.has(number)) {
            return true;
        }

        if (sudoUsers.has(jid)) {
            return true;
        }

        const variants = buildComparableIds(jid);

        for (const variant of variants) {
            if (sudoUsers.has(variant)) {
                return true;
            }

            const variantNumber = cleanNumber(variant);

            if (variantNumber && sudoUsers.has(variantNumber)) {
                return true;
            }
        }

        return false;
    };

    // DIRECT SUDO CHECK
    if (matchesSudo(senderId)) {
        return true;
    }

    // GROUP LID CHECK
    if (sock && chatId && chatId.endsWith('@g.us')) {
        try {
            const metadata = await sock.groupMetadata(chatId);

            const participant = findParticipant(
                metadata.participants || [],
                senderId
            );

            if (participant) {
                const possibleJids = [
                    participant.pn,
                    participant.id,
                    participant.jid,
                    participant.lid,
                    participant.userJid
                ].filter(Boolean);

                for (const jid of possibleJids) {
                    const number = cleanNumber(jid);

                    if (ownerNumber && number === ownerNumber) {
                        return true;
                    }

                    if (matchesSudo(jid)) {
                        return true;
                    }
                }
            }
        } catch (error) {
            console.error(
                '[isOwnerOrSudo] LID lookup failed:',
                error.message
            );
        }
    }

    return false;
}

module.exports = isOwnerOrSudo;