const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {}


// Build inventory by classification view
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
};

// Function for vehicle detail view
invCont.buildDetailView = async function (req, res, next) {
  const vehicleId = req.params.vehicleId;
  try {
    const vehicleData = await invModel.getVehicleById(vehicleId);
    if (!vehicleData) {
      return res.status(404).send("Vehicle not found");
    }
    let nav = await utilities.getNav();
    const vehicleHTML = utilities.generateVehicleDetailHTML(vehicleData);

    res.render("./inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      vehicleHTML,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports = invCont