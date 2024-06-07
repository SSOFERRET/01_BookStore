const express = require('express');
const app = express();

app.listen(9999);

const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const cartRouter = require('./routes/carts');
const categoryRouter = require('./routes/categories');
const likeRouter = require('./routes/likes');
const orderRouter = require('./routes/orders');

app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/carts', cartRouter);
app.use('/category', categoryRouter);
app.use('/likes', likeRouter);
app.use('/orders', orderRouter);