const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const predict = require("../predict_SEE_marks")
const router = express.Router();


router.get("/", async (req, res) => {
    const departments = await mongo.getDocs("Department");
    const subjects = await mongo.getDocs("Subject");
    const students = await mongo.getDocs("Student");

    res.status(200).json({ departments, subjects, students });
})

router.get("/:Subject", async (req, res) => {
    let subject = await mongo.getDoc("Subject", { _id: req.params.Subject });
    subject.Department = await mongo.getDoc("Department", { _id: subject.Department });
    let marks = await mongo.getDocs("Marks", { Subject: req.params.Subject });
    marks = marks.filter(marks => marks.Subject === req.params.Subject)

    marks = await Promise.all(marks.map(async m => {
        m.Student = await mongo.getDoc("Student", { _id: m.Student });
        return m;
    }));

    let gotMarks = marks.length > 0;
    res.status(gotMarks ? 200 : 400).send(gotMarks ? { Marks: marks, Subject: subject } : "Couldn't fetch marks");
});

router.get("/predict_SEE_marks/:Student", async (req, res) => {
    let Student = await mongo.getDoc("Student", { _id: req.params.Student });
    let Marks = await mongo.getDoc("Marks", { Student: req.params.Student });
    let avgIAMarks = 0;
    if (Marks) {
        Object.keys(Marks["Marks Gained"]).forEach(ia => {
            if (ia !== "SEE") {
                Object.keys(Marks["Marks Gained"][ia]).forEach(co => avgIAMarks += Marks["Marks Gained"][ia][co]);
            }
        })
        avgIAMarks /= 3;
        let prediction = await predict(avgIAMarks);
        res.json({ Student, Marks, Predicted_SEE: Math.round(prediction) });
    }
})

module.exports = router;