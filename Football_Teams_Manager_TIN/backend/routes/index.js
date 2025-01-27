var express = require('express');
var router = express.Router();
const clubController = require('../controllers/clubController');
const footballMatchController = require("../controllers/football_matchController");
const footballPlayerController = require("../controllers/football_playerController");
const playerMatchController = require("../controllers/player_matchController");
const authController = require('../controllers/authController');
const authenticate = require("../middlewares/authMiddleware");

router.get('/api/clubs', clubController.getClubsAPI);
router.post('/api/clubs',authenticate,  clubController.addClubAPI);
router.get('/api/clubs/:id', clubController.getClubByIdAPI);
router.put('/api/clubs/:id',authenticate, clubController.updateClubAPI);
router.delete('/api/clubs/:id',authenticate, clubController.deleteClubAPI);

router.get("/api/matches", footballMatchController.getAllMatchesAPI);
router.get("/api/matches/:id", footballMatchController.getMatchByIdAPI);
router.post("/api/matches",authenticate, footballMatchController.addMatchAPI);
router.put("/api/matches/:id",authenticate, footballMatchController.updateMatchAPI);
router.delete("/api/matches/:id",authenticate, footballMatchController.deleteMatchAPI);

router.get("/api/football_players", footballPlayerController.getAllPlayersAPI);
router.get("/api/football_players/:id", footballPlayerController.getPlayerByIdAPI);
router.post("/api/football_players",authenticate, footballPlayerController.addPlayerAPI);
router.put("/api/football_players/:id",authenticate, footballPlayerController.updatePlayerAPI);
router.delete("/api/football_players/:id",authenticate, footballPlayerController.deletePlayerAPI);

router.get("/api/player_matches/form-details", playerMatchController.getFormDetailsAPI);
router.get("/api/player_matches", playerMatchController.getAllPlayerMatchesAPI);
router.get("/api/player_matches/:id", playerMatchController.getPlayerMatchByIdAPI);
router.post("/api/player_matches",authenticate, playerMatchController.addPlayerMatchAPI);
router.put("/api/player_matches/:id",authenticate, playerMatchController.updatePlayerMatchAPI);
router.delete("/api/player_matches/:id",authenticate, playerMatchController.deletePlayerMatchAPI);


router.post('/register',authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/api/check-session', authController.checkSession);







module.exports = router;
