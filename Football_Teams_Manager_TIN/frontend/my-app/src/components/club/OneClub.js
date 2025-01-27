import { Link, useNavigate } from 'react-router-dom';

const OneClub = ({ club }) => {
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/clubs/${club.Id}`, {
                method: 'DELETE',
                credentials: "include",
            });



            if (res.ok) {
                navigate('/success');
            } else {
                throw new Error('nie udalo sir usunac klubu');
            }
        } catch (error) {
            navigate('/error');
        }
    };




    return (
        <tr>
            <td>{club.name}</td>
            <td>
                <Link className="details-link" to={`/clubs/${club.Id}`}>
                    Szczegóły
                </Link>
                {' | '}
                <Link className="details-link" to={`/clubs/edit/${club.Id}`}>
                    Edytuj
                </Link>
                {' | '}
                <button onClick={handleDelete} className="delete-button">Usuń</button>
            </td>
        </tr>
    );
};

export default OneClub;
