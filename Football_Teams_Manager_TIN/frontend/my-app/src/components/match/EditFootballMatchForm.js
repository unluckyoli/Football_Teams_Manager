import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditFootballMatchForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [homeTeamId, setHomeTeamId] = useState('');
    const [awayTeamId, setAwayTeamId] = useState('');
    const [date, setDate] = useState('');
    const [score, setScore] = useState('');
    const [clubs, setClubs] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/matches/${id}`);
                if (!res.ok)
                    throw new Error('nie udalo się pobrac danych meczu');

                const data = await res.json();
                console.log('Otrzymane dane:', data);

                setHomeTeamId(data.match.home_team_id);
                setAwayTeamId(data.match.away_team_id);
                const parsedDate = new Date(data.match.date);
                setDate(!isNaN(parsedDate) ? parsedDate.toISOString().split('T')[0] : '');
                setScore(data.match.score);

                setClubs(data.clubs);
            } catch (error) {
                setErrors(error.message );
            }
        };

        fetchData();
    }, [id]);

    const validate = () => {
        const newErrors = {};
        if (!homeTeamId) newErrors.homeTeamId = 'Drużyna gospodarzy jest wymagana.';
        if (!awayTeamId) newErrors.awayTeamId = 'Drużyna gości jest wymagana.';
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            newErrors.date = 'Data meczu musi być w formacie YYYY-MM-DD.';
        }
        if (!score) {
            newErrors.score = 'Wynik meczu jest wymagany.';
        } else if (!/^\d+-\d+$/.test(score)) {
            newErrors.score = 'Wynik meczu musi być w formacie "X-Y".';
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

        const updatedMatch = {
            home_team_id: homeTeamId,
            away_team_id: awayTeamId,
            date: date,
            score: score,
        };

        try {
            const res = await fetch(`http://localhost:5000/api/matches/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedMatch),
            });

            if (res.ok) {
                navigate('/success');
            } else {
                throw new Error('Nie udało się edytować meczu.');
            }
        } catch (error) {
            navigate('/error', setErrors(error.message) );
        }
    };

    if (!homeTeamId && !awayTeamId || !clubs.length) return <p>Ładowanie...</p>;

    return (
        <form onSubmit={handleSubmit} className="registration-form">
            <h3>Edytuj mecz</h3>

            <label>
                Drużyna gospodarzy:
                <select
                    className="form-select"
                    value={homeTeamId}
                    onChange={(e) => setHomeTeamId(parseInt(e.target.value))}
                >
                    <option value="">-- Wybierz drużynę --</option>
                    {clubs.map((club) => (
                        <option key={club.Id} value={club.Id}>
                            {club.name}
                        </option>
                    ))}
                </select>
                {errors.homeTeamId && <div className="error-message">{errors.homeTeamId}</div>}
            </label>

            <label>
                Drużyna gości:
                <select
                    className="form-select"
                    value={awayTeamId}
                    onChange={(e) => setAwayTeamId(parseInt(e.target.value))}
                >
                    <option value="">-- Wybierz drużynę --</option>
                    {clubs.map((club) => (
                        <option key={club.Id} value={club.Id}>
                            {club.name}
                        </option>
                    ))}
                </select>
                {errors.awayTeamId && <div className="error-message">{errors.awayTeamId}</div>}
            </label>

            <label>
                Data meczu:
                <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />
                {errors.date && <div className="error-message">{errors.date}</div>}
            </label>

            <label>
                Wynik meczu:
                <input type="text" value={score} onChange={(e) => setScore(e.target.value)} />
                {errors.score && <div className="error-message">{errors.score}</div>}
            </label>

            <button type="submit">Zapisz zmiany</button>
        </form>
    );
};

export default EditFootballMatchForm;
