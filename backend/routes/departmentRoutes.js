const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();
const { ObjectId } = require("mongodb");

router.route("/")
    .get(async (req, res) => {
        let departments = await mongo.getDocs("Department");
        departments = departments.map(async department => {
            department.HoD = await mongo.getDoc("Teacher", { _id: department.HoD });
            return department;
        });

        let departmentsFetched = departments.length > 0;

        res.status(departmentsFetched ? 200 : 400).json(departmentsFetched ? departments : "Couldn't fetch departments");
    });


module.exports = router;