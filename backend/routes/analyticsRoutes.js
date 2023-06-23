const express = require('express');
const mongo = require("../db/mongodb");
const tf = require('@tensorflow/tfjs-node');
const predict = require("../predict_SEE_marks")
const router = express.Router();


router.get("/", async (req, res) => {
    const departments = await mongo.getDocs("Department");
    const subjects = await mongo.getDocs("Subject");
    const students = await mongo.getDocs("Student");

    const gotResults = (departments && departments.length > 0) &&
        (subjects && subjects.length > 0) &&
        (students && students.length > 0);

    res.status(gotResults ? 200 : 400).json(gotResults ? { departments, subjects, students } : "Couldn't fetch data");
})

router.get("/predict_SEE_marks", async (req, res) => {
    const { Subject, Student } = req.query;
    let StudentDoc = await mongo.getDoc("Student", { _id: Student });
    let Marks = await mongo.getDoc("Marks", { Student: Student, Subject: Subject });
    let avgIAMarks = 0;
    if (Marks) {
        Object.keys(Marks["Marks Gained"]).forEach(ia => {
            if (ia !== "SEE") {
                Object.keys(Marks["Marks Gained"][ia]).forEach(co => avgIAMarks += Marks["Marks Gained"][ia][co]);
            }
        });
        avgIAMarks /= Object.keys(Marks["Marks Gained"])
            .filter(value => value.startsWith('IA')).length;
        let prediction = await predict(avgIAMarks);
        res.json({ Student:StudentDoc, Marks, Predicted_SEE: Math.round(prediction) });
    }
})

// Route for SEE Prediction
router.get('/predict/:Subject/:Student', async (req, res) => {
    // SEE Prediction Model: Update with a newer model and update the route
    const model = await tf.loadLayersModel('file://./model_js/model.json');

    let Marks = (await mongo.getDoc("Marks", { Student: req.params.Student, Subject: req.params.Subject }))["Marks Gained"];
    let maxMarks = (await mongo.getDoc("Subject", { _id: req.params.Subject }))[req.query.batch]["Max Marks"];
    // Prediction Inputs Internal Marks, Assignment Marks and CIE Percentages
    let internals = [];
    let assignments = [];
    let CIE = [0];
    for (let ia in Marks) {
        if (ia.startsWith('IA'))
            for (let co in Marks[ia])
                internals.push(Marks[ia][co] / maxMarks[ia][co] * 100);
        else if (ia.startsWith('A'))
            for (let co in Marks[ia])
                assignments.push(Marks[ia][co] / maxMarks[ia][co] * 100);
    }
    if (Marks.CIE)
        CIE = [Marks.CIE];
    console.log(model.inputShape);

    // Reshape and convert input data to tensors
    const internalsTensor = tf.tensor2d(internals, [1, 7]);
    const assignmentsTensor = tf.tensor2d(assignments, [1, 7]);
    const CIETensor = tf.tensor2d(CIE, [1, 1]);

    // Perform the prediction
    const inputs = [internalsTensor, assignmentsTensor, CIETensor];
    const predictions = model.predict(inputs);
    let output = predictions.arraySync()[0];

    // if (maxMarks.SEE) output *= maxMarks.SEE / 100;

    res.json({ prediction: output });
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

module.exports = router;