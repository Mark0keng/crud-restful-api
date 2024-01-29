const express = require('express');

const app = express();
const Port = 5000;

// Import Routes
const userRoute = require('./api/user') 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route
app.use('/user', userRoute);

app.listen(Port, () => {
    console.log(['Info'], `Server started on port ${Port}`);
  });