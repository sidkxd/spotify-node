const express = require("express");

const router = express.Router();

const {
  test,
  login,
  callback,
  isAuthorised,
} = require("../controllers/spotify.controller");

router.route("/api").get(test);
router.route("/login").get(login);
router.route("/callback").get(callback);
router.route("/is-auth").get(isAuthorised);

module.exports = router;
