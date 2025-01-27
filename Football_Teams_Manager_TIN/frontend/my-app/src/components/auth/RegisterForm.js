import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');


        if (!username.trim() || !password.trim()) {
            setError('nazwa uzytkownika lub haslo nie moze byc pusta.');
            return;
        }

        const registerIn = {username, password};

        try {
            const res = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(registerIn),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message);
            }

            navigate('/login');
        } catch (error) {
            setError(error.message);
        }
    };



    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <h2>Rejestracja</h2>

            <label>
                Nazwa użytkownika:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                {error && <div className="error-message">{error}</div>}
            </label>

            <label>
                Hasło:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                {error && <div className="error-message">{error}</div>}
            </label>

            <button type="submit">Zarejestruj się</button>
        </form>
    );
};

export default RegisterForm;
