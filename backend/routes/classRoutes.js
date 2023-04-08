const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();
const { ObjectId } = require("mongodb");

router.route("/")
    .get(async (req, res) => {
        let classes = await mongo.getDocs("Class");
        for (let classObj of classes)
            classObj.Department = await mongo.getDoc("Department", { _id: classObj.Department });
        console.log(classes);
        let gotClasses = classes.length > 0;
        res.status(gotClasses ? 200 : 400).json(gotClasses ? classes : "Couldn't fetch classes");
    })

module.exports = router;