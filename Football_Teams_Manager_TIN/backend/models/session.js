const db = require('../config/database');

const Session = {


    /**
     * tworzymy rekord w bazie, sesje i uzytkownika ktory ma ta sesje
     */
    create: async (sessionId, userId) => {
        const sql = `INSERT INTO sessions (sessionId, userId) VALUES (?, ?)`;
        await db.query(sql, [sessionId, userId]);

    },

    getBySessionId: async (sessionId) => {
        const [rows] = await db.query('SELECT * FROM sessions WHERE sessionId = ?', [sessionId]);
        return rows[0] || null;
    },

    deleteBySessionId: async (sessionId) => {
        await db.query('DELETE FROM sessions WHERE sessionId = ?', [sessionId]);
    }
};

module.exports = Session;
