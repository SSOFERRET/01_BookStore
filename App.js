const express = require('express');
const app = express();

// app.listen(9999);

const userRouter = require('./routes/users');

userRouter();
