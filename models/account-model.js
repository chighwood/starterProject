const pool = require("../database/")

// Check for existing email
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email]);
      return email.rowCount > 0;
    } catch (error) {
      console.error("Error checking email:", error);
      throw error;
    }
  }

// Register new account
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    // Log the request body to check if data is being passed correctly
    console.log("Registration data:", { account_firstname, account_lastname, account_email, account_password });

    // Check if the email already exists in the database
    const emailExists = await checkExistingEmail(account_email);
    if (emailExists) {
      throw new Error("Email already registered");
    }

    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    return result;
  } catch (error) {
    console.error("Error in registerAccount:", error);
    throw new Error(error.message);
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

module.exports = { checkExistingEmail, registerAccount, getAccountByEmail };