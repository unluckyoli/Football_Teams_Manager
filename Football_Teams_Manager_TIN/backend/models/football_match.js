const db = require('../config/database');

const FootballMatch = {

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
                fm.id, 
                fm.home_team_id, 
                fm.away_team_id, 
                fm.date, 
                fm.score, 
                ht.name AS home_team_name, 
                at.name AS away_team_name
            FROM 
                football_match fm
            JOIN 
                club ht ON fm.home_team_id = ht.id
            JOIN 
                club at ON fm.away_team_id = at.id
            LIMIT ? OFFSET ?
        `;
        const [rows] = await db.query(sql, [limit, offset]);


        const countSql = `SELECT COUNT(*) as total FROM football_match`;
        const [[{ total }]] = await db.query(countSql);

        return { rows, total };
    },






    getById: async (id) => {
        const sql = `
            SELECT 
                fm.Id, 
                fm.home_team_id, 
                fm.away_team_id, 
                fm.date, 
                fm.score, 
                ht.name AS home_team_name, 
                at.name AS away_team_name
            FROM 
                football_match fm
            JOIN 
                club ht ON fm.home_team_id = ht.Id
            JOIN 
                club at ON fm.away_team_id = at.Id
            WHERE 
                fm.Id = ?
        `;
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    },





    add: async (match) => {
        const sql = 'INSERT INTO football_match (home_team_id, away_team_id, date, score) VALUES (?, ?, ?, ?)';
        return db.query(sql, [match.home_team_id, match.away_team_id, match.date, match.score]);
    },



    update: async (id, matchData) => {
        const sql = 'UPDATE football_match SET home_team_id = ?, away_team_id = ?, date = ?, score = ? WHERE Id = ?';
        const { home_team_id, away_team_id, date, score } = matchData;

        await db.query(sql, [home_team_id, away_team_id, date, score, id]);
    },



    delete: async (id) => {
        const sql = 'DELETE FROM football_match WHERE Id = ?';
        await db.query(sql, [id]);
    },



};

module.exports = FootballMatch;
