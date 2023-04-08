const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();
const { ObjectId } = require("mongodb");

router.route("/")
    .get(async (req, res) => {
        let subjects = await mongo.getDocs("Subject")
        for (subject of subjects)
            subject.Department = await mongo.getDoc("Department", { _id: subject.Department });

        let gotSubjects = subjects.length > 0;

        res.status(gotSubjects ? 200 : 400).json(gotSubjects ? subjects : "Couldn't fetch subjects");
    })

module.exports = router;