const db = require('../config/database');

const Club = {

    getAll: async () => {
        const [rows] = await db.query(`SELECT * FROM club`);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM club WHERE Id = ?', [id]);
        return rows[0];
    },


    add: async (clubData) => {
        const sql = 'INSERT INTO club (name, country, city, league, position) VALUES (?, ?, ?, ?, ?)';
        return db.query(sql, [clubData.name, clubData.country, clubData.city, clubData.league, clubData.position]);
    },


    update: async (id, clubData) => {
        const sql = 'UPDATE club SET name = ?, country = ?, city = ?, league = ?, position = ? WHERE Id = ?';
        const { name, country, city, league, position } = clubData;
        await db.query(sql, [name, country, city, league, position, id]);
    },

    delete: async (id) => {
        const sql = 'DELETE FROM club WHERE Id = ?';
        await db.query(sql, [id]);
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
            SELECT Id, name, country, city, league, position
            FROM club
            LIMIT ? OFFSET ?
        `;
        const [rows] = await db.query(sql, [limit, offset]);

        const countSql = `SELECT COUNT(*) as total FROM club`;

        //chce sama wartosc total (liczbe rekordow w bazie danych) restrukturyzacja
        const [[{ total }]] = await db.query(countSql);
        console.log(total);

        return { rows, total };
    },


};

module.exports = Club;
