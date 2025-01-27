import {Link, useNavigate} from 'react-router-dom';

const OneFootballPlayer = ({ player }) => {
    const navigate = useNavigate();


    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/football_players/${player.Id}`, {
                method: 'DELETE',
                credentials: "include",
            });

            if (res.ok) {
                navigate('/success');
            } else {
                throw new Error('nie udalo sir usunac zawodnika');
            }
        } catch (error) {
            navigate('/error');
        }
    };



    return (
        <tr>
            <td>{player.name} {player.surname}</td>
            <td>
                <Link className="details-link" to={`/football-players/${player.Id}`}>
                    Szczegóły
                </Link>
                {' | '}
                <Link className="details-link" to={`/football-players/edit/${player.Id}`}>
                    Edytuj
                </Link>
                {' | '}
                <button onClick={handleDelete} className="delete-button">Usuń</button>
            </td>
        </tr>
    );
};

export default OneFootballPlayer;
