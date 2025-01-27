const User = require('../models/User');
const Session = require('../models/Session');

const COOKIE_NAME = 'sessionId';

function generateSessionId() {
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `sess_${randomPart}`;
}

const authController = {



    /**
    //rejestracja uzytkownika w bazie danych, kontroler ktory uzywa modelu user. sprawdzamy czy jest w bazie user o danym username
     w tym celu wywolujemy funkcje getByUsername() z modelu user. jak ok to dodajemy usera do tabeli users
        */
    register: async (req, res) => {

        try {
            const {username, password} = req.body;

            if (!username || !password) {
                return res.status(400).json({message: 'podaj username i password, nie moga byc puste'});
            }


            /**
            //sprawdzamy czy user o takim usernamie juz istnieje
                **/
            const existingUser = await User.getByUsername(username);
            if (existingUser) {
                return res.status(400).json({message: 'jest uzytkownik o takim usernamie, wybierz innny'});
            }


            /**
            //jesli wszystko ok to dodajemy goscia do bazy
                **/
            await User.create(username, password);

            return res.status(201).json({message: 'zarejestrowano pomyslnie!!!'});
        } catch (error) {
            console.error('blad w register user::::', error);
            return res.status(500).json({message: 'blad serwera przy rejestracji'});
        }
    },


    /**
     * metoda logujaca uzytkownika, uzywa generateSessionId() by zgenerowac ciasteczko i je dodac. sprawdzamy wczesniej czy dany user
     * istnieje (jest zarejestrowany?) jesli wszytsko ok tworzymy sesje w tabeli session i nastepnie dodajemy ciasteczko
     */
    login: async (req, res) => {
        try {
            const {username, password} = req.body;


            if (!username || !password) {
                return res.status(400).json({message: 'podaj username i password, nie moga byc puste'});
            }
            /**
            //pobieramy usera o podanym username
                **/
            const user = await User.getByUsername(username);

            /**
            //jesli nie ma usera o takim username
                **/
            if (!user) {
                return res.status(400).json({message: 'nie ma takiego username w bazie'});
            }
            /**
            //jesli jest user ale podal zle haslo
                **/
            if (user.password !== password) {
                return res.status(400).json({message: 'zle haslo'});
            }


            /**
            //jesli wszystko ok to generujemy sessionId
                */
            const sessionId = generateSessionId();
            /**
            // zapisujemy w sessions uzytkownika ktory sie zalogowal
                **/
            await Session.create(sessionId, user.id);


            /**
             * // DOKUMENTACJA COOKIE: https://expressjs.com/en/api.html#res.cookie
             *    // wstawiamy cookie do przegladarki dzieki czemu bedziemy mogli identyfikowac zalogowanego
             */

            res.cookie(COOKIE_NAME, sessionId, {
                httpOnly: true,
                // secure: true, false
                // sameSite: 'strict', none
            });



            return res.status(200).json({message: 'zalogowano pomyslnie!!!'});
        } catch (error) {
            console.error('blad w login user:::::', error);
            return res.status(500).json({message: 'blad serwera przy logowaniu'});
        }
    },


    /**
     * metoda wylogowujaca uzytkownika -> usuwajaca sesje z naszej tabeli sessions i usuwajaca ciasteczko z przegladarki
     */
    logout: async (req, res) => {
        try {

            /**
            //https://stackoverflow.com/questions/44816519/how-to-get-cookie-value-in-expressjs
            //pobieramy nasze sessionId z cookie o nazwie sessionId, jesli jest to usuwamy ten rekord z bazy danych
             **/
            const sessionId = req.cookies[COOKIE_NAME];
            if (sessionId) {
                await Session.deleteBySessionId(sessionId);
            }

            /**
            //DOKUMENTACJA COOKIE: https://expressjs.com/en/api.html#res.clearCookie
            //czyscimy cookie z przegladarki
             **/
            res.clearCookie(COOKIE_NAME);


            return res.json({message: 'wylogowano pomyslnie'});
        } catch (error) {
            console.error('blad w logout usera::::::', error);
            return res.status(500).json({message: 'blad serwera przy wylogowaniu'});
        }
    },


    /**
     * metoda sprawdzajaca czy uzytkownik jest zalogowany sprawdzajaca czy jest cookie o naszej nawie w przegladarce nastepnie czy
     * dane ciasteczko jest w tabeli sessions
     */
    checkSession: async (req, res) => {
        try {

            const sessionId = req.cookies[COOKIE_NAME];
            if (!sessionId) {
                return res.status(401).json({message: 'brak cookie sessionId'});
            }

            /**
            //sprawdzamy czy taki sessionId istnieje w bazie
                */
            const session = await Session.getBySessionId(sessionId);
            if (!session) {
                return res.status(401).json({message: 'nieprawidlowa sesja'});
            }


            return res.status(200).json({message: 'sesja wazna'});
        } catch (error) {
            console.error('blad w checkSession:::::::', error);
            return res.status(500).json({message: 'blad serwera.', error: error.message});
        }
    }

}
module.exports = authController;
