const { faker } = require('@faker-js/faker');
const fs = require('fs');

const books = [];

for (let i = 1; i <= 5000; i++) {
    const book = {
        id: i,
        title: faker.lorem.sentence(),
        author: faker.person.fullName(),
        isbn: faker.number.int({max: 9999999999999, min: 1000000000000}).toString(),
        pub_date: faker.date.between('1990-01-01', '2024-05-31').toISOString().split("T")[0],
        price: faker.datatype.number({min: 100, max: 500}) * 100
    }
    books.push(book);
}

const booksJson = JSON.stringify(books, null, 4);

fs.writeFileSync('dummies/books.json', booksJson, 'utf-8');

console.log(booksJson)
