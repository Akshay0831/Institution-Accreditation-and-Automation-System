const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();

router.route("/")
    .get(async (req, res) => {
        res.json({ message: "login api called" });
    })


    .post(async (req, res) => {
        res.json({ message: "logged-in" });
    });

module.exports = router;