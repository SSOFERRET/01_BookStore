const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken');
const ensureAuthorization = require('../auth');
const conn = require('./../mariadb');
const { StatusCodes } = require('http-status-codes');

const addToCart = (req, res) => {
    const bookId = Number(req.body.book_id);
    const quantity = Number(req.body.quantity);
    const decodedJwt = ensureAuthorization(req);
    const userId = decodedJwt.id;

    console.log(decodedJwt);
    let sql = 'INSERT INTO BookStore.cart_items (book_id, quantity, user_id) VALUES (?, ?, ?)';
    let values = [bookId, quantity, userId];
    console.log(values)

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

    // if (authorization instanceof TokenExpiredError) 
    //     return res.status(StatusCodes.UNAUTHORIZED).json(authorization);
    // else if  (authorization instanceof JsonWebTokenError)
    //     return res.status(StatusCodes.BAD_REQUEST).json(authorization);

    const userId = authorization.id;

    let sql = `SELECT cart_item_id, BookStore.cart_items.book_id, 
    quantity, title, summary, price
    FROM BookStore.cart_items 
    LEFT JOIN BookStore.books
    ON BookStore.cart_items.book_id = BookStore.books.book_id
    WHERE user_id=?`;
    conn.query(sql, userId, 
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        }
    )
}

const removeCartItems = (req, res) => {
    const authorization = ensureAuthorization(req);
    console.log("removeCartItems")

    // if (authorization instanceof TokenExpiredError) 
    //     return res.status(StatusCodes.UNAUTHORIZED).json(authorization);
    // else if  (authorization instanceof JsonWebTokenError)
    //     return res.status(StatusCodes.BAD_REQUEST).json(authorization);

    const cartItemId = Number(req.params.id);
    const userId = authorization.id;

    let sql = 'DELETE FROM BookStore.cart_items WHERE cart_item_id=? AND user_id=?';
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