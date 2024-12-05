const { Pool } = require("pg");
require("dotenv").config();

/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */

let pool;

// SSL configuration based on environment (SSL always enabled)
const sslConfig = process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : true;

pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
});

// Added for troubleshooting queries during development
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      console.log("executed query", { text });
      return res;
    } catch (error) {
      console.error("error in query", { text });
      throw error;
    }
  },
};
