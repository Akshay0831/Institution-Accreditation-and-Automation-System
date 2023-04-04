const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();

router.route("/")
    .get(async (req, res) => {
        const classAllocations = await mongo.getDocs("Class Allocation");

        let result = classAllocations.map(async ca => {
            ca["Class"] = await mongo.getDoc("Class", { _id: ca["fk_Class ID"] });
            ca["Teacher"] = await mongo.getDoc("Teacher", { _id: ca["fk_Teacher ID"] });
            ca["Subject"] = await mongo.getDoc("Subject", { "Subject Code": ca["fk_Subject Code"] });
        });
    })


module.exports = router;