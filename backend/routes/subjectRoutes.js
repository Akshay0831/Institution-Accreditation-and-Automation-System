const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();
const { ObjectId } = require("mongodb");

router.route("/")
    .get(async (req, res) => {
        let subjects = await mongo.getDocs("Subject");
        subjects = subjects.map(async subject => {
            subject.Department = await mongo.getDoc("Department", { _id: subject.Department });
            return subject;
        });
    })

module.exports = router;