const express = require('express');
const { addadmin, login } = require('../controller/admin.controller');

const routes = express.Router();

routes.post("/add-admin", addadmin);
routes.post("/login", login);

module.exports = routes;