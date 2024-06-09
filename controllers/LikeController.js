const { StatusCodes } = require('http-status-codes');
const conn = require('./../mariadb');
const ensureAuthorization = require('../auth');

const addLike = (req, res) => {
    const authorization = ensureAuthorization(req);

    if (authorization instanceof TokenExpiredError) 
        return res.status(StatusCodes.UNAUTHORIZED).json(authorization);
    else if  (authorization instanceof JsonWebTokenError)
        return res.status(StatusCodes.BAD_REQUEST).json(authorization);
    
    const bookId = Number(req.params.id);
    const userId = Number(req.body.userId);

    const sql = `INSERT INTO likes (user_id, book_id) VALUES (?, ?)`;
    const values = [userId, bookId];

    conn.query(sql, values, 
        (err, results) => {
            if (err) console.log(err);
            return res.status(StatusCodes.CREATED).json(results);
        }
    )
}

const removeLike = (req, res) => {
    const authorization = ensureAuthorization(req);

    if (authorization instanceof TokenExpiredError) 
        return res.status(StatusCodes.UNAUTHORIZED).json(authorization);
    else if  (authorization instanceof JsonWebTokenError)
        return res.status(StatusCodes.BAD_REQUEST).json(authorization);
    
    const bookId = Number(req.params.id);
    const userId = Number(req.body.userId);

    const sql = `DELETE FROM likes WHERE user_id=? AND book_id=?`;
    const values = [userId, bookId];

    conn.query(sql, values, 
        (err, results) => {
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        }
    );
}

module.exports = {
    addLike,
    removeLike
}