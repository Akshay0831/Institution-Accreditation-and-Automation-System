const express = require('express');
const mongo = require("../db/mongodb");
const router = express.Router();
const coCalculation = require("../coCalculation");

router.route("/:Subject")
    .post(async (req, res) => {
        let searchQuery = { Subject: req.params.Subject };
        // Optional parameters as an object
        let options = req.body; // options = {"targetValues":[50,55,60],}
        console.log(req.params.Subject, JSON.stringify(options));

        let marks = await mongo.getDocs("Marks", searchQuery);
        marks = marks.filter(marks => marks.Subject === req.params.Subject)

        marks = await Promise.all(marks.map(async m => {
            m.Student = await mongo.getDoc("Student", { _id: m.Student });
            if (m.Student != null) {
                m.Student = { ...m.Student, Department: await mongo.getDoc("Department", { _id: m.Student.Department }) }
                m.Subject = await mongo.getDoc("Subject", { _id: m.Subject });
                return m;
            }
        }));

        // Simple function to get COs dynamically from Max Marks
        function getCOsFromMaxMarks(maxMarks) {
            let cos = []
            for (let ia in maxMarks)
                if (typeof maxMarks[ia] == "object")
                    for (let co in maxMarks[ia])
                        if (!cos.includes(co))
                            cos.push(co);
            return cos;
        }

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

        let gotMarks = marks.length > 0 && Object.keys(formatedCOPOMappings).length > 0;
        if (gotMarks) {
            let file = await coCalculation({
                Marks: marks,
                IndirectAttainmentValues: await mongo.getDoc("Feedback", searchQuery),
                COPOMappings: formatedCOPOMappings
            });
            res.status(file.length > 0 ? 200 : 400).send(file.length > 0 ? file : "couldnt process");
        }
    })

module.exports = router;