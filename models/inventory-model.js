const pool = require("../database/")

// Get all classification data
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

//Get all inventory items and classification_name by classification_id
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

// Function to get a vehicle by ID
async function getVehicleById(vehicleId) {
  try {
    const result = await pool.query(
      `SELECT * FROM public.inventory 
       WHERE inv_id = $1`,
      [vehicleId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching vehicle by ID: " + error);
    throw error;
  }
}

async function insertClassification(classificationName) {
  try {
    const sql = `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *`;
    const result = await pool.query(sql, [classificationName]);
    return result.rows[0];
  } catch (error) {
    console.error("Error inserting classification: ", error);
    throw error;
  }
}

// Add new car to the database
async function insertNewCar({
  classification_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color
}) {
  try {
    const sql = `
      INSERT INTO public.inventory 
      (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`;
    const params = [
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    ];
    const result = await pool.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.error("Error inserting new car:", error);
    throw error;
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, insertClassification, insertNewCar};