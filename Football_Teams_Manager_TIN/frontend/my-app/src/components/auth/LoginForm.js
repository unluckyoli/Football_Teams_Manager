import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm=({ onLoginSuccess })=> {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('nazwa uzytkownika lub haslo nie moze byc pusta!');
            return;
        }

        const logIn={ username, password};

        try {
            const res = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(logIn),
            });



            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message);
            }
            onLoginSuccess();
            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    };



    return (

        <form className="login-form" onSubmit={handleSubmit}>
            <h2>Logowanie</h2>

            <label>
                Nazwa użytkownika:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                {error && <div className="error-message">{error}</div>}
            </label>

            <label>
                Hasło:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                {error && <p className="error-message">{error}</p>}
            </label>

            <button type="submit">Zaloguj się</button>
        </form>
    );
}
export default LoginForm;