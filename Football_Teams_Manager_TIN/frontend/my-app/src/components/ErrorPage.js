import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (


        <div className="error-page">
            <h2>Błąd</h2>
            <p>Wystąpił błąd podczas operacji.</p>
            <Link to="/">Powrót do strony głównej</Link>
        </div>
    );
};

export default ErrorPage;
