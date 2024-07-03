const { StatusCodes } = require('http-status-codes');
const mariadb = require('mysql2/promise');
const ensureAuthorization = require('../auth');

const proceedOrder = async (req, res) => {
    const authorization = ensureAuthorization(req);

    // if (authorization instanceof TokenExpiredError) 
    //     return res.status(StatusCodes.UNAUTHORIZED).json(authorization);
    // else if  (authorization instanceof JsonWebTokenError)
    //     return res.status(StatusCodes.BAD_REQUEST).json(authorization);

    const conn = await mariadb.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'BookStore',
        dataStrings: true
    })

    const userId = authorization.id;
    const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;

    let sql = 'INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)';
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let [results] = await conn.query(sql, values);
    let deliveryId = results.insertId;
    console.log("deliveryId:", deliveryId);

    sql = 'INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)';

    values = [firstBookTitle, totalQuantity, totalPrice, userId, deliveryId];

    [results] = await conn.query(sql, values);
    let orderId = results.insertId;
    console.log("orderId:", orderId)

    sql = 'SELECT book_id, quantity FROM cart_items WHERE cart_item_id IN (?)';
    console.log([items]);
    let [orderItems, fields] = await conn.query(sql, [items]);
    console.log('orderItems:', orderItems)
    console.log('fields:', fields)

    sql = 'INSERT INTO ordered_books (order_id, book_id, quantity) VALUES ?';
    values = [];
    orderItems.forEach((item) => {
        values.push([orderId, item.book_id, item.quantity]);
    })

    results = await conn.query(sql, [values]);
    console.log('results:', results);
    const result = await deleteCartItems(conn, items);
    return res.status(StatusCodes.OK).json(result);
}

const deleteCartItems = async (conn, items) => {

    // if (authorization instanceof TokenExpiredError) 
    //     return res.status(StatusCodes.UNAUTHORIZED).json(authorization);
    // else if  (authorization instanceof JsonWebTokenError)
    //     return res.status(StatusCodes.BAD_REQUEST).json(authorization);

    const sql = 'DELETE FROM BookStore.cart_items WHERE cart_item_id IN (?)';
    const result = await conn.query(sql, items);
    return result;
}

const getOrders = async (req, res) => {
    const authorization = ensureAuthorization(req);

    // if (authorization instanceof TokenExpiredError) 
    //     return res.status(StatusCodes.UNAUTHORIZED).json(authorization);
    // else if  (authorization instanceof JsonWebTokenError)
    //     return res.status(StatusCodes.BAD_REQUEST).json(authorization);

    const conn = await mariadb.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'BookStore',
        dataStrings: true
    })
    let sql = `SELECT order_id, created_at, address, receiver, contact, book_title, total_quantity, total_price FROM BookStore.orders LEFT JOIN BookStore.delivery ON BookStore.orders.delivery_id = BookStore.delivery.delivery_id`;
    const [rows] = await conn.query(sql);
    console.log(rows);
    res.status(StatusCodes.OK).json(rows);
}

const getOrderDetail = async (req, res) => {
    const authorization = ensureAuthorization(req);

    // if (authorization instanceof TokenExpiredError) 
    //     return res.status(StatusCodes.UNAUTHORIZED).json(authorization);
    // else if  (authorization instanceof JsonWebTokenError)
    //     return res.status(StatusCodes.BAD_REQUEST).json(authorization);
    
    const id = Number(req.params.id);
    const conn = await mariadb.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'BookStore',
        dataStrings: true
    });
    const sql = `SELECT ordered_book_id, ordered_books.book_id, title, author, price, quantity
                FROM BookStore.ordered_books
                LEFT JOIN BookStore.books
                ON ordered_books.book_id = books.book_id
                WHERE order_id = ?
                `;
  const [rows, fields] = await conn.query(sql, id);
  console.log(rows);

  res.status(StatusCodes.OK).json(rows);
}

module.exports = {
    proceedOrder,
    getOrders,
    getOrderDetail
}