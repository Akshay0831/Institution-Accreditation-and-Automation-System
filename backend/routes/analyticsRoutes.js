const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();

router.get("/", async (req, res) => {
    const departments = await mongo.getDocs("Department");
    const classes = await mongo.getDocs("Class");
    const subjects = await mongo.getDocs("Subject");

    res.status(200).json({ departments, classes, subjects });
})

router.get("/:department/:classid", async (req, res) => {
    console.log(req.params.department, req.params.classid);

    let marksData = await mongo.getMarks();

    let department = marksData.filter(department => department["Department Name"] === req.params.department)[0];
    let classObj = department.Classes.filter(c => c._id === req.params.classid)[0];
});

module.exports = router;