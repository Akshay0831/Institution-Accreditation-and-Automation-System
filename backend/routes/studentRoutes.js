const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();
const { ObjectId } = require("mongodb");

router.route("/")
    .get(async (req, res) => {
        let students = await mongo.getStudents();
        students = students.map(async student => {
            student.Department = await mongo.getDoc("Department", { _id: student.Department });
            return student;
        });
        let studentsFetched = students.length > 0;

        res.status(studentsFetched ? 200 : 400).json(studentsFetched ? students : "Couldn't fetch students");
    })


    .post(async (req, res) => {
        const studentId = (new ObjectId()).toString();
        //Creating a Student document
        const studentObj = { ...models.Student }
        studentObj._id = studentId;
        studentObj["Student Name"] = req.body.Student["Student Name"];
        studentObj.USN = req.body.Student.USN;
        studentObj.Department = req.body.Department._id;
        const studentAdded = await mongo.addDoc("Student", studentObj);

        //Creating a Class Allocation document
        const classAllocationObj = { ...models["Class Allocation"] };
        classAllocationObj.Class = req.body.Class._id;
        classAllocationObj.Student = studentId;
        const classAllocationAdded = await mongo.addDoc("Class Allocation", classAllocationObj);

        let subjects = await mongo.getDocs("Subject", { Department: studentObj.Department });

        let marksAdded;

        subjects.forEach(async (subject) => {
            //Creating a Subject document for all subjects
            const marksObj = { ...models.Marks };
            marksObj.Subject = subject._id;
            marksObj.Student = studentId;
            marksAdded = await mongo.addDoc("Marks", { ...marksObj });
        });

        const isCreated = studentAdded && classAllocationAdded && marksAdded;

        res.status(isCreated ? 201 : 400).json(isCreated ? "Created new Student" : "Couldn't create new student");
    })


    .put(async (req, res) => {

        const studentObj = { ...models.Student };
        studentObj._id = req.body.Student._id;
        studentObj.Department = req.body.Department._id;
        studentObj['Student Name'] = req.body.Student["Student Name"];
        studentObj.USN = req.body.Student.USN;

        let oldStudent = await mongo.getDoc("Student", { _id: studentObj._id, Department: studentObj.Department });

        const isStudentDepartmentChanged = Object.keys(oldStudent).length == 0;

        let marksAdded;
        if (isStudentDepartmentChanged) {
            // Adding marks document to subjects in new department
            let subjects = await mongo.getDocs("Subject", { Department: studentObj.Department });
            subjects.forEach(async (subject) => {
                //Creating a Subject document for all subjects
                const marksObj = { ...models.Marks };
                marksObj.Subject = subject._id;
                marksObj.Student = studentObj._id;
                marksAdded = await mongo.addDoc("Marks", { ...marksObj });
            });

            // Deleting marks documents in old department
            let oldStudentDepartment = (await mongo.getDoc("Student", { _id: studentObj._id })).Department;
            let oldDepartmentSubjects = await mongo.getDocs("Subject", { Department: oldStudentDepartment });
            oldDepartmentSubjects.forEach(async (subject) => {
                await mongo.deleteDoc("Marks", { Student: studentObj._id, Subject: subject._id })
            });


        }

        const studentUpdated = await mongo.updateDoc("Student", { _id: studentObj._id }, studentObj);

        const classAllocationObj = { ...models['Class Allocation'] };
        classAllocationObj.Class = req.body.Class._id;
        classAllocationObj.Student = req.body.Student._id;
        const classAllocationUpdated = await mongo.updateDoc("Class Allocation", { _id: classAllocationObj._id }, classAllocationObj);

        const isSuccess = studentUpdated && classAllocationUpdated;

        res.status(isSuccess ? 200 : 400).json({ message: isSuccess ? "Updated Successfully" : "Update Unsuccessful" });
    })


    .delete(async (req, res) => {
        const isStudentDeleted = await mongo.deleteDoc("Student", { _id: req.body.Student._id });
        const isMarksDeleted = await mongo.deleteDoc("Marks", { Student: req.body.Student._id });
        const isAllocationDeleted = await mongo.deleteDoc("Class Allocation", { Student: req.body.Student._id });

        const isDeleteSuccess = isStudentDeleted && isAllocationDeleted && isMarksDeleted;

        res.status(isDeleteSuccess ? 200 : 400).json({ message: isDeleteSuccess ? "Deleted Successfully" : "Delete Unsuccessful" });
    });

module.exports = router;