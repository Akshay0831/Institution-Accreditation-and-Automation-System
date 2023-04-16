const express = require('express');
const mongo = require("../db/mongodb");
const router = express.Router();

router.route("/:Subject")
    .get(async (req, res) => {
        let searchQuery = { Subject: req.params.Subject };
        let marks = await mongo.getDocs("Marks", searchQuery);
        marks = marks.filter(marks => marks.Subject === req.params.Subject)

        marks = await Promise.all(marks.map(async m => {
            m.Student = await mongo.getDoc("Student", { _id: m.Student });
            m.Student = { ...m.Student, Department: await mongo.getDoc("Department", { _id: m.Student.Department }) }
            m.Subject = await mongo.getDoc("Subject", { _id: m.Subject });
            return m;
        }));

        let COs = ['CO1', 'CO2', 'CO3', 'CO4', 'CO5'];
        let POs = ['PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12', 'PSO1', 'PSO2'];
        let coPoMappings = await mongo.getDocs("CO PO Map", searchQuery);
        let formatedCOPOMappings = {};
        POs.forEach(po => {
            formatedCOPOMappings[po] = {}
            COs.forEach(co => {
                let value = coPoMappings.filter(copo => copo.PO === po && copo.CO == co)[0]?.Value
                formatedCOPOMappings[po][co] = Number(value != null ? value : 0);
            });
        });

        let gotMarks = marks.length > 0;
        res.status(gotMarks ? 200 : 400)
            .json(gotMarks ? {
                Marks: marks,
                IndirectAttainmentValues: await mongo.getDoc("Feedback", searchQuery),
                COPOMappings: formatedCOPOMappings
            } : "Couldn't fetch data");
    })

module.exports = router;