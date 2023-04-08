const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();

router.route("/")
    .get(async (req, res) => {
        const marks = await mongo.getMarks();
        let gotMarks = marks.length > 0;
        res.status(gotMarks ? 200 : 400).json(gotMarks ? marks : "Couldn't fetch marks");
    })


    .put(async (req, res) => {
        const marksUpdated = await mongo.updateDoc("Marks", { _id: req.body._id }, req.body);

        res.status(marksUpdated ? 200 : 400).json(marksUpdated ? "Updated marks" : "Couldn't update marks");
    });

module.exports = router;