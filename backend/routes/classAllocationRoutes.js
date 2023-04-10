const express = require('express');
const mongo = require("../db/mongodb");
const router = express.Router();

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

    .post(async (req, res) => {
        const classAllocObj = req.body["Class Allocation"];
        const classAllocAdded = await mongo.addDoc("Class Allocation", classAllocObj);

        res.status(classAllocAdded ? 200 : 400).json(classAllocAdded ? "Created new class allocation" : "Couldn't create new class allocation");
    })

    .put(async (req, res) => {

        const classAllocObj = req.body["Class Allocation"];
        const classAllocUpdated = await mongo.updateDoc("Class Allocation", { _id: req.body._id }, classAllocObj);

        res.status(classAllocUpdated ? 200 : 400).json(classAllocUpdated ? "Updated Class Allocation" : "Couldn't update Class Allocation");
    })

    .delete(async (req, res) => {
        const classAllocDeleted = await mongo.deleteDoc("Class Allocation", { _id: req.body._id });

        res.status(classAllocDeleted ? 200 : 400).json(classAllocDeleted ? "Class Allocation deleted" : "Couldn't delete Class Allocation");
    });

module.exports = router;