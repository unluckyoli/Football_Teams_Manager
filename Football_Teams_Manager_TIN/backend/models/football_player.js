const db = require('../config/database');

const Football_player = {

    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM football_player');
        return rows;
    },

    /**
     * pobieramy wszytskie kolumny dla wybranego Id oraz kolumne z tabeli club do lepszego wysweitlania szczegolow
     */
    getById: async (id) => {
        const sql = `
        SELECT 
            fp.Id, 
            fp.name, 
            fp.surname, 
            fp.nationality, 
            fp.position, 
            fp.club_id,
            c.name AS club_name
        FROM 
            football_player fp
        LEFT JOIN 
            club c ON fp.club_id = c.id
        WHERE 
            fp.Id = ?;
    `;
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    },

    add: async (playerData) => {
        const sql = 'INSERT INTO football_player (name, surname, nationality, position, club_id) VALUES (?, ?, ?, ?, ?)';
        return db.query(sql, [playerData.name, playerData.surname, playerData.nationality, playerData.position, playerData.club_id]);
    },

    update: async (id, playerData) => {
        const sql = 'UPDATE football_player SET name = ?, surname = ?, nationality = ?, position = ?, club_id = ? WHERE Id = ?';
        const { name, surname, nationality, position, club_id } = playerData;
        await db.query(sql, [name, surname, nationality, position, club_id, id]);
    },

    delete: async (id) => {
        const sql = 'DELETE FROM football_player WHERE Id = ?';
        return db.query(sql, [id]);
    },

    /**
     * metoda sluzaca do przekazania wybranej ilosci rekordow (LIMIT) oraz przekazania LICZBY rekordow do pozniejszego obliczenia
     * ilosci stron
     * @param page
     * @param limit
     */
    getAllPaginated: async (page, limit) => {

        const offset = (page - 1) * limit;

        const sql = `

      SELECT 
        fp.Id,
        fp.name,
        fp.surname,
        fp.nationality,
        fp.position,
        fp.club_id
      FROM football_player fp
      LIMIT ? OFFSET ?
    `;
        const [rows] = await db.query(sql, [limit, offset]);


        const countSql = `SELECT COUNT(*) as total FROM football_player`;
        const [[{ total }]] = await db.query(countSql);

        return { rows, total };
    },



};

module.exports = Football_player;
