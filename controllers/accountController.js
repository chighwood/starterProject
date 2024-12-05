/* ************* Required ************* */
const utilities = require('../utilities');
const accountModel = require('../models/account-model');

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    console.log("Nav generated successfully");
    // res.send("Build Login");
    res.render("./account/login", {
      title: "Login",
      nav,
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

  try {
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(400).render("account/register", {
        title: "Registration",
        nav,
        errors: null, // You can add specific error messages here if needed
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("notice", error.message || "An unexpected error occurred.");
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null, // You can display the error message from here if needed
    });
  }
}
  
  module.exports = { buildLogin, buildRegister, registerAccount };