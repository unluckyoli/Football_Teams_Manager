import { Link, useNavigate } from 'react-router-dom';
import {useState} from "react";

const OnePlayerMatch = ({ playerMatch }) => {
    const navigate = useNavigate();


    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/player_matches/${playerMatch.player_match_id}`, {
                method: 'DELETE',
                credentials: "include",
            });

            if (res.ok) {
                navigate('/success');
            } else {
                throw new Error('nie udalo sir usunac wystepu');
            }
        } catch (error) {
            navigate('/error');
        }
    };





    return (
        <tr>
            <td>{playerMatch.player_name}</td>
            <td>{playerMatch.player_surname}</td>
            <td>{playerMatch.rating}</td>
            <td>
                <Link className="details-link" to={`/player-matches/${playerMatch.player_match_id}`}>
                    Szczegóły
                </Link>
                {' | '}
                <Link className="details-link" to={`/player-matches/edit/${playerMatch.player_match_id}`}>
                    Edytuj
                </Link>
                {' | '}
                <button onClick={handleDelete} className="delete-button">Usuń</button>
            </td>
        </tr>
    );
};

export default OnePlayerMatch;
