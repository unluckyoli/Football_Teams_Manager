import { useEffect, useState } from 'react';
import OneFootballMatch from './OneFootballMatch';

const ListOfFootballMatches = () => {
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    useEffect(() => {
    const fetchMatches = async (page) => {
        try {
            const res = await fetch(`http://localhost:5000/api/matches?page=${page}&limit=${limit}`);
            if (!res.ok) {
                new Error('nie dalo sie listy meczow z bazy');
            }
            const result = await res.json();


            setMatches(result.data);
            setCurrentPage(result.currentPage);
            setTotalPages(result.totalPages);
        } catch (error) {
            setError(error.message);
        }
    };

        fetchMatches(currentPage);
    }, [currentPage]);




    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };


    if (error)
        return <p>{error}</p>;






    return (
        <div className="tabelka-glowna">
            <h2>Lista meczów</h2>
            <table className="club-table">
                <thead>
                <tr>
                    <th>Drużyna gospodarzy</th>
                    <th>Drużyna gości</th>
                    <th>Data</th>
                    <th>Opcje</th>
                </tr>
                </thead>
                <tbody>
                {matches.map((match) => (
                    <OneFootballMatch key={match.id} match={match} />
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

export default ListOfFootballMatches;
