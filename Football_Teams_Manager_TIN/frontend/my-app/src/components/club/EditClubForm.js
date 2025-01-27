import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditClubForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [league, setLeague] = useState('');
    const [position, setPosition] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        /**
         * pobieramy dane klubu ktorego chcemy edytowac bysmy widzieli co edytujemy
         */
        const fetchClub = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/clubs/${id}`);
                if (!res.ok)
                    throw new Error('nie udalo sie pobrac danych klubu');


                const club = await res.json();
                setName(club.name);
                setCountry(club.country);
                setCity(club.city);
                setLeague(club.league);
                setPosition(club.position);
            } catch (error) {
                setErrors(error.message);

            }
        };

        fetchClub();
    }, [id]);


    const validate = () => {
        const newErrors = {};
        if (!name.trim() || name.trim().length < 3) newErrors.name = 'Nazwa klubu musi mieć co najmniej 3 znaki';
        if (!country.trim() || country.trim().length < 3) newErrors.country = 'Kraj musi mieć co najmniej 3 znaki';
        if (!city.trim() || city.trim().length < 3) newErrors.city = 'Miasto musi mieć co najmniej 3 znaki';
        if (!league.trim() || league.trim().length < 3) newErrors.league = 'Liga musi mieć co najmniej 3 znaki';
        if (!position || position < 1 || position > 20) {
            newErrors.position = 'Pozycja musi być liczbą od 1 do 20';
        }
        return newErrors;
    };





    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }


        const updatedClub = { name, country, city, league, position };

        try {
            const res = await fetch(`http://localhost:5000/api/clubs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedClub),
            });



            if (res.ok) {
                navigate('/success');
            } else {
                throw new Error('nie udalo sie edytowac klubu');
            }
        } catch (error) {
            navigate('/error', setErrors(error.message) );
        }

    };








    return (
        <form className="registration-form" onSubmit={handleSubmit}>
            <h3>Edytuj klub:</h3>

            <label>
                Nazwa:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <div className="error-message">{errors.name}</div>}
            </label>

            <label>
                Kraj:
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
                {errors.country && <div className="error-message">{errors.country}</div>}
            </label>

            <label>
                Miasto:
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                {errors.city && <div className="error-message">{errors.city}</div>}
            </label>

            <label>
                Liga:
                <input type="text" value={league} onChange={(e) => setLeague(e.target.value)} />
                {errors.league && <div className="error-message">{errors.league}</div>}
            </label>

            <label>
                Pozycja:
                <input type="number" value={position} onChange={(e) => setPosition(Number(e.target.value))}/>
                {errors.position && <div className="error-message">{errors.position}</div>}
            </label>

            <button type="submit">Zachowaj zmiany</button>
        </form>
    );
};

export default EditClubForm;
