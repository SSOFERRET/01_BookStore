const { StatusCodes } = require('http-status-codes');
const conn = require('./../mariadb');
const mariadb = require('mysql2/promise');
const ensureAuthorization = require('../auth');

const getBooks = (req, res) => {
    let {category_id, news, limit, currentPage} = req.query;
    let categoryId = Number(category_id);
    limit = Number(limit);
    currentPage = currentPage ? Number(currentPage) : 1;
    news = Boolean(news);
    const offset = (currentPage-1) * limit;
    let allBooksRes = {};
    let values = [];
    
    let sql = `SELECT SQL_CALC_FOUND_ROWS *, 
        (SELECT count(*) FROM BookStore.likes WHERE book_id = BookStore.books.book_id) AS likes 
        FROM BookStore.books`;

    if (categoryId && news) {
        sql += ` WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 3 MONTH) AND NOW()`;
        values.push(categoryId);
    }
    else if (categoryId){
        sql += ` WHERE category_id=?`;
        values.push(categoryId);
    }
    else if (news) 
        sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 3 MONTH) AND NOW()`;

    sql += ` LIMIT ? OFFSET ?`;

    values.push(limit, offset);

    conn.query(sql, values, 
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.NOT_FOUND).end();
            }
            allBooksRes.books = results;
        }
    );

    sql = `SELECT found_rows()`;

    conn.query(sql, 
        (err, results) => {
            if (err) 
                return res.status(StatusCodes.NOT_FOUND).end();
            if (allBooksRes.books) {
                let pagination = {};
                pagination.currentPage = parseInt(currentPage);
                pagination.totalCount = results[0]["found_rows()"];
                allBooksRes.pagination = pagination;
                console.log(allBooksRes);
                return res.status(StatusCodes.OK).json(allBooksRes);
            }
        }
    )
};

const getBookDetail = async (req, res) => {
    const bookId = Number(req.params.id);
    const authorization = ensureAuthorization(req);
    
    if (authorization.email) {
        getBookDetailLoggedIn(req, res, bookId, authorization);
    } else {
        getBookDetailLogOut(req, res, bookId);
    }
};

const getBookDetailLogOut = (req, res, bookId) => {
    let values = [bookId, bookId];

    let sql = `SELECT *, 
    (SELECT count(*) FROM BookStore.likes 
    WHERE book_id=?) as likes,
    0 as liked
    FROM BookStore.books 
    LEFT JOIN BookStore.categories
    ON BookStore.books.category_id = BookStore.categories.category_id
    WHERE book_id=?`;
    
    conn.query(sql, values, 
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
}

const getBookDetailLoggedIn = async (req, res, bookId, authorization) => { 
    const conn = await mariadb.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'BookStore',
        dataStrings: true
    })

    let sql = `SELECT user_id FROM BookStore.users WHERE email=?`
    let [result] = await conn.query(sql, authorization.email, 
        (err, results) => {
            if (err)
                return console.log(err);
            return results;
        }
    )

    let userId = result[0].user_id;
    let values = [bookId, bookId, userId, bookId];

    // console.log("result:", result[0].user_id);

    sql = `SELECT *, 
    (SELECT count(*) FROM BookStore.likes 
    WHERE book_id=?) as likes, 
    (SELECT EXISTS (SELECT * FROM BookStore.likes
    WHERE book_id=? and user_id=?)) as liked
    FROM BookStore.books 
    LEFT JOIN BookStore.categories
    ON BookStore.books.category_id = BookStore.categories.category_id
    WHERE book_id=?`;

    let [ book ] = await conn.query(sql, values, 
        (err, results) => {
            if (err) console.log(err);
            else {
                return results[0];
            }
        }
    );
    if (book)
        return res.status(StatusCodes.OK).json(book[0]);
    return res.status(StatusCodes.NOT_FOUND).end();
}

module.exports = {
    getBooks,
    getBookDetail
}