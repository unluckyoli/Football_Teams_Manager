import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import ListOfClubs from './components/club/ListOfClubs';
import AddClubForm from './components/club/AddClubForm';
import ClubDetails from './components/club/ClubDetails';
import EditClubForm from './components/club/EditClubForm';
import NotFound from './components/NotFound';
import Home from './components/Home';
//import './styles.css';
import './styles/base.css';
import './styles/header.css';
import './styles/nav.css';
import './styles/main.css';
import './styles/tables.css';
import './styles/footer.css';
import './styles/forms.css'
import './styles/details.css'
import './styles/succesError.css'

import ListOfFootballMatches from "./components/match/ListOfFootballMatches";
import FootballMatchDetails from "./components/match/FootbalMatchDetails";
import ListOfFootballPlayers from "./components/player/ListOfFootballPlayers";
import AddFootballPlayerForm from "./components/player/AddFootballPlayerForm";
import EditFootballPlayerForm from "./components/player/EditFootballPlayerForm";
import FootballPlayerDetails from "./components/player/FootballPlayerDetails";
import AddFootballMatchForm from "./components/match/AddFootballMatchForm";
import EditFootballMatchForm from "./components/match/EditFootballMatchForm";
import ErrorPage from "./components/ErrorPage";
import ListOfPlayerMatches from "./components/player_match/ListOfPlayerMatches";
import AddPlayerMatchForm from "./components/player_match/AddPlayerMatchForm";
import PlayerMatchDetails from "./components/player_match/PlayerMatchDetails";
import EditPlayerMatchForm from "./components/player_match/EditPlayerMatchForm";
import { useCookies } from 'react-cookie';
import RegisterForm from './components/auth/RegisterForm';
import LoginForm from './components/auth/LoginForm';
import SuccesPage from "./components/SuccesPage";


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    //https://www.npmjs.com/package/react-cookie
    //https://stackoverflow.com/questions/68600015/how-to-remove-cookies-completely-using-usecookies-in-react-without-leaving-undef
    const [cookies, setCookie, removeCookie] = useCookies(['sessionId']);


    useEffect(() => {
    /**
     * odpytujemy backend czy nasza sesja jest wazna czyli czy dalej jestesmy zalogowani
     */
    const verifySession = async () => {
        try {

            const res = await fetch('http://localhost:5000/api/check-session', {
                method: 'GET',
                credentials: 'include',
            });


            if (res.ok) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('blad weryfikacji sesji App.js:::', error);
            setIsLoggedIn(false);
        }
    };


        // gdy cookies.sessionId sie zmieni sprawdzamy sesje
        verifySession();
    }, [cookies.sessionId]);


    /**
     * przechodzac logowanie poprawnie zmieniamy nasz status na zalogowany
     */
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };


    /**
     * wylogowujemy siem usuwamy ciasteczko oraz ustawiamy ze nie jestesmy zalogowani
     * @returns {Promise<void>}
     */
    const logout = async () => {
        try {
            await fetch('http://localhost:5000/logout', {
                method: 'POST',
                credentials: 'include',
            });
            removeCookie('sessionId', { path: '/' });
            setIsLoggedIn(false);
        } catch (err) {
            console.error('blad wylogowania:', err);
        }
    };






    return (
        <div className="App">
            <header className="app-header">
                <h1 className="app-title">F00tyScore</h1>
                <div className="auth-buttons">
                    {!isLoggedIn ? (
                        <>
                            <Link to="/register">
                                <button className="a-button">Zarejestruj się</button>
                            </Link>
                            <Link to="/login">
                                <button className="a-button">Zaloguj się</button>
                            </Link>
                        </>
                    ) : (

                        <button className="a-button" onClick={logout}>
                            Wyloguj się
                        </button>
                    )}
                </div>
            </header>



            <nav className="app-nav">
                <ul className="nav-list">
                    =====================
                    <li className="nav-item">
                        <Link to="/" className="nav-link">Strona główna</Link>
                    </li>


                    <li className="nav-item dropdown">
                        <span className="nav-link">Kluby</span>
                        <ul className="dropdown-menu">

                            <li>
                                <Link to="/clubs" className="dropdown-link">Lista klubów</Link>
                            </li>

                            {isLoggedIn &&
                                <li>
                                    <Link to="/clubs/add" className="dropdown-link">Dodaj Klub</Link>
                                </li>
                            }

                        </ul>
                    </li>



                    <li className="nav-item dropdown">
                        <span className="nav-link">Zawodnicy</span>
                        <ul className="dropdown-menu">

                            <li>
                                <Link to="/football-players" className="dropdown-link">Lista zawodników</Link>
                            </li>

                            {isLoggedIn &&
                                <li>
                                    <Link to="/football-players/add" className="dropdown-link">Dodaj Zawodnika</Link>
                                </li>}
                        </ul>
                    </li>





                    <li className="nav-item dropdown">
                        <span className="nav-link">Mecze</span>
                        <ul className="dropdown-menu">

                            <li>
                                <Link to="/matches" className="dropdown-link">Lista meczów</Link>
                            </li>

                            {isLoggedIn &&
                                <li>
                                    <Link to="/matches/add" className="dropdown-link">Dodaj mecz</Link>
                                </li>}
                        </ul>
                    </li>



                    <li className="nav-item dropdown">
                        <span className="nav-link">Występy</span>
                        <ul className="dropdown-menu">

                            <li>
                                <Link to="/player-matches" className="dropdown-link">Lista występów</Link>
                            </li>

                            {isLoggedIn &&
                                <li>
                                    <Link to="/player-matches/add" className="dropdown-link">Dodaj występ</Link>
                                </li>}
                        </ul>
                    </li>
                    =====================
                </ul>
            </nav>






            <main className="app-main">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<RegisterForm />}/>
                    <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />}/>

                    {/* kluby */}
                    <Route path="/clubs" element={<ListOfClubs />} />
                    <Route path="/clubs/add" element={<AddClubForm />}/>
                    <Route path="/clubs/:id" element={<ClubDetails />} />
                    <Route path="/clubs/edit/:id" element={<EditClubForm />}/>

                    {/* mecze */}
                    <Route path="/matches" element={<ListOfFootballMatches />} />
                    <Route path="/matches/add" element={<AddFootballMatchForm />}/>
                    <Route path="/matches/:id" element={<FootballMatchDetails />} />
                    <Route path="/matches/edit/:id" element={<EditFootballMatchForm />}/>

                    {/* zawodnicy */}
                    <Route path="/football-players" element={<ListOfFootballPlayers />} />
                    <Route path="/football-players/add" element={<AddFootballPlayerForm />}/>
                    <Route path="/football-players/edit/:id" element={<EditFootballPlayerForm />} />
                    <Route path="/football-players/:id" element={<FootballPlayerDetails />} />

                    {/* występy */}
                    <Route path="/player-matches" element={<ListOfPlayerMatches />} />
                    <Route path="/player-matches/add" element={<AddPlayerMatchForm />}/>
                    <Route path="/player-matches/:id" element={<PlayerMatchDetails />} />
                    <Route path="/player-matches/edit/:id" element={<EditPlayerMatchForm />}/>

                    <Route path="/success" element={<SuccesPage />} />
                    <Route path="/error" element={<ErrorPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>





            <footer className="app-footer">
                <p>2024 F00tyScore. Dzięki za wybieranie nas :)</p>
            </footer>
        </div>
    );
}

export default App;
