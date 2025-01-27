import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const ClubDetails = () => {

    const { id } = useParams();
    const [club, setClub] = useState();
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    // https://devtrium.com/posts/async-functions-useeffect
    useEffect(() => {
        const fetchClub = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/clubs/${id}`);

                if (!res.ok)
                    throw new Error('nie udalo sie pobrac danych klubu');

                const data = await res.json();
                setClub(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchClub();
    }, [id]);





    const handleDelete = async () => {
        try {

            const res = await fetch(`http://localhost:5000/api/clubs/${id}`, {
                method: 'DELETE',
                credentials: "include",
            });

            if (res.ok) {
                navigate('/success');
            } else {
                throw new Error('nie udalo sie usunac klubu');
            }
        } catch (error) {
            navigate('/error', setError(error.message) );
        }
    };




     if (error) return <p className="error-message">BŁĄD: {error}</p>;
     if (!club) return <p>nie ma klubu</p>;

    return (
        <div className="result">

            <h3>{club.name}</h3>
            <p><strong>Country:</strong> {club.country}</p>
            <p><strong>City:</strong> {club.city}</p>
            <p><strong>League:</strong> {club.league}</p>
            <p><strong>Position:</strong> {club.position}</p>

            <Link to={`/clubs/edit/${id}`} className="details-link">Edytuj klub</Link>
            <button onClick={handleDelete} className="delete-button">Usuń Klub</button>

        </div>
    );
};

export default ClubDetails;
