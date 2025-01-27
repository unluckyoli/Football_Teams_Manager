const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'footballdb',
    port: 3307,
});

db.connect((err) => {
    if (err) {
        console.error('BLAD z laczeniem z baza danych::::', err);
        return;
    }
    console.log('====================polaczono z baza:)))))))))))))=========================');
});

module.exports = db.promise();