const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Route for inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route for vehicle detail view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildDetailView));

// Route for management view
router.get("/management", utilities.handleErrors(invController.buildManagementView));

// Route for new classification
router.get("/add-classification", utilities.handleErrors(invController.buildNewClassification));

router.post("/add-classification", utilities.handleErrors(invController.addClassification));

// Route for new vehicle
router.get("/add-inventory", utilities.handleErrors(invController.buildNewCarView));

router.post("/add-inventory", utilities.handleErrors(invController.addNewCar));


module.exports = router;

