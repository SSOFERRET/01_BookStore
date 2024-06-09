const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken');
const ensureAuthorization = require('../auth');
const conn = require('./../mariadb');
const { StatusCodes } = require('http-status-codes');

const addToCart = (req, res) => {
    const bookId = Number(req.body.book_id);
    const quantity = Number(req.body.quantity);
    const userId = Number(req.body.user_id);

    let sql = 'INSERT INTO BookStore.cart_items (book_id, quantity, user_id) VALUES (?, ?, ?)';
    let values = [bookId, quantity, userId];

    conn.query(sql, values, 
        (err, results) => {
            if (err) {
                return console.log(err);
            }
            return res.status(StatusCodes.OK).json(results);
        }
    )
};

const getCartItems = (req, res) => {
    const authorization = ensureAuthorization(req);

    if (authorization instanceof TokenExpiredError) 
        return res.status(StatusCodes.UNAUTHORIZED).json(authorization);
    else if  (authorization instanceof JsonWebTokenError)
        return res.status(StatusCodes.BAD_REQUEST).json(authorization);

    const userId = Number(req.body.userId);

    let sql = 'SELECT * FROM BookStore.cart_items WHERE user_id=?';
    conn.query(sql, userId, 
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json({results});
        }
    )
}

const removeCartItems = (req, res) => {
    const authorization = ensureAuthorization(req);

    if (authorization instanceof TokenExpiredError) 
        return res.status(StatusCodes.UNAUTHORIZED).json(authorization);
    else if  (authorization instanceof JsonWebTokenError)
        return res.status(StatusCodes.BAD_REQUEST).json(authorization);

    const cartItemId = Number(req.body.cart_item_id);
    const userId = Number(req.body.user_id);

    let sql = 'DELETE FROM cart_items WHERE cart_item_id=? AND user_id=?';
    let values = [cartItemId, userId];

    conn.query(sql, values,
        (err, results) => {
            if (err) return console.log(err);
            return res.status(StatusCodes.OK).json(results);
        }
    );
};

module.exports = {
    addToCart,
    getCartItems,
    removeCartItems
};