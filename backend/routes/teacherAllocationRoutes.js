const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();

router.route("/")
    .get(async (req, res) => {
        const teacherAllocations = await mongo.getDocs("Teacher Allocation");

        for (let ta of teacherAllocations) {
            ta.Class = await mongo.getDoc("Class", { _id: ta.Class });
            ta.Teacher = await mongo.getDoc("Teacher", { _id: ta.Teacher });
            ta.Subject = await mongo.getDoc("Subject", { _id: ta.Subject });
            ta.Department = await mongo.getDoc("Department", { _id: ta.Department });
        }

        let gotResult = teacherAllocations.length > 0;
        res.status(gotResult ? 200 : 400).json(gotResult ? teacherAllocations : "Couldn't get class allocations");
    })


module.exports = router;