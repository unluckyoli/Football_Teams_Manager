import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../../styles.css';

const FootballPlayerDetails = () => {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/football_players/${id}`);

                if (!res.ok)
                    throw new Error('nie udalo sie pobrac danych zawodnika');

                const data = await res.json();
                setPlayer(data.player);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchPlayer();
    }, [id]);




    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/football_players/${id}`, {
                method: 'DELETE',
                credentials: "include",
            });

            if (res.ok) {
                navigate('/success');
            } else {
                throw new Error('nie udalo sie usunac zawodnika');
            }
        } catch (error) {
            navigate('/error', setError(error.message) );
        }
    };




    if (error) return <p className="error-message">BŁĄD: {error}</p>;
    if (!player) return <p>Nie znaleziono zawodnika</p>;




    return (
        <div className="result">

            <h3>{player.name} {player.surname}</h3>
            <p><strong>Nationality:</strong> {player.nationality}</p>
            <p><strong>Position:</strong> {player.position}</p>
            <p><strong>Club:</strong> {player.club_name}</p>

            <Link to={`/football-players/edit/${id}`} className="details-link">Edytuj piłkarza</Link>
            <button onClick={handleDelete} className="delete-button">Usuń piłkarza</button>
        </div>
    );
};

export default FootballPlayerDetails;
