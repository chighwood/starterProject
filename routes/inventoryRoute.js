const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Route for inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route for vehicle detail view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildDetailView));

module.exports = router;

