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
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    } catch (error) {
      console.error("Error registering account:", error);
      throw error;
    }
  }

module.exports = { checkExistingEmail, registerAccount };