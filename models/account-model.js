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

// Update account info and password

async function getAccountData(userId) {
  console.log("Fetching account data for User ID:", userId);
  const query = 'SELECT * FROM account WHERE account_id = $1';
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}

async function updateAccountInfo(account_id, updatedData) {
  const { account_firstname, account_lastname, account_email } = updatedData;
  const sql = `UPDATE account
               SET account_firstname = $1, account_lastname = $2, account_email = $3
               WHERE account_id = $4`;
  return pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
}

async function updateAccountPassword(account_id, new_password) {
  const sql = `UPDATE account
               SET account_password = $1
               WHERE account_id = $2`;
  return pool.query(sql, [new_password, account_id]);
}



module.exports = { checkExistingEmail, registerAccount, getAccountByEmail, getAccountData, updateAccountInfo, updateAccountPassword };