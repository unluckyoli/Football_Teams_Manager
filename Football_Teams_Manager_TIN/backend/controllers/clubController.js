    const Club = require('../models/club');

    const validateClubData = ({ name, country, city, league, position }) => {
        const errors = [];
        if (!name || name.trim().length < 3) errors.push('nazwa klubu musi mieć co najmniej 3 znaki');
        if (!country || country.trim().length < 3) errors.push('kraj musi mieć co najmniej 3 znaki');
        if (!city || city.trim().length < 3) errors.push('miasto musi mieć co najmniej 3 znaki');
        if (!league || league.trim().length < 3) errors.push('liga musi mieć co najmniej 3 znaki');
        if (!position || position < 1 || position > 20) errors.push('pozycja musi być liczbą od 1 do 20');
        return errors;
    };

    const clubController = {


        /**
         * metoda zwracajaca liste rekorodow z tabeli 'club;
         */
        getClubsAPI: async (req, res) => {
            try {
                /**
                //bierzemy z query page i limit
                 **/
                const page = parseInt(req.query.page)||1
                const limit = parseInt(req.query.limit) || 5;

                /**
                //metoda z modelu club zeby zaladowac z bazy tylko tyle rekordow ile chcemy. limit to limit ile chcemy rekordow na
                // stronie a page do obliczenia offsetu czyli ilu rekordow mamy pominac zeby zaczac pobierac te wlasciwe
                    **/
                const { rows, total } = await Club.getAllPaginated(page, limit);

                /**
                 * obliczamy calkowita liczbe stron
                 */
                const totalPages = Math.ceil(total / limit);


                /**
                 * gdy mamy wszystko przekazujemy potrzebne dane do wyswietlania
                 */
                res.json({
                    data: rows,
                    currentPage: page,
                    totalPages,
                    //total,
                    //limit
                });

            } catch (error) {
                console.error('BLAD przy pobieraniu klubow', error);
                res.status(500).json({ message: 'BLAD przy pobieraniu klubow', error: error.message });
            }
        },


        /**
         * pobieranie klubu po jego id czytanego z params, potrzebne gdy chcemy wysweitlic np. szcegoly danego klubu, lub do edycji klubu
         */
        getClubByIdAPI: async (req, res) => {
            const {id} = req.params;

            try {

                const club = await Club.getById(id);

                if (club.length === 0) {
                    return res.status(404).json({message: 'nie ma klubu w bazie'});
                }

                res.json(club);

            } catch (error) {
                console.error('BLAD przy pobieraniu klubow z id', error);
                res.status(500).json({message: 'BLAD przy szczegolach klubu', error: error.message});
            }
        },


        /**
         * dodawanie klubu wraz z walidacja wpisanych danych na backendzie
         * WYMAGA ZALOGOWANIA
         */
        addClubAPI: async (req, res) => {
            try {

                /**
                 * pobieramy dane klubu ktore zostaly wyslane w req w frontendize z AddClubForm
                 */
                const { name, country, city, league, position } = req.body;


                const errors = validateClubData({ name, country, city, league, position });
                if (errors.length > 0) {
                    return res.status(400).json({ message: 'zle dane walidacja', errors });
                }

                const newClub = { name, country, city, league, position };
                await Club.add(newClub);

                res.status(201).json({ message: 'dodano klub' });

            } catch (error) {
                console.error('BLAD przy dodawaniu klubow', error);
                res.status(500).json({ message: 'blad przy dodaniu klubu', error: error.message });
            }
        },


        /**
         * updateujemy klub najpierw pobierajac jego dane z id i uzywajac juz wczesniej wspomnianej getById zeby moc zaaktualizowac dany rekord
         * uzywamy walidacji
         * WYMAGA ZALOGOWANIA
         */
        updateClubAPI: async (req, res) => {
            const { id } = req.params;
            const { name, country, city, league, position } = req.body;

            try {
                const club = await Club.getById(id);
                if (!club || club.length === 0) {
                    return res.status(404).json({ message: 'nie znaleziono klubu' });
                }

                const errors = validateClubData({ name, country, city, league, position });
                if (errors.length > 0) {
                    return res.status(400).json({ message: 'bledne dane', errors });
                }

                await Club.update(id, { name, country, city, league, position });
                res.status(200).json({ message: 'zaktualizowano klub' });
            } catch (error) {
                console.error('BLAD przy aktualizacji klubow', error);
                res.status(500).json({ message: 'blad przy aktualizacji klubu', error: error.message });
            }
        },


        /**
         * zwykle proste usuniecie klubu po jego id przekazywanym w req.params
         * WYMAGA ZALOGOWANIA
         */
        deleteClubAPI: async (req, res) => {
            const {id} = req.params;

            try {

                await Club.delete(id);
                res.status(200).json({message: 'klub usuniety'});
            } catch (error) {
                console.error('BLAD przy usuwaniu klubow', error);
                res.status(500).json({message: 'nie udalo sir usunac klubu', error: error.message});
            }
        }


    }
    module.exports = clubController;
