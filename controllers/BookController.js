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
                // console.log(results);
                res.status(StatusCodes.OK).json(results)
            }
        }
    )

    // sql = "SELECT FOUND_ROWS()";
    // let 
    // const likes = conn.execute(sql, (err, result) => {
    //     if (err)
    //         console.log(err)
    //     else {
    //         // console.log(result)
    //     }
    // })
    // console.log(likes);

};

const getBookDetail = (req, res) => {

};

module.exports = {
    getBooks,
    getBookDetail
}