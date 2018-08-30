const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const userHandler = require('./userHandler');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post('/user/register', (req, res) => {
    userHandler.createUser(
        req.body.firstName || '',
        req.body.lastName || '',
        req.body.password || '',
        req.body.confirmPassword || '',
        req.body.email || '',
    );
    res.sendStatus(204);
});

app.get('/user/login', (req, res) => {
    const token = userHandler.login(
        req.query.email || '',
        req.query.password || '',
    );
    res.send(token);
});

app.put('/user/logout', (req, res) => {
    userHandler.logoutUser(req.headers.authorization || '');
    res.sendStatus(204);
});

app.put('/user/update', (req, res) => {
    userHandler.updateUser(
        req.headers.authorization || '',
        req.body.firstName || '',
        req.body.lastName || '',
        req.body.email || ''
    );
    res.sendStatus(204);
});

app.delete('/user/delete', (req, res) => {
    userHandler.deleteUser(req.headers.authorization);
    res.sendStatus(204);
});

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`listening on port ${port}`));
