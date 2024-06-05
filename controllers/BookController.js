const { StatusCodes } = require('http-status-codes');
const conn = require('./../mariadb');

const getBooks = (req, res) => {
    const userId = Number(req.body.user_id);
    let {category_id, news, limit, page} = req.query;
    let categoryId = Number(category_id);
    limit = Number(limit);
    page = Number(page);
    const offset = (page-1) * limit;
    
    let sql = `SELECT SQL_CALC_FOUND_ROWS *, 
        (SELECT count(*) FROM BookStore.likes WHERE book_id = BookStore.books.id) AS likes
        FROM BookStore.books
        LEFT JOIN BookStore.categories ON BookStore.books.category = BookStore.categories.id`;

    let values = [];

    if (categoryId && news) {
        sql += ` WHERE category=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
        values.push(categoryId);
    }
    else if (categoryId){
        sql += ` WHERE category=?`;
        values.push(categoryId);
    }
    else if (news) 
        sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;

    sql += ` LIMIT ? OFFSET ?`;
    values.push(limit, offset);

    conn.query(sql, values, 
        (err, results) => {
            if (err)
                console.log(err);
            else {
                res.status(StatusCodes.OK).json(results)
            }
        }
    )
};

const getBookDetail = (req, res) => {
    const bookId = Number(req.params.id);

    let sql = `SELECT * FROM BookStore.books WHERE id=?`;
    conn.query(sql, bookId, 
        (err, results) => {
            if (err) console.log(err);
            else {
                const book = results[0];
                if (book) 
                    return res.status(StatusCodes.OK).json(results[0]);
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        }
    )
};

module.exports = {
    getBooks,
    getBookDetail
}