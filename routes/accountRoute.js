const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin));
router.get("/account-management", utilities.handleErrors(accountController.buildDefaultManagement));
// router.get("/account-management", utilities.handleErrors(accountController.buildDefaultManagement));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post("/register", regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

module.exports = router;
