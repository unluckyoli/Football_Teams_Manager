import { useEffect, useState } from 'react';
import OneClub from './OneClub';
import '../../styles.css';

const ListOfClubs = () => {
    const [clubs, setClubs] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;


    useEffect(() => {
        const fetchClubs = async (page) => {
            try {
                const res = await fetch(`http://localhost:5000/api/clubs?page=${page}&limit=${limit}`);
                if (!res.ok) {
                    new Error('blad przy pobieraniu listy klubow');
                }
                const result = await res.json();

                setClubs(result.data);
                setCurrentPage(result.currentPage);
                setTotalPages(result.totalPages);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchClubs(currentPage);
    }, [currentPage]);

    // useEffect(() => {
    //     fetchClubs(currentPage);
    // }, [currentPage]);


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
            <h2>Lista klubow:</h2>

            <table className="club-table">
                <thead>
                <tr>
                    <th>Nazwa</th>
                    <th>Szczegoly</th>
                </tr>
                </thead>
                <tbody>
                {clubs.map(club => (
                    <OneClub key={club.Id} club={club}/>
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

export default ListOfClubs;
