const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();

router.route("/")
    .get(async (req, res) => {
        let data = await mongo.getStudents();
        res.status()
        res.status(200).json({ students: data });
    })


    .post(async (req, res) => {
        //Creating a Student document
        const studentObj = { ...models.Student }
        studentObj["Student Name"] = req.body["Student Name"];
        studentObj.USN = req.body.USN;
        studentObj["fk_Department"] = req.body["fk_Department"];
        await mongo.addDoc("Student", studentObj);

        //Creating a Class Allocation document
        const classAllocationObj = { ...models["Class Allocation"] };
        classAllocationObj["fk_Class ID"] = req.body["Class ID"];
        classAllocationObj.fk_USN = req.body.USN;
        await mongo.addDoc("Class Allocation", classAllocationObj);

        let subjects = await mongo.getDocs("Subject");
        subjects = subjects.filter(subject => subject["fk_Department"] === studentObj["fk_Department"]);

        subjects.forEach(async (subject) => {
            //Creating a Subject document for all subjects
            const marksObj = { ...models.Marks };
            marksObj["fk_Subject Code"] = subject["Subject Code"];
            marksObj.fk_USN = studentObj.USN;
            await mongo.addDoc("Marks", { ...marksObj });
        });

        res.status(201).json("Created new Student");
    })


    .put(async (req, res) => {

        const studentObj = {
            "fk_Department": req.body["fk_Department"],
            "Student Name": req.body["Student Name"],
            USN: req.body["USN"]
        };
        const classAllocationObj = {
            "fk_Class ID": req.body["Class ID"],
            "fk_USN": req.body["USN"]
        };

        const studentUpdated = await mongo.updateDoc("Student", { USN: req.body["USN"] }, studentObj);
        const classAllocationUpdated = await mongo.updateDoc("Class Allocation", { fk_USN: req.body["USN"] }, classAllocationObj);

        const isSuccess = studentUpdated && classAllocationUpdated;

        res.status(isSuccess ? 200 : 400).json({ message: isSuccess ? "Updated Successfully" : "Update Unsuccessful" });
    })


    .delete(async (req, res) => {
        const isStudentDeleted = await mongo.deleteDoc("Student", { USN: req.body["USN"] });
        const isMarksDeleted = await mongo.deleteDoc("Marks", { fk_USN: req.body["USN"] });
        const isAllocationDeleted = await mongo.deleteDoc("Class Allocation", { fk_USN: req.body["USN"] });

        const isDeleteSuccess = isStudentDeleted && isAllocationDeleted && isMarksDeleted;

        res.status(isDeleteSuccess ? 200 : 400).json({ message: isDeleteSuccess ? "Deleted Successfully" : "Delete Unsuccessful" });
    });

module.exports = router;