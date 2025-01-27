import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditPlayerMatchForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [playerId, setPlayerId] = useState('');
    const [matchId, setMatchId] = useState('');
    const [goalsScored, setGoalsScored] = useState(0);
    const [minutesPlayed, setMinutesPlayed] = useState(0);
    const [rating, setRating] = useState(0.0);

    const [players, setPlayers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/player_matches/${id}`);
                if (!res.ok)
                    throw new Error('nie udalo sie pobrac wystepu i pozostalych dancch');

                const data = await res.json();
                setPlayerId(data.playerMatch.player_id);
                setMatchId(data.playerMatch.match_id);
                setGoalsScored(data.playerMatch.goals_scored);
                setMinutesPlayed(data.playerMatch.minutes_played);
                setRating(data.playerMatch.rating);

                setPlayers(data.players);
                setMatches(data.matches);
            } catch (error) {
                setErrors(error.message);
            }
        };

        fetchData();
    }, [id]);







    const validate = () => {
        const newErrors = {};
        if (!playerId) newErrors.playerId = 'musisz wybracć zawodnika';
        if (!matchId) newErrors.matchId = 'musisz wybrać mecz';
        if (goalsScored < 0) newErrors.goalsScored = 'liczba goli nie może być ujemna';
        if (minutesPlayed < 1 || minutesPlayed > 120) newErrors.minutesPlayed = 'minuty muszą być w zakresie od 1 do 120';
        if (rating < 0 || rating > 10) newErrors.rating = 'ocena musi być w zakresie od 0 do 10';
        return newErrors;
    };






    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const updatedPlayerMatch = { player_id: playerId, match_id: matchId, goals_scored: goalsScored, minutes_played: minutesPlayed, rating };

        try {
            const res = await fetch(`http://localhost:5000/api/player_matches/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedPlayerMatch),
            });

            if (res.ok) {
                navigate('/success');
            } else {
                throw new Error('nie udalo sie edytowac wystepu');
            }
        } catch (error) {
            navigate('/error',  setErrors(error.message));
        }
    };


    if (!playerId ||!players.length ||!matches.length) return <p>ladowanie</p>;





    return (
        <form onSubmit={handleSubmit} className="registration-form">
            <h3>Edytuj występ</h3>

            <label>
                Zawodnik:
                <select className="form-select" value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}>

                    <option value="">-- Wybierz zawodnika --</option>
                    {players.map(player => (
                        <option key={player.player_id} value={player.player_id}>
                            {player.player_name} {player.player_surname}
                        </option>
                    ))}
                </select>
                {errors.playerId && <div className="error-message">{errors.playerId}</div>}
            </label>

            <label>
                Mecz:
                <select className="form-select" value={matchId}
                    onChange={(e) => setMatchId(e.target.value)}>

                    <option value="">-- Wybierz mecz --</option>
                    {matches.map(match => (
                        <option key={match.match_id} value={match.match_id}>
                            {`${match.home_team_name} vs ${match.away_team_name} (${new Date(match.match_date).toLocaleDateString()})`}
                        </option>
                    ))}
                </select>
                {errors.matchId && <div className="error-message">{errors.matchId}</div>}
            </label>

            <label>
                Gole:
                <input type="number" value={goalsScored}
                       onChange={(e) => setGoalsScored(parseInt(e.target.value))}/>
                {errors.goalsScored && <div className="error-message">{errors.goalsScored}</div>}
            </label>

            <label>
                Minuty:
                <input type="number" value={minutesPlayed}
                    onChange={(e) => setMinutesPlayed(parseInt(e.target.value))}/>
                {errors.minutesPlayed && <div className="error-message">{errors.minutesPlayed}</div>}
            </label>

            <label>
                Ocena:
                <input type="number" step="0.1" value={rating}
                    onChange={(e) => setRating(parseFloat(e.target.value))}/>
                {errors.rating && <div className="error-message">{errors.rating}</div>}
            </label>

            <button type="submit">Zapisz zmiany</button>
        </form>
    );
};

export default EditPlayerMatchForm;
