const FootballMatch = require("../models/football_match");
const Club = require("../models/club");

const validateMatchData = (data) => {
    const errors = [];
    if (!data.home_team_id || !data.away_team_id) {
        errors.push('Obie drużyny muszą byc wybrane');
    }
    if (!data.date || isNaN(Date.parse(data.date))) {
        errors.push('Podaj prawidlowa date w formacie YYYY-MM-DD');
    }
    if (!data.score) {
        errors.push('Wynik meczu jest wymagany');
    } else if (!/^\d+-\d+$/.test(data.score)) {
        errors.push('Wynik meczu musi być w formacie "X-Y"') ;
    }

    return errors;
};

const matchController = {


    /**
     * zwracamy liste wybranej ilosci rekordow tabeli, wraz z informacja o ilosci stron, analogicznie jak w 'clubController'
     */
    getAllMatchesAPI: async (req, res) => {
        try {

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;

            const { rows, total } = await FootballMatch.getAllPaginated(page, limit);

            const totalPages = Math.ceil(total / limit);

            res.json({
                data: rows,
                currentPage: page,
                totalPages,
                //total,
                //limit
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    /**
     * metoda do zwracania szczegolow danego meczy przez id. wszystkie kolumny wysweitlane. oraz lista klubow do wyswietlania
     * w listach rozwijanych np w Edit
     */
    getMatchByIdAPI: async (req, res) => {
        const { id } = req.params;

        try {
            const match = await FootballMatch.getById(id);

            if (!match) {
                return res.status(404).json({ message: 'nie znaleziono meczu' });
            }


            const clubs = await Club.getAll();

            res.json({ match, clubs });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    /**
     * metoda dodajaca mecz, uzywamy walidacji, dane z req przesylane przez AddFootballMatch
     * WYMAGA ZALOGOWANIA
     */
    addMatchAPI: async (req, res) => {
        try {
            const { home_team_id, away_team_id, date, score } = req.body;
            const errors = validateMatchData({ home_team_id, away_team_id, date, score });

            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            const newMatch = { home_team_id, away_team_id, date, score };
            await FootballMatch.add(newMatch);

            res.status(201).json({ message: 'Dodano mecz' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    /**
     * metoda updateujaca mecz, pobieramy z getById() by sprawdzic czy taki mecz istnieje, nastepnie po prostu update
     * WYMAGA ZALOGOWANIA
     */
    updateMatchAPI: async (req, res) => {
        const { id } = req.params;
        const { home_team_id, away_team_id, date, score } = req.body;

        try {

            const match = await FootballMatch.getById(id);
            if (match.length===0) {
                return res.status(404).json({ message: "Nie znaleziono meczu." });
            }

            const errors = validateMatchData({ home_team_id, away_team_id, date, score });

            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            await FootballMatch.update(id, { home_team_id, away_team_id, date, score });

            res.status(200).json({ message: 'Zaktualizowano mecz.' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    /**
     * usuniecie meczu po id z req.params
     * WYMAGA ZALOGOWANIA
     */
    deleteMatchAPI: async (req, res) => {
        const {id} = req.params;
        try {

            await FootballMatch.delete(id);
            res.status(200).json({message: 'mecz zostal usuniety'});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

}
module.exports = matchController;