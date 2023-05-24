const express = require('express');
const router = express.Router();

router.route("/")
    .get(async (req, res) => {
        res.json({ message: "login api called" });
    })

    .post(async (req, res) => {
        res.json({ message: req.uid });
    });

module.exports = router;