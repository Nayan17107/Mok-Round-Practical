const express = require('express');
const { createManager, getAllManagers, updateManager, deleteManager } = require('../controller/manager.controller');
const { verifyToken } = require('../middleware/verifyToken');

const routes = express.Router();

routes.post("/create-manager", verifyToken, createManager);
routes.get("/all-managers", verifyToken, getAllManagers);
routes.put("/update-manager/:managerId", verifyToken, updateManager);
routes.delete("/delete-manager/:managerId", verifyToken, deleteManager);

module.exports = routes;