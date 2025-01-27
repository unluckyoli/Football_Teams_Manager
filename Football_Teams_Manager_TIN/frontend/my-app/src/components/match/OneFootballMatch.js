import { Link, useNavigate } from 'react-router-dom';

const OneFootballMatch = ({ match }) => {
    const navigate = useNavigate();


    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/matches/${match.id}`, {
                method: 'DELETE',
                credentials: "include",
            });
            if (res.ok) {
                navigate('/success');
            } else {
                throw new Error('nie udalo sir usunac meczu');
            }
        } catch (error) {
            navigate('/error');
        }
    };

    return (
        <tr>
            <td>{match.home_team_name}</td>
            <td>{match.away_team_name}</td>
            <td>{new Date(match.date).toLocaleDateString()}</td>
            <td>
                <Link className="details-link" to={`/matches/${match.id}`}>Szczegóły</Link>
                {' | '}
                <Link className="details-link" to={`/matches/edit/${match.id}`}>Edytuj</Link>
                {' | '}
                <button onClick={handleDelete} className="delete-button" >Usuń</button>
            </td>
        </tr>
    );
};

export default OneFootballMatch;
