import { useEffect, useState } from 'react';
import OnePlayerMatch from "./OnePlayerMatch";

const ListOfPlayerMatches = () => {
    const [error, setError] = useState(null);
    const [playerMatches, setPlayerMatches] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(5);

    const fetchPlayerMatches = async (page) => {
        try {
            const res = await fetch(`http://localhost:5000/api/player_matches?page=${page}&limit=${limit}`);

            if (!res.ok) {
                new Error('nie dalo sie listy wystepow z bazy');
            }

            const result = await res.json();

            setPlayerMatches(result.data);
            setCurrentPage(result.currentPage);
            setTotalPages(result.totalPages);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchPlayerMatches(currentPage);
    }, [currentPage]);

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };




    if (playerMatches.length === 0) {
        return <p>brak wystepow do wyswietlenia</p>;
    }





    if (error)
        return <p>BŁĄD: {error}</p>;



    return (
        <div className="tabelka-glowna">
            <h2>Lista Występów Zawodników</h2>

            <table className="club-table">
                <thead>
                <tr>
                    <th>Imię</th>
                    <th>Nazwisko</th>
                    <th>Ocena</th>
                    <th>Szczegóły</th>
                </tr>
                </thead>
                <tbody>
                {playerMatches.map((pm) => (
                    <OnePlayerMatch key={pm.player_match_id} playerMatch={pm} />
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

export default ListOfPlayerMatches;
