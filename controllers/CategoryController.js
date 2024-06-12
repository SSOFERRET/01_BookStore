const conn = require('./../mariadb');
const {StatusCodes} = require('http-status-codes');

const getAllCategory = (_, res) => {
    let sql = 'SELECT * FROM BookStore.categories';
    conn.query(sql, 
        (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.status(StatusCodes.OK).json(results);
        }
    )
};

module.exports = {
    getAllCategory
}