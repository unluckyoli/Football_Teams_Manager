const Session = require('../models/Session');
const COOKIE_NAME = 'sessionId';

/**
 * //sluzy do zabezpieczania endpointow w index.js, jesli maja authenticate to zanim sie wywolaja
 * // to wywolany bedzie wlasnie authenticate. sprawdza czy sessionId jest w bazie.
 */
const authenticate = async (req, res, next) => {
    try {
        /**
         * //pobieramy sessionId z cookie
         */
        const sessionId = req.cookies[COOKIE_NAME];
        if (!sessionId) {
            return res.status(401).json({ message: 'nie jestes zalogowany!!!!!!!!' });
        }

        /**
         * //sprawdzamy czy sesja o takim sesionId istneieje
         */
        const session = await Session.getBySessionId(sessionId);
        if (!session) {
            return res.status(401).json({ message: 'nieprawidlowa sesja, cos oszukujesz:/' });
        }


        //https://stackoverflow.com/questions/47515991/how-to-setup-an-authentication-middleware-in-express-js
        //https://stackoverflow.com/questions/18875292/passing-variables-to-the-next-middleware-using-next-in-express-js

        next();
    } catch (error) {
        //console.error('blad w authenticate middleware::::::', error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = authenticate;
