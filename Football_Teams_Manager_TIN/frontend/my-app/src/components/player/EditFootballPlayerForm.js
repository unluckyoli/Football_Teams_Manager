import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


    const EditFootballPlayerForm = () => {
        const { id } = useParams();
        const navigate = useNavigate();

        const [name, setName] = useState('');
        const [surname, setSurname] = useState('');
        const [nationality, setNationality] = useState('');
        const [position, setPosition] = useState('');
        const [clubId, setClubId] = useState('');
        const [clubs, setClubs] = useState([]);
        const [errors, setErrors] = useState({});

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/football_players/${id}`);
                    if (!res.ok)
                        throw new Error('nie udalo sie pobrac danych zawodnika i klubow');

                    const data = await res.json();


                    setName(data.player.name);
                    setSurname(data.player.surname);
                    setNationality(data.player.nationality);
                    setPosition(data.player.position);
                    setClubId(data.player.club_id);

                    setClubs(data.clubs);
                } catch (error) {
                    setErrors(error.message);
                }
            };

            fetchData();
        }, [id]);

    const validate = () => {
        const newErrors = {};
        if (!name.trim() || name.trim().length < 3) newErrors.name = 'imie zawodnika musi miec co najmniej 3 znaki';
        if (!surname.trim() || surname.trim().length < 3) newErrors.surname = 'Nazwisko zawodnika musi miec co najmniej 3 znaki';
        if (!nationality.trim() || nationality.trim().length < 3) newErrors.nationality = 'Narodowość musi miec co najmniej 3 znaki';
        if (!position.trim() || position.trim().length < 3) newErrors.position = 'Pozycja zawodnika musi miec co najmniej 3 znaki';
        if (!clubId) newErrors.clubId = 'Musisz wybrac klub';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const updatedPlayer = { name, surname, nationality, position, club_id: clubId };

        try {
            const res = await fetch(`http://localhost:5000/api/football_players/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedPlayer),
            });



            if (res.ok) {
                navigate('/success');
            } else {
                throw new Error('nie udalo sie edytowac zaownika');
            }
        } catch (error) {
            navigate('/error', setErrors(error.message) );
        }
    };


    if (!clubId) return <p>ladowanie</p>;

    return (
        <form className="registration-form" onSubmit={handleSubmit}>
            <h3>Edytuj piłkarza:</h3>

            <label>Imię:
                <input type="text" value={name}
                    onChange={(e) => setName(e.target.value)}/>
                {errors.name && <div className="error-message">{errors.name}</div>}
            </label>
            <label>Nazwisko:
                <input type="text" value={surname}
                    onChange={(e) => setSurname(e.target.value)}/>
                {errors.surname && <div className="error-message">{errors.surname}</div>}
            </label>
            <label>Narodowość:
                <input type="text" value={nationality}
                       onChange={(e) => setNationality(e.target.value)}/>
                {errors.nationality && <div className="error-message">{errors.nationality}</div>}
            </label>
            <label>Pozycja:
                <input type="text" value={position}
                    onChange={(e) => setPosition(e.target.value)}/>
                {errors.position && <div className="error-message">{errors.position}</div>}
            </label>

            <label>
                Klub:
                <select className="form-select"
                        value={clubId}
                    onChange={(e) => setClubId(parseInt(e.target.value))}>


                    <option value="">Wybierz klub</option>
                    {clubs.map((club) => (
                        <option key={club.Id} value={club.Id}>
                            {club.name}
                        </option>
                    ))}
                </select>

                {errors.clubId && <div className="error-message">{errors.clubId}</div>}
            </label>
            <button type="submit">Zapisz zmiany</button>
        </form>
    );
};

export default EditFootballPlayerForm;
