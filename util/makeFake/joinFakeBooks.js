const conn = require('./../../mariadb')
const fs = require('fs');
const crypto = require('crypto');

const books = JSON.parse(fs.readFileSync('json/books.json', {encoding: 'utf-8', flag: "r"}));

const join = (book) => {
    let {title, author, isbn, description, detail, pub_date, category, price} = book;
    // pub_date = Date(pub_date);
    category = Number(category);
    price = Number(price);
    let sql = `INSERT INTO BookStore.books (title, author, isbn, description, detail, pub_date, category, price)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    let values = [title, author, isbn, description, detail, pub_date, category, price];

    conn.query(sql, values, 
        (err, results) => {
            if (err) {
                return console.log(err);
            }
            console.log(results);
        }
    )
};

// console.log(books)
// console.log(typeof books)


books.forEach((book) => {
    join(book);
})
