import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../../styles.css';

const FootballMatchDetails = () => {
    const { id } = useParams();
    const [match, setMatch] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMatch = async () => {

            try {
                const res = await fetch(`http://localhost:5000/api/matches/${id}`);

                if (!res.ok)
                    throw new Error('nie udalo sie pobrac danych meczu');

                const data = await res.json();
                setMatch(data.match);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchMatch();
    }, [id]);






    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/matches/${id}`, {
                method: 'DELETE',
                credentials: "include",
            });

            if (res.ok) {
                navigate('/success');
            } else {
                throw new Error('nie udalo sie usunac meczu');
            }
        } catch (error) {
            navigate('/error', setError(error.message) );
        }
    };




    if (error) return <p className="error-message">BŁĄD: {error}</p>;
    if (!match) return <p>Ładowanie danych meczu...</p>;



    return (
        <div className="result">
            <h3>Szczegóły meczu</h3>

            <p><strong>Drużyna gospodarzy:</strong> {match.home_team_name}</p>
            <p><strong>Drużyna gości:</strong> {match.away_team_name}</p>
            <p><strong>Data meczu:</strong> {new Date(match.date).toLocaleDateString()}</p>
            <p><strong>Wynik meczu:</strong> {match.score}</p>

            <Link to={`/matches/edit/${id}`} className="details-link">Edytuj mecz</Link>
            <button onClick={handleDelete} className="delete-button">Usuń mecz</button>
        </div>
    );
};

export default FootballMatchDetails;
