const db = require('../config/database');

const User = {
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM users WHERE Id = ?', [id]);
        return rows[0] || null;
    },

    getByUsername: async (username) => {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0] || null;
    },

    create: async (username, password) => {
        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        await db.query(sql, [username, password]);


    }
};

module.exports = User;
