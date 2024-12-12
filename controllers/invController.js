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
  res.render("inventory/classification", {
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

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      vehicleHTML,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

invCont.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const message = req.flash("info") || "";
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      message,
    });
  } catch (err) {
    console.error("Error in buildManagementView:", err);
    next(err);
  }
};

invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('inventory/add-classification', {
    title: 'Add New Classification',
    nav,
  });
};

invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  try {
    // Insert the new classification into the database
    const newClassification = await invModel.insertClassification(classification_name);
    
    res.redirect('/inventory/management');
  } catch (err) {
    console.error("Error adding classification:", err);
    next(err);
  }
};

invCont.buildNewCarView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classifications = await invModel.getClassifications();
    console.log("Classifications:", classifications); // Debugging log
    res.render('inventory/add-inventory', {
      title: 'Add New Vehicle',
      nav,
      classifications: classifications.rows,
    });
  } catch (error) {
    console.error("Error building new car view:", error);
    next(error);
  }
};


invCont.addNewCar = async function (req, res, next) {
  console.log("addNewCar called"); // Debugging log
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    } = req.body;
    
    try {

    // Insert into the database
    const newCar = await invModel.insertNewCar({
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });

    // Redirect with a success message
    req.flash('info', `New vehicle "${inv_make} ${inv_model}" added successfully.`);
    res.redirect('/inventory/management');
  } catch (error) {
    console.error("Error adding new car:", error);
    req.flash('error', 'Failed to add the vehicle. Please try again.');
    res.redirect('/inventory/add-inventory');
  }
};


module.exports = invCont