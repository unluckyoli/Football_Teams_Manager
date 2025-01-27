const db = require('../config/database');

const PlayerMatch = {

    getById: async (id) => {

        const sql = `
        SELECT 
            pm.id AS player_match_id,
            pm.goals_scored,
            pm.minutes_played,
            pm.rating,
            fp.id AS player_id,
            fp.name AS player_name,
            fp.surname AS player_surname,
            fm.id AS match_id,
            fm.date AS match_date,
            hc.name AS home_team_name,
            ac.name AS away_team_name
        FROM 
            player_match pm
        LEFT JOIN 
            football_player fp ON pm.player_id = fp.id
        LEFT JOIN 
            football_match fm ON pm.match_id = fm.id
        LEFT JOIN 
            club hc ON fm.home_team_id = hc.id
        LEFT JOIN 
            club ac ON fm.away_team_id = ac.id
        WHERE 
            pm.id = ?;
    `;
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    },


    add: async (data) => {
        const sql = `
            INSERT INTO player_match (player_id, match_id, goals_scored, minutes_played, rating) 
            VALUES (?, ?, ?, ?, ?)
        `;
        //console.log('Zapytanie SQL add:', sql);
        //console.log('Dane wejściowe add:', data);

        const { player_id, match_id, goals_scored, minutes_played, rating } = data;
        return db.query(sql, [player_id, match_id, goals_scored, minutes_played, rating]);
    },

    update: async (id, data) => {
        const sql = `
            UPDATE player_match 
            SET player_id = ?, match_id = ?, goals_scored = ?, minutes_played = ?, rating = ?
            WHERE Id = ?
        `;
        // console.log('Zapytanie SQL update:', sql);
        // console.log('Dane wejściowe update:', data);

        const { player_id, match_id, goals_scored, minutes_played, rating } = data;
        return db.query(sql, [player_id, match_id, goals_scored, minutes_played, rating, id]);
    },

    delete: async (id) => {
        const sql = 'DELETE FROM player_match WHERE Id = ?';
        return db.query(sql, [id]);
    },


    /**
     * metoda sluzaca do przekazania wybranej ilosci rekordow (LIMIT) oraz przekazania LICZBY rekordow do pozniejszego obliczenia
     * ilosci stron
     * @param page
     * @param limit
     */
    getAllWithPlayerDetailsPaginated: async (page, limit) => {

        //https://medium.com/@ananyajha1901/server-side-pagination-techniques-in-node-js-express-js-fa32cd808061
        //obliczamy liczbe rekordow ktore musimy skipnac zeby pokazac odpowiednia strone
        const offset = (page - 1)* limit;

        //pobieramy wybrany kawalek bazy danych
        const sql = `
      SELECT 
        pm.id AS player_match_id,
        pm.rating, pm.goals_scored, pm.minutes_played,
        
        fp.id AS player_id, fp.name AS player_name, fp.surname AS player_surname
      FROM player_match pm
      
      LEFT JOIN football_player fp ON pm.player_id = fp.id
      LIMIT ? OFFSET ?
    `;
        const [rows] = await db.query(sql, [limit, offset]);

        //pobieramy liczbe wszytskich rekordow w bazie zeby obliczyc ile potrzeba stron
        const countSql = `SELECT COUNT(*) as total FROM player_match`;
        const [[{ total }]] = await db.query(countSql);

        //zwracamy wybrana ilosc rekordow oraz calkowita LICZBE rekordow w bazie danych
        return { rows, total };
    },


    /**
     * dla list rozwijanych w Add, lista zawodnikow i lista meczow. moznaby po prostu zimportowac model meczow i zawodnikow ale
     * no po co 2 razy to robic w getId w kontrolerze B)
     */
    getFormDetails: async () => {

        const playersSql = `
        SELECT 
    fp.id AS player_id, 
    fp.name AS player_name, 
    fp.surname AS player_surname
FROM 
    football_player fp;

    `;

        const matchesSql = `
        SELECT 
    fm.id AS match_id, 
    fm.date AS match_date,
    hc.name AS home_team_name, 
    ac.name AS away_team_name
FROM 
    football_match fm
LEFT JOIN 
    club hc ON fm.home_team_id = hc.id
LEFT JOIN 
    club ac ON fm.away_team_id = ac.id;

    `;

        const [players] = await db.query(playersSql);
        const [matches] = await db.query(matchesSql);

        return { players, matches };
    },






};

module.exports = PlayerMatch;
