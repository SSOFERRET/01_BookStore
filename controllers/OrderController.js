const { StatusCodes } = require('http-status-codes');
const mariadb = require('mysql2/promise');
const conn2 = require('./../mariadb');

const proceedOrder = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'BookStore',
        dataStrings: true
    })

    const { items, delivery, totalQuantity, userId, totalPrice, firstBookTitle } = req.body;
    
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
    const sql = 'DELETE FROM BookStore.cart_items WHERE cart_item_id IN (?)';
    const result = await conn.query(sql, [items]);
    return result;
}

const getOrders = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'BookStore',
        dataStrings: true
    })
    let sql = `SELECT order_id, address, receiver, contact, book_title, total_quantity, total_price FROM orders LEFT JOIN delivery ON orders.delivery_id = delivery.delivery_id`;
    const [rows] = await conn.query(sql);
    res.status(StatusCodes.OK).json(rows);
}

const getOrderDetail = async (req, res) => {
    const id = Number(req.params.id);
    const conn = await mariadb.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'BookStore',
        dataStrings: true
    });
    const sql = `SELECT ordered_book_id, ordered_books.book_id, title, author, price, quantity
                FROM ordered_books
                LEFT JOIN books
                ON ordered_books.book_id = books.book_id
                WHERE ordered_book_id = ?
                `;
  const [rows, fields] = await conn.query(sql, id);

  res.status(StatusCodes.OK).json(rows);
}

module.exports = {
    proceedOrder,
    getOrders,
    getOrderDetail
}