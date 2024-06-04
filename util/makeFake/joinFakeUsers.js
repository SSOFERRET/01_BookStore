const conn = require('./../../mariadb')
const fs = require('fs');
const crypto = require('crypto');

const users = JSON.parse(fs.readFileSync('json/users.json', {encoding: 'utf-8', flag: "r"}));

const join = (email, password) => {
    
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    let sql = `INSERT INTO users (email, password, salt) VALUES (?, ?, ?)`;
    let values = [email, hashPassword, salt];

    conn.query(sql, values, 
        (err, results) => {
            if (err) {
                return console.log(err);
            }
            console.log(results);
        }
    )
};

console.log(users)
console.log(typeof users)

users.forEach((user) => {
    join(user.email, user.password);
})