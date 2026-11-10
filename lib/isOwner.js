const settings = require('../set');
const { loadSudoList } = require('./sudo');

async function isOwnerOrSudo(senderId, sock = null, chatId = null) {
    if (!senderId) return false;

    const cleanNumber = (jid) => {
        if (!jid || typeof jid !== 'string') return '';

        return jid.split('@')[0].split(':')[0].replace(/\D/g, '');
    };

    const ownerNumber = String(
        settings.NUMERO_OWNER || process.env.BOT_OWNER || ''
    ).replace(/\D/g, '');

    const senderNumber = cleanNumber(senderId);

    // OWNER CHECK
    if (ownerNumber && senderNumber === ownerNumber) {
        return true;
    }

    // SUDO CHECK
    const sudoUsers = loadSudoList();

    if (sudoUsers.has(senderNumber)) {
        return true;
    }

    if (sudoUsers.has(senderId)) {
        return true;
    }

    // LID CHECK
    if (sock && chatId && chatId.endsWith('@g.us')) {
        try {
            const metadata = await sock.groupMetadata(chatId);

            const participant = (metadata.participants || []).find(p =>
                p.id === senderId || p.lid === senderId
            );

            if (participant) {
                const possibleJids = [
                    participant.pn,
                    participant.id,
                    participant.jid
                ];

                for (const jid of possibleJids) {
                    const number = cleanNumber(jid);

                    if (ownerNumber && number === ownerNumber) {
                        return true;
                    }

                    if (sudoUsers.has(number) || sudoUsers.has(jid)) {
                        return true;
                    }
                }
            }
        } catch (error) {
            console.error('[isOwnerOrSudo]', error.message);
        }
    }

    return false;
}

module.exports = isOwnerOrSudo;