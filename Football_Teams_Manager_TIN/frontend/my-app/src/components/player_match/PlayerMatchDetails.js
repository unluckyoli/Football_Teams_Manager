import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const PlayerMatchDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [playerMatch, setPlayerMatch] = useState(null);

    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/player_matches/${id}`);

                if (!res.ok)
                    new Error('nie udalo sie pobrac danych wystepu');

                const data = await res.json();
                setPlayerMatch(data.playerMatch);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = async () => {

        try {
            const res = await fetch(`http://localhost:5000/api/player_matches/${id}`, {
                    method: 'DELETE',
                    credentials: "include",
                });

            if (res.ok) {
                navigate('/success');
            } else {
                throw new Error('nie udalo sie usunac wystepu');
            }
        } catch (error) {
            navigate('/error', setError(error.message) );
        }
    };

    if (error) return <p className="error-message">blad: {error}</p>;
    if (!playerMatch) return <p>brak danych wystepu</p>;



    return (
        <div className="result">
            <h2>{playerMatch.player_name} {playerMatch.player_surname}</h2>

            <p>
                <strong>Mecz:</strong>{' '}

                    <Link to={`/matches/${playerMatch.match_id}`}>
                        {playerMatch.home_team_name} vs {playerMatch.away_team_name}
                    </Link>
            </p>

            <p><strong>Data meczu:</strong> {new Date(playerMatch.match_date).toLocaleDateString()}</p>
            <p><strong>Gole:</strong> {playerMatch.goals_scored}</p>
            <p><strong>Minuty:</strong> {playerMatch.minutes_played}</p>
            <p><strong>Ocena:</strong> {playerMatch.rating}</p>

            <Link to={`/player-matches/edit/${id}`} className="details-link">Edytuj występ</Link>
            <button onClick={handleDelete} className="delete-button">Usuń występ</button>
        </div>
    );
};

export default PlayerMatchDetails;
