const express = require('express');
const mongo = require("../db/mongodb");
const router = express.Router();

router.route("/update")
    .get(async (req, res) => {
        const marks = await mongo.getMarks();
        let gotMarks = marks.length > 0;
        res.status(gotMarks ? 200 : 400).json(gotMarks ? marks : "Couldn't fetch marks");
    })

router.route("/")
    .get(async (req, res) => {
        let marks = await mongo.getDocs("Marks");
        marks = await Promise.all(marks.map(async m => {
            m.Student = await mongo.getDoc("Student", { _id: m.Student });
            m.Subject = await mongo.getDoc("Subject", { _id: m.Subject });
            return m;
        }))

        let gotMarks = marks.length > 0;
        res.status(gotMarks ? 200 : 400).json(gotMarks ? marks : "Couldn't fetch marks");

    })

    .post(async (req, res) => {
        try {
            const marksObj = req.body["Marks"];
            const marksAdded = await mongo.addDoc("Marks", marksObj);

            res.status(marksAdded ? 200 : 400).json(marksAdded ? "Created new marks" : "Couldn't create new marks");
        } catch (error) {
            res.status(400).json(error.message);
        }
    })

    .put(async (req, res) => {
        try {
            const marksUpdated = await mongo.updateDoc("Marks", { _id: req.body.Marks._id }, req.body.Marks);

            res.status(marksUpdated ? 200 : 400).json(marksUpdated ? "Updated marks" : "Couldn't update marks");
        } catch (error) {
            res.status(400).json(error.message);
        }
    })

    .delete(async (req, res) => {
        const marksDeleted = await mongo.deleteDoc("Marks", { _id: req.body._id });

        res.status(marksDeleted ? 200 : 400).json(marksDeleted ? "Marks deleted" : "Couldn't delete Marks");
    });

module.exports = router;