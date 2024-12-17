/* ************* Required ************* */
const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcrypt")

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
    error: null,
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

    const hashedPassword = await bcrypt.hash(account_password, 10);

    // Attempt to register the account
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
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

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const message = req.flash("message");

  try {
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData) {
      req.flash("message", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        message,
      });
    }

    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });

      req.session.user = accountData;
    
      const cookieOptions = process.env.NODE_ENV === "development"
        ? { httpOnly: true, maxAge: 3600 * 1000 }
        : { httpOnly: true, secure: true, maxAge: 3600 * 1000 };
    
      res.cookie("jwt", accessToken, cookieOptions);
      return res.render("account/account-management", {
        title: "Account Management",
        nav,
        message: req.flash("info"),
        user: accountData,
      });
    }
    
  } catch (error) {
    console.error("Error during login process:", error);
    req.flash("message", "An unexpected error occurred.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      message,
    });
  }
}

// Default Management Page Build
async function buildDefaultManagement(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const message = req.flash("info") || "";
    res.render("account/account-management", {
      title: "Account Management",
      nav,
      message,
    });
  } catch (err) {
    console.error("Error in buildDefaultManagementView:", err);
    next(err);
  }
};

// Process logout request
async function logoutAccount(req, res) {
  res.clearCookie("jwt")
  req.flash("info", "You have been successfully logged out.")
  res.redirect("/account/login")
}



// Update Info View Function
async function accountUpdateView(req, res) {
  try {
    const user = req.session.user || null;
    if (!user) {
      return res.status(401).redirect("/login");
    }
    console.log("User ID in session:", user.account_id);

    const accountData = await accountModel.getAccountData(user.account_id);

    if (!accountData) {
      console.error("Account not found for User ID:", user.account_id);
      return res.status(404).send('Account not found');
    }
    const nav = await utilities.getNav();

    return res.render("account/account-update", {
      title: 'Update Account',
      nav,
      accountData,
      message: req.flash('message')
    });
  } catch (error) {
    console.error("Error rendering account update page:", error);
    return res.status(500).send('Sorry, we appear to have lost that page.');
  }
}


// Update info and password
async function updateAccount(req, res) {
  const { account_firstname, account_lastname, account_email } = req.body
  const account_id = req.session.user.account_id
  

  try {
    await accountModel.updateAccountInfo(account_id, { account_firstname, account_lastname, account_email })

    req.flash("message", "Account information updated successfully.")
    res.redirect("/account/account-management")
  } catch (error) {
    console.error("Error updating account info:", error)
    req.flash("message", "Failed to update account information.")
    res.redirect("/account/account-management")
  }
}

async function updatePassword(req, res) {
  const { current_password, new_password, confirm_password } = req.body
  const account_id = req.session.user.account_id

  try {
    const account = await accountModel.getAccountById(account_id)

    if (!(await bcrypt.compare(current_password, account.account_password))) {
      req.flash("message", "Current password is incorrect.")
      return res.redirect("/account/account-management")
    }

    if (new_password !== confirm_password) {
      req.flash("message", "New passwords do not match.")
      return res.redirect("/account/account-management")
    }

    const hashedPassword = await bcrypt.hash(new_password, 10)
    await accountModel.updateAccountPassword(account_id, hashedPassword)

    req.flash("message", "Password updated successfully.")
    res.redirect("/account/account-management")
  } catch (error) {
    console.error("Error updating password:", error)
    req.flash("message", "Failed to update password.")
    res.redirect("/account/account-management")
  }
}

  module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildDefaultManagement, logoutAccount, accountUpdateView, updateAccount, updatePassword }