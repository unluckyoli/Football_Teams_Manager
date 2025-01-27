const PlayerMatch = require('../models/player_match');


const validatePlayerMatchData = (data) => {
    const errors = [];
    if (!data.player_id) errors.push('musisz wybrac zawodnika');
    if (!data.match_id) errors.push('Musisz wybrac mecz');
    if (data.goals_scored < 0) errors.push('liczba goli nie może być ujemna');
    if (data.minutes_played < 1 || data.minutes_played > 120) errors.push('Minuty muszą byc w zakresie od 1 do 120');
    if (data.rating && (data.rating < 0 || data.rating > 10)) errors.push('Ocena musi byc w zakresie od 0 do 10');
    return errors;
};



const playerMatchController = {


    /**
     * metoda do wysweitlania wszystkich szczegolowych danych razem z danymi z innej tabeli football_player
     */
    getAllPlayerMatchesAPI: async (req, res) => {
        try {

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;


            const { rows, total } = await PlayerMatch.getAllWithPlayerDetailsPaginated(page, limit);


            const totalPages = Math.ceil(total / limit);


            res.json({
                data: rows,
                currentPage: page,
                totalPages,
                //total,
                //limit
            });

        } catch (error) {
            //console.error('blad przy pobieraniu relacji player-matcg z paginacja:', err);
            res.status(500).json({ error: error.message});
        }
    },


    /**
     * metoda sluzaca do wyswietlania szczegolow wystepu (dane z tabeli player_match oraz tabel football_match i football_player
     */
    getPlayerMatchByIdAPI: async (req, res) => {
        const { id } = req.params;

        try {

            const playerMatch = await PlayerMatch.getById(id);

            if (!playerMatch) {
                return res.status(404).json({ message: 'nie ma takiego player-match' });
            }


            /**
             * przesylamy tez dane meczow i zawodnikow do wyswietlania ich dla komponentu EditFootballMatchForm
             */
            const { players, matches } = await PlayerMatch.getFormDetails();

            res.json({ playerMatch, players, matches });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    /**
     * dodawanie wystepu z walidacja danych
     */
    addPlayerMatchAPI: async (req, res) => {
        try {
            const { player_id, match_id, goals_scored , minutes_played , rating  } = req.body;
            const errors = validatePlayerMatchData({ player_id, match_id, goals_scored, minutes_played, rating });

            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            const newPlayerMatch = { player_id, match_id, goals_scored, minutes_played, rating };
            await PlayerMatch.add(newPlayerMatch);

            res.status(201).json({ message: 'dodano wystep' });
        } catch (error) {
            res.status(500).json({error: error.message });
        }
    },


    /**
     * update danych sprawdzamy czy rekord o danym id istnieje jak tak to update
     */
    updatePlayerMatchAPI: async (req, res) => {
        const { id } = req.params;
        const { player_id, match_id, goals_scored, minutes_played, rating } = req.body;

        try {

            const playerMatch = await PlayerMatch.getById(id);
            if (!playerMatch) {
                return res.status(404).json({ message: 'nie ma takiego player-match' });
            }

            const errors = validatePlayerMatchData({ player_id, match_id, goals_scored, minutes_played, rating });
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            await PlayerMatch.update(id, { player_id, match_id, goals_scored, minutes_played, rating });
            res.status(200).json({ message: 'wystep zostal zaaktualizowany' });
        } catch (error) {
            res.status(500).json({error: error.message });
        }
    },


    /**
     * prosty delete po id ]
     */
    deletePlayerMatchAPI: async (req, res) => {
        const { id } = req.params;
        try {
            const playerMatch = await PlayerMatch.getById(id);
            if (!playerMatch) {
                return res.status(404).json({ message: 'nie ma takiego player-match' });
            }
            await PlayerMatch.delete(id);
            res.status(200).json({ message: 'wystep zostal usuniety' });
        } catch (error) {
            res.status(500).json({error: error.message });
        }
    },


    /**
     //metoda pomocnicza do Add w formularzu zeby byly dane rozwijane klubow i zawodnikow
     (sluzy do tego funkcvja w modelu player_match o nazwie getFormDetails()
     */
    getFormDetailsAPI: async (req, res) => {
        try {
            const { players, matches } = await PlayerMatch.getFormDetails();
            //console.log('Dane graczy:', players);
            //console.log('Dane meczów:', matches);

            res.json({ players, matches });
        } catch (error) {
            //console.error('blad przy pobieraniu danych formularza::::', err.message);
            res.status(500).json({error: error.message });
        }
    }


};

module.exports = playerMatchController;
