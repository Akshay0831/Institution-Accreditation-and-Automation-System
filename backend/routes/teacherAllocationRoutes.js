const express = require('express');
const mongo = require("../db/mongodb");
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
        res.status(gotResult ? 200 : 400).json(gotResult ? teacherAllocations : "Couldn't get teacher allocations");
    })

    .post(async (req, res) => {
        try {
            const teacherAllocObj = req.body["Teacher Allocation"];
            const teacherAllocAdded = await mongo.addDoc("Teacher Allocation", teacherAllocObj);

            res.status(teacherAllocAdded ? 200 : 400).json(teacherAllocAdded ? "Created new teacher allocation" : "Couldn't create new teacher allocation");
        } catch (error) {
            res.status(400).json(error.message);
        }
    })

    .put(async (req, res) => {
        try {
            const teacherAllocObj = req.body["Teacher Allocation"];
            const teacherAllocUpdated = await mongo.updateDoc("Teacher Allocation", { _id: req.body._id }, teacherAllocObj);

            res.status(teacherAllocUpdated ? 200 : 400).json(teacherAllocUpdated ? "Updated Teacher Allocation" : "Couldn't update Teacher Allocation");
        } catch (error) {
            res.status(400).json(error.message);
        }
    })

    .delete(async (req, res) => {
        try {
            const teacherAllocDeleted = await mongo.deleteDoc("Teacher Allocation", { _id: req.body._id });

            res.status(teacherAllocDeleted ? 200 : 400).json(teacherAllocDeleted ? "Teacher Allocation deleted" : "Couldn't delete Teacher Allocation");
        } catch (error) {
            res.status(400).json(error.message);
        }
    });


module.exports = router;