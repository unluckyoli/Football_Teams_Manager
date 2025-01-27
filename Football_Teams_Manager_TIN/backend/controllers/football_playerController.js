const FootballPlayer = require("../models/football_player");
const Club = require("../models/club");

const validatePlayerData = (data) => {
    const errors = [];
    if (!data.name || data.name.trim().length < 3) errors.push("imie zawodnika musi mieć co najmniej 3 znaki");
    if (!data.surname || data.surname.trim().length < 3) errors.push("nazwisko zawodnika musi miec co najmniej 3 znaki");
    if (!data.nationality || data.nationality.trim().length < 3) errors.push("Narodowosc musi miec co najmniej 3 znaki");
    if (!data.position || data.position.trim().length < 3) errors.push("pozycja zawodnika musi miec co najmniej 3 znaki");
    if (!data.club_id) errors.push("musisz wybrac klub");
    return errors;
};

const footballPlayerController = {


    /**
     * metoda zwracajaca wybrana ilosc rekordow (rows) oraz liczbe stron (total)
     */
    getAllPlayersAPI: async (req, res) => {
        try {

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;

            const { rows, total } = await FootballPlayer.getAllPaginated(page, limit);

            const totalPages = Math.ceil(total / limit);

            res.json({
                data: rows,
                currentPage: page,
                totalPages,
                //total,
                //limit
            });
        } catch (error) {
            res.status(500).json({ error: error.message});
        }
    },


    /**
     * metoda zwracajaca szczegoloy widok zawodnika wraz z nazwa klubu (klucz obcy) oraz liste klubow dla list rozwijanycg
     * np w Edit
     */
    getPlayerByIdAPI: async (req, res) => {
        const {id} = req.params;

        try {
            const player = await FootballPlayer.getById(id);

            if (!player) {
                return res.status(404).json({message: 'Nie ma zawodnika.'});
            }

            const clubs = await Club.getAll();

            res.json({player, clubs});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },


    /**
     * metoda dodajaca pilkarza, walidacja danych przeslanych przez AddFootballPlayer i dodanie do tabeli
     */
    addPlayerAPI: async (req, res) => {
        try {
            const { name, surname, nationality, position, club_id } = req.body;
            const errors = validatePlayerData({ name, surname, nationality, position, club_id });

            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }


            const newPlayer = { name, surname, nationality, position, club_id };
            await FootballPlayer.add(newPlayer);

            res.status(201).json({ message: 'Dodano zawodnika' });
        } catch (error) {
            res.status(500).json({error: error.message });
        }
    },


    /**
     * update danych, pobieramy zawodnika z bazy o danym id, jesli jest to update
     */
    updatePlayerAPI: async (req, res) => {
        const { id } = req.params;
        const { name, surname, nationality, position, club_id } = req.body;

        try {
            const player = await FootballPlayer.getById(id);
            if (player.length === 0) {
                return res.status(404).json({ message: 'Nie ma zawodnika' });
            }

            const errors = validatePlayerData({ name, surname, nationality, position, club_id });
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            await FootballPlayer.update(id, { name, surname, nationality, position, club_id });
            res.status(200).json({ message: 'Zaktualizowano zawodnika' });
        } catch (error) {
            res.status(500).json({error: error.message });
        }
    },


    /**
     * prosty delete po id
     */
    deletePlayerAPI: async (req, res) => {
        const { id } = req.params;

        try {
            await FootballPlayer.delete(id);
            res.status(200).json({ message: 'zawodnik zostal usuniety' });
        } catch (error) {
            res.status(500).json({error: error.message });
        }
    },



};


module.exports = footballPlayerController;
