const conn = require('./../mariadb');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');

const join = (req, res) => {
    const {email, password} = req.body;
    
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    let sql = `INSERT INTO BookStore.users (email, password, salt) VALUES (?, ?, ?)`;
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

const login = (req, res) => {
    const {email, password} = req.body;
    let sql = `SELECT * FROM users WHERE email = ?`;
    conn.query(sql, email, 
        (err, results) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }

            const loginUser = results[0];
            const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 10, 'sha512').toString('base64');
            if (loginUser && hashPassword === loginUser.password) {
                const token = jwt.sign(
                    {email: loginUser.email, 
                        id: loginUser.user_id
                    },
                    'kkkk', 
                    {
                        expiresIn: '1h',
                        issuer: 'owner'
                    }
                );
                res.cookie('token', token, {httpOnly: true});
                return res.status(StatusCodes.OK).json({...results[0], token: token});
            } else
                return res.status(StatusCodes.UNAUTHORIZED).end();
        }
    )
};

const requestPasswordReset = (req, res) => {
    const { email } = req.body;

    let sql = `SELECT * FROM users WHERE email = ?`;
    conn.query(sql,  email, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        const user = results[0];
        if (user)
            return res.status(StatusCodes.OK).json({
                email: email
            });
        else 
            return res.status(StatusCodes.UNAUTHORIZED).end()
    })
};

const resetPassword = (req, res) => {
    const { email, password } = req.body;
    const salt = crypto.randomBytes(10).toString("base64");
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, "sha512").toString("base64");

    let sql = `UPDATE users SET password=?, salt=? WHERE email=?`;
    const value = [hashPassword, salt, email];
    conn.query(sql, value, 
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            if (results.affectedRows === 0)
                return res.status(StatusCodes.BAD_REQUEST).end();
            return res.status(StatusCodes.OK).json(results);
        }
    )
};


module.exports = {
    join, 
    login,
    requestPasswordReset,
    resetPassword
}