const { faker } = require('@faker-js/faker');
const fs = require('fs');

const users = [];

for (let i = 1; i <= 1000; i++) {
    const user = {
        email: faker.internet.email(),
        password: faker.internet.password()
    }
    users.push(user);
}

const usersJson = JSON.stringify(users, null, 4);

fs.writeFileSync('json/users.json', usersJson, 'utf-8');

console.log(usersJson)
