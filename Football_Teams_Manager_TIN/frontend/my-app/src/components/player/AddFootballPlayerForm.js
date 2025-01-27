import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles.css';

const AddFootballPlayerForm = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [nationality, setNationality] = useState('');
    const [position, setPosition] = useState('');
    const [clubId, setClubId] = useState('');
    const [clubs, setClubs] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/clubs?page=1&limit=9999');
                if (!res.ok)
                    throw new Error('nie udalo się pobrać listy klubów');

                const data = await res.json();
                setClubs(data.data);
            } catch (error) {
                setErrors(error.message);
            }
        };

        fetchClubs();
    }, []);


    const validate = () => {
        const newErrors = {};
        if (!name.trim() || name.trim().length < 3) newErrors.name = 'imie zawodnika musi miec co najmniej 3 znaki';
        if (!surname.trim() || surname.trim().length < 3) newErrors.surname = 'nazwisko zawodnika musi miec co najmniej 3 znaki';
        if (!nationality.trim() || nationality.trim().length < 3) newErrors.nationality = 'narodowosc musi miec co najmniej 3 znaki';
        if (!position.trim() || position.trim().length < 3) newErrors.position = 'pozycja zawodnika musi miec co najmniej 3 znak';
        if (!clubId) newErrors.clubId = 'musisz wybrac klub';
        return newErrors;
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const newPlayer = { name, surname, nationality, position, club_id: clubId };

        try {
            const res = await fetch('http://localhost:5000/api/football_players', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newPlayer),
            });

            if (res.ok) {
                navigate('/success');
            } else {
                throw new Error('nie udalo sir dodac zawodniia');
            }
        } catch (error) {
            navigate('/error', setErrors(error.message) );
        }
    };







    return (
        <form className="registration-form" onSubmit={handleSubmit}>
            <h3>Dodaj piłkarza:</h3>

            <label>Imię: <input type="text" value={name} onChange={(e) => setName(e.target.value)}  />
                {errors.name && <div className="error-message">{errors.name}</div>}
            </label>


            <label>Nazwisko: <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)}  />
                {errors.surname && <div className="error-message">{errors.surname}</div>}
            </label>


            <label>Narodowość: <input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)}  />
                {errors.nationality && <div className="error-message">{errors.nationality}</div>}
            </label>


            <label>Pozycja: <input type="text" value={position} onChange={(e) => setPosition(e.target.value)}  />
                {errors.position && <div className="error-message">{errors.position}</div>}</label>


            <label>Klub:

                <select className="form-select" value={clubId} onChange={(e) => setClubId(e.target.value)} >
                    <option value="">Wybierz klub</option>
                    {clubs.map(club => (
                        <option key={club.Id} value={club.Id}>
                            {club.name}
                        </option>
                    ))}

                </select>
                {errors.clubId && <div className="error-message">{errors.clubId}</div>}
            </label>


            <button type="submit">Dodaj</button>
        </form>
    );
};

export default AddFootballPlayerForm;
