const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const userHandler = require('./userHandler');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// error handler
// todo support user error 4xx codes
app.use(function(error, req, res, next) {
    res.status(500);
    res.render('500');
});

app.post('/user/register', async (req, res, next) => {
    try {
        await userHandler.createUser(
            req.body.firstName || '',
            req.body.lastName || '',
            req.body.password || '',
            req.body.confirmPassword || '',
            req.body.email || '',
        );
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

app.get('/user/login', async (req, res, next) => {
    try {
        const token = await userHandler.login(
            req.query.email || '',
            req.query.password || '',
        );
        res.send(token);
    } catch (err) {
        next(err);
    }
});

app.put('/user/logout', async (req, res, next) => {
    try {
        await userHandler.logoutUser(req.headers.authorization || '');
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

app.put('/user/update', async (req, res, next) => {
    try {
        await userHandler.updateUser(
            req.headers.authorization || '',
            req.body.firstName || '',
            req.body.lastName || '',
            req.body.email || ''
        );
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

app.delete('/user/delete', async (req, res, next) => {
    try {
        await userHandler.deleteUser(req.headers.authorization);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`listening on port ${port}`));
