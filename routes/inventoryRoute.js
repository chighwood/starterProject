const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Route for management view
router.get("/management", utilities.handleErrors(invController.buildManagementView));

// Route for management view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route for seeing all inventory
router.get("/allCars", utilities.handleErrors(invController.buildInventoryAllView));

// Route for inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route for vehicle detail view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildDetailView));

// Route for new classification
router.get("/add-classification", utilities.handleErrors(invController.buildNewClassification));

router.post("/add-classification", utilities.handleErrors(invController.addClassification));

// Route for new vehicle
router.get("/add-inventory", utilities.handleErrors(invController.buildNewCarView));

router.post("/add-inventory", utilities.handleErrors(invController.addNewCar));

// Route for updating vehicles
router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildVehicleEditView));

router.post("/update/", utilities.handleErrors(invController.updateCar));

// Route for deleting vehicles from the database
router.get("/delete/:inventory_id", utilities.handleErrors(invController.buildVehicleDeleteView));

router.post("/delete/", utilities.handleErrors(invController.deleteCar));


module.exports = router;

