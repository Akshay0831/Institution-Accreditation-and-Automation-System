const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();
const { ObjectId } = require("mongodb");

router.route("/")
    .get(async (req, res) => {
        let classAllocations = await mongo.getDocs("Class Allocation");
        for (let ca of classAllocations) {
            ca.Class = await mongo.getDoc("Class", { _id: ca.Class });
            ca.Student = await mongo.getDoc("Student", { _id: ca.Student });
        }

        let classAllocationsFetched = classAllocations.length > 0;

        res.status(classAllocationsFetched ? 200 : 400).json(classAllocationsFetched ? classAllocations : "Couldn't fetch class allocations");
    })

module.exports = router;