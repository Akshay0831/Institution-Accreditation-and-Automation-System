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
        try {
            const classObj = req.body.Class;
            const classAdded = await mongo.addDoc("Class", classObj);

            res.status(classAdded ? 200 : 400).json(classAdded ? "Created new class" : "Couldn't create new class");
        } catch (error) {
            res.status(400).json(error.message);
        }
    })

    .put(async (req, res) => {
        try {
            const classObj = req.body.Class;
            const classUpdated = await mongo.updateDoc("Class", { _id: req.body._id }, classObj);

            res.status(classUpdated ? 200 : 400).json(classUpdated ? "Updated class" : "Couldn't update class");
        } catch (error) {
            res.status(400).json(error.message);
        }
    })

    .delete(async (req, res) => {
        const isClassDeleted = await mongo.deleteDoc("Class", { _id: req.body._id });
        const isCAllocationDeleted = await mongo.deleteDoc("Class Allocation", { Class: req.body._id });
        const isTAllocationDeleted = await mongo.deleteDoc("Teacher Allocation", { Class: req.body._id });

        const isDeleteSuccess = isCAllocationDeleted && isTAllocationDeleted && isClassDeleted;

        res.status(isDeleteSuccess ? 200 : 400).json({ message: isDeleteSuccess ? "Deleted Successfully" : "Delete Unsuccessful" });
    });

module.exports = router;