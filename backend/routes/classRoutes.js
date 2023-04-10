const express = require('express');
const mongo = require("../db/mongodb");
const router = express.Router();

router.route("/")
    .get(async (req, res) => {
        let classes = await mongo.getDocs("Class");
        for (let classObj of classes)
            classObj.Department = await mongo.getDoc("Department", { _id: classObj.Department });
        let gotClasses = classes.length > 0;
        res.status(gotClasses ? 200 : 400).json(gotClasses ? classes : "Couldn't fetch classes");
    })

    .post(async (req, res) => {
        const classObj = req.body.Class;
        const classAdded = await mongo.addDoc("Class", classObj);

        res.status(classAdded ? 200 : 400).json(classAdded ? "Created new class" : "Couldn't create new class");
    })

    .put(async (req, res) => {

        const classObj = req.body.Class;
        const classUpdated = await mongo.updateDoc("Class", { _id: req.body._id }, classObj);

        res.status(classUpdated ? 200 : 400).json(classUpdated ? "Updated class" : "Couldn't update class");
    })

    .delete(async (req, res) => {
        const classDeleted = await mongo.deleteDoc("Class", { _id: req.body._id });

        res.status(classDeleted ? 200 : 400).json(classDeleted ? "Class deleted" : "Couldn't delete class");
    });

module.exports = router;