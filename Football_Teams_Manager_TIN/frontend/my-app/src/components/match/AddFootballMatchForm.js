
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddFootballMatchForm = () => {
    const [clubs, setClubs] = useState([]);
    const [homeTeamId, setHomeTeamId] = useState('');
    const [awayTeamId, setAwayTeamId] = useState('');
    const [date, setDate] = useState('');
    const [score, setScore] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/clubs?page=1&limit=9999');
                if (!res.ok)
                    throw new Error('Nie udało się pobrać listy klubów');

                const data = await res.json();
                setClubs(data.data);
            } catch (error) {
                //console.error('blad przy pobieraniu klubow:', error.message);
                setErrors(error.message);

            }
        };
        fetchClubs();
    }, []);



    const validate = () => {
        const newErrors = {};
        if (!homeTeamId) newErrors.homeTeamId = 'wybor drużyny gospodarzy jest wymagany';
        if (!awayTeamId) newErrors.awayTeamId = 'wybor drużyny gosci jest wymagany';
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            newErrors.date = 'data musi być w formacie YYYY-MM-DD';
        }
        if (!score) {
            newErrors.score = 'wynik meczu jest wymagany';
        } else if (!/^\d+-\d+$/.test(score)) {
            newErrors.score = 'wynik meczu musi byc w formacie "X-Y"';
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

        const newMatch = { home_team_id: homeTeamId, away_team_id: awayTeamId, date, score };

        try {
            const res = await fetch('http://localhost:5000/api/matches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newMatch),
            });


            if (res.ok) {
                navigate('/success');
            } else {
                throw new Error('nie udalo sie dodac meczu');
            }
        } catch (error) {
            navigate('/error', setErrors(error.message) );
        }
    };






    return (
        <form className="registration-form" onSubmit={handleSubmit} noValidate>
            <h3>Dodaj mecz:</h3>

            <label>
                Drużyna gospodarzy:

                <select className="form-select" value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value)}>

                        <option value="">-- Wybierz drużynę --</option>
                            {clubs.map((club) => (
                        <option key={club.Id} value={club.Id}>{club.name}</option>
                            ))}
                </select>

                {errors.homeTeamId && <div className="error-message">{errors.homeTeamId}</div>}
            </label>

            <label>
                Drużyna gości:

                <select className="form-select" value={awayTeamId} onChange={(e) => setAwayTeamId(e.target.value)}>

                        <option value="">-- Wybierz drużynę --</option>
                            {clubs.map((club) => (
                        <option key={club.Id} value={club.Id}>{club.name}</option>
                            ))}

                </select>

                {errors.awayTeamId && <div className="error-message">{errors.awayTeamId}</div>}
            </label>

            <label>
                Data meczu:
                <input type="text" placeholder="YYYY-MM-DD" value={date} onChange={(e) => setDate(e.target.value)}/>
                {errors.date && <div className="error-message">{errors.date}</div>}
            </label>

            <label>
                Wynik meczu:
                <input type="text" value={score} onChange={(e) => setScore(e.target.value)}/>
                {errors.score && <div className="error-message">{errors.score}</div>}
            </label>


            <button type="submit">Dodaj</button>
        </form>
    );
};

export default AddFootballMatchForm;
