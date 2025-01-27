import { Link } from 'react-router-dom';

const SuccessPage = () => {
    return (

        <div className="success-page">

            <h2>Sukces!</h2>
            <p>Operacja zakończona sukcesem!</p>

            <Link to="/">Powrót do strony głównej</Link>

        </div>
    );
};

export default SuccessPage;

