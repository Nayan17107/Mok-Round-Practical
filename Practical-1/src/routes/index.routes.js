const express = require('express');

const routes = express.Router();

routes.use("/admin", require('./admin.routes'));
routes.use("/manager", require('./manager.routes'));

module.exports = routes;
