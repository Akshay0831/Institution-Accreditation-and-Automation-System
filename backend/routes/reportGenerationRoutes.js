const express = require('express');
const mongo = require("../db/mongodb");
const router = express.Router();

router.route("/:Subject")
    .get(async (req, res) => {
        let marks = await mongo.getDocs("Marks", { Subject: req.params.Subject });
        marks = marks.filter(marks => marks.Subject === req.params.Subject)

        marks = await Promise.all(marks.map(async m => {
            m.Student = await mongo.getDoc("Student", { _id: m.Student });
            m.Student = { ...m.Student, Department: await mongo.getDoc("Department", { _id: m.Student.Department }) }
            m.Subject = await mongo.getDoc("Subject", { _id: m.Subject });
            return m;
        }))
        let gotMarks = marks.length > 0;
        res.status(gotMarks ? 200 : 400).json(gotMarks ? { Marks: marks, IndirectAttainmentValues: await mongo.getDoc("Feedback", { Subject: req.params.Subject }) } : "Couldn't fetch data");
    })

module.exports = router;