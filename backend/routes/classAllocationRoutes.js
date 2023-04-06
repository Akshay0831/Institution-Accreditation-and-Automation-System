const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();
const { ObjectId } = require("mongodb");

router.route("/")
    .get(async (req, res) => {
        let classAllocations = await mongo.getDocs("Class Allocation");
        classAllocations = classAllocations.map(async ca => {
            ca.Class = await mongo.getDoc("Class", { _id: ca.Class });
            ca.Student = await mongo.getDoc("Student", { _id: ca.Student });
            return ca;
        });

        let classAllocationsFetched = classAllocations.length > 0;

        res.status(classAllocationsFetched ? 200 : 400).json(classAllocationsFetched ? classAllocations : "Couldn't fetch class allocations");
    })

module.exports = router;