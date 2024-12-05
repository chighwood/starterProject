/* ************* Required ************* */
const utilities = require('../utilities');
const accountModel = require('../models/account-model');

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    console.log("Nav generated successfully");
    const message = req.flash("message");
    res.render("./account/login", {
      title: "Login",
      nav,
      message,
    })
  }

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/register", {
    title: "Register",
    nav,
  })
}

// Process Registration
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Validate required fields
  if (!account_firstname || !account_lastname || !account_email || !account_password) {
    req.flash("message", "All fields are required.");
    return res.status(400).render("account/register", {
      title: "Registration",
      nav,
      errors: ["All fields are required."],
    });
  }

  try {
    // Attempt to register the account
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );

    req.flash("message", `Welcome, ${account_firstname}. Please log in.`);
    res.redirect("/account/login");
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("message", error.message || "Registration failed due to a server error.");
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: [error.message || "Registration failed due to a server error."],
    });
  }
}

  
  module.exports = { buildLogin, buildRegister, registerAccount };