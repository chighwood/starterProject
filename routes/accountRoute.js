const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation')

// Main account route
router.get("/account-management", utilities.handleErrors(accountController.buildDefaultManagement));

// Login route
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin));

// Register route
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post("/register", regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Route to update account information/password
router.get('/account-update', utilities.handleErrors(accountController.accountUpdateView))
router.post('/update-info', regValidate.registrationRules(), utilities.handleErrors(accountController.updateAccount))
router.post('/update-password', regValidate.registrationRules(), utilities.handleErrors(accountController.updatePassword))

// router for logging out
router.get("/logout", utilities.handleErrors(accountController.logoutAccount));

module.exports = router;
