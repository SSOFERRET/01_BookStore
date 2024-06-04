const conn = require('./../mariadb');
const crypto = require('crypto');
const {StatusCodes} = require('http-status-codes');

const join = (req, res) => {
    const {email, password} = req.body;
    
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    let sql = `INSERT INTO users (email, password, salt) VALUES (?, ?, ?)`;
    let values = [email, hashPassword, salt];

    conn.query(sql, values, 
        (err, results) => {
            if (err) {
                console.log(err);
                return res.json(err);
            } // err 내용을 어떻게 구분해서 status code를 분기화하지?
            res.status(StatusCodes.CREATED).json(results);
        }
    )
};

const login = (req, res) => {};

const requestPasswordReset = (req, res) => {};

const resetPassword = (req, res) => {};


module.exports = {
    join
}