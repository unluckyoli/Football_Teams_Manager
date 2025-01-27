import { useEffect, useState } from 'react';
import OneFootballPlayer from './OneFootballPlayer';
import '../../styles.css';

const ListOfFootballPlayers = () => {
    const [players, setPlayers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const limit = 5;

    // Funkcja pomocnicza do pobrania danych z backendu
    const fetchPlayers = async (page) => {
        try {
            const res = await fetch(`http://localhost:5000/api/football_players?page=${page}&limit=${limit}`);
            if (!res.ok) {
                new Error('blad przy pobieraniu pilkarzy');
            }
            const result = await res.json();

            setPlayers(result.data);
            setCurrentPage(result.currentPage);
            setTotalPages(result.totalPages);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchPlayers(currentPage);
    }, [currentPage]);



    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };





    if (error)
        return <p>BŁĄD: {error}</p>;


    return (
        <div className="tabelka-glowna">
            <h2>Lista piłkarzy</h2>

            <table className="club-table">
                <thead>
                <tr>
                    <th>Imię i nazwisko</th>
                    <th>Szczegóły</th>
                </tr>
                </thead>

                <tbody>
                {players.map((player) => (
                    <OneFootballPlayer key={player.id} player={player} />
                ))}
                </tbody>
            </table>





            <div className="pagination-controls">
                <button onClick={handlePrevious} disabled={currentPage === 1}>
                    Poprzednia
                </button>
                <div>
                    Strona {currentPage} z {totalPages}
                </div>
                <button onClick={handleNext} disabled={currentPage === totalPages}>
                    Następna
                </button>
            </div>
        </div>
    );
};

export default ListOfFootballPlayers;
