const mariadb = require("mysql2");

const connection = mariadb.createConnection(
    {host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'BookStore',
    dataStrings: true}
);

module.exports = connection;