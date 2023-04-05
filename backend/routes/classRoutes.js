const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();
const { ObjectId } = require("mongodb");

router.route("/")
    .get(async (req, res) => {
        let subjects = await mongo.getDocs("Class");
        subjects = subjects.map(async (classObj) => {
            classObj.Department = await mongo.getDoc("Department", { _id: classObj.Department });
            return classObj;
        });
    })

module.exports = router;