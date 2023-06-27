const express = require('express');
const mongo = require("../db/mongodb");
const router = express.Router();
const coCalculation = require("../coCalculation");
const gapAnalysis = require("../gapAnalysis");

function getCOsFromMaxMarks(maxMarks) {
    let cos = []
    for (let ia in maxMarks)
        if (typeof maxMarks[ia] == "object")
            for (let co in maxMarks[ia])
                if (!cos.includes(co))
                    cos.push(co);
    return cos;
}

router.route('/gapAnalysis')
    .post(async (req, res) => {
        try {
            const deptId = req.body.department;
            const batch = req.body.batch.toString();
            let subjects = await mongo.getDocs("Subject", { ["Max Marks." + batch]: { $exists: true }, "Department": deptId });

            let coCalculationOutputs = await Promise.all(subjects.map(async (subject) => {
                let marks = await mongo.getDocs("Marks", { "Subject": subject._id });

                marks = await Promise.all(marks.map(async m => {
                    m.Student = await mongo.getDoc("Student", { _id: m.Student });
                    if (m.Student != null) {
                        m.Student = { ...m.Student, Department: await mongo.getDoc("Department", { _id: m.Student.Department }) }
                        m.Subject = await mongo.getDoc("Subject", { _id: m.Subject });
                        return m;
                    }
                }));

                const COs = getCOsFromMaxMarks(subject["Max Marks"][batch]);
                const POs = ['PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12', 'PSO1', 'PSO2'];
                let coPoMappings = await mongo.getDocs("CO PO Map", { "Subject": subject._id });
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
                    return coCalculation({
                        ...{
                            Marks: marks,
                            IndirectAttainmentValues: await mongo.getDoc("Feedback", { "Subject": subject._id }),
                            COPOMappings: formatedCOPOMappings,
                            generateReport: false,
                        }, ...req.body
                    });
                }
            }));

            coCalculationOutputs = coCalculationOutputs.filter(output => Boolean(output));
            gapAnalysisResults = await gapAnalysis(coCalculationOutputs, req.body.A, req.body.T);

            console.log(gapAnalysisResults);
            res.status(200).send(gapAnalysisResults);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

router.route("/:Subject")
    .post(async (req, res) => {
        let searchQuery = { Subject: req.params.Subject };
        // Optional parameters as an object
        let options = req.body;

        let marks = await mongo.getDocs("Marks", searchQuery);
        let subject = await mongo.getDoc("Subject", { _id: req.params.Subject });

        marks = await Promise.all(marks.map(async m => {
            m.Student = await mongo.getDoc("Student", { _id: m.Student });
            if (m.Student != null) {
                m.Student = { ...m.Student, Department: await mongo.getDoc("Department", { _id: m.Student.Department }) }
                m.Subject = subject;
                return m;
            }
        }));

        const COs = getCOsFromMaxMarks(subject["Max Marks"][req.body.batch]);
        const POs = ['PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12', 'PSO1', 'PSO2'];
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
            let excelFileBuffer = await coCalculation({
                ...{
                    Marks: marks,
                    IndirectAttainmentValues: await mongo.getDoc("Feedback", searchQuery),
                    COPOMappings: formatedCOPOMappings,
                    generateReport: true,
                }, ...options
            });
            res.send(excelFileBuffer);
        }
    });


module.exports = router;