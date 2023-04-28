const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();
const { ObjectId } = require("mongodb");

router.route("/")
    .get(async (req, res) => {
        let students = await mongo.getDocs("Student");
        students = await Promise.all(students.map(async student => {
            student.Department = await mongo.getDoc("Department", { _id: student.Department });
            return student;
        }));
        let gotStudents = students.length > 0;

        res.status(gotStudents ? 200 : 400).json(gotStudents ? students : "Couldn't fetch students");
    })


    .post(async (req, res) => {
        const session = await mongo.startSession();
    
        try {
          await session.withTransaction(async () => {
            const studentId = (new ObjectId()).toString();
            //Creating a Student document
            const studentObj = { ...models.Student }
            studentObj._id = studentId;
            studentObj["Student Name"] = req.body.Student["Student Name"];
            studentObj.USN = req.body.Student.USN;
            studentObj.Department = req.body.Student.Department;
            const studentAdded = await mongo.addDoc("Student", studentObj, session);
    
            //Creating a Class Allocation document
            const classAllocationObj = { ...models["Class Allocation"] };
            classAllocationObj.Class = req.body.Class._id;
            classAllocationObj.Student = studentId;
            const classAllocationAdded = await mongo.addDoc("Class Allocation", classAllocationObj, session);
    
            let subjects = await mongo.getDocs("Subject", { Department: studentObj.Department }, session);
    
            let marksAdded = true;
    
            for (let subject of subjects) {
                //Creating a Subject document for all subjects
                const marksObj = { ...models.Marks };
                marksObj.Subject = subject._id;
                marksObj.Student = studentId;
                if (!await mongo.addDoc("Marks", { ...marksObj }, session)) {
                    marksAdded = false;
                    break;
                }
            };
    
            if (!studentAdded || !classAllocationAdded || !marksAdded) {
                throw new Error("Transaction rolled back due to failed insert.");
            }
          });
    
          res.status(200).json("Created new Student");
        } catch (error) {
          res.status(400).json(error.message);
        } finally {
          session.endSession();
        }
      })


    .put(async (req, res) => {

        const studentObj = { ...models.Student };
        studentObj._id = req.body.Student._id;
        studentObj.Department = req.body.Student.Department;
        studentObj['Student Name'] = req.body.Student["Student Name"];
        studentObj.USN = req.body.Student.USN;

        let oldStudent = await mongo.getDoc("Student", { _id: studentObj._id });

        const isStudentDepartmentChanged = Object.keys(oldStudent).length == 0;

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
        delete classAllocationObj._id;
        classAllocationObj.Class = req.body.Class._id;
        classAllocationObj.Student = req.body.Student._id;
        const classAllocationUpdated = await mongo.updateDoc("Class Allocation", { _id: classAllocationObj._id }, classAllocationObj);

        const isSuccess = studentUpdated && classAllocationUpdated;

        res.status(isSuccess ? 200 : 400).json({ message: isSuccess ? "Updated Successfully" : "Update Unsuccessful" });
    })


    .delete(async (req, res) => {
        const isStudentDeleted = await mongo.deleteDoc("Student", { _id: req.body._id });
        const isMarksDeleted = await mongo.deleteDoc("Marks", { Student: req.body._id });
        const isAllocationDeleted = await mongo.deleteDoc("Class Allocation", { Student: req.body._id });

        const isDeleteSuccess = isStudentDeleted && isAllocationDeleted && isMarksDeleted;

        res.status(isDeleteSuccess ? 200 : 400).json({ message: isDeleteSuccess ? "Deleted Successfully" : "Delete Unsuccessful" });
    });


router.route("/update")
    .get(async (req, res) => {
        let students = await mongo.getStudents();

        let gotStudents = students.length > 0;

        res.status(gotStudents ? 200 : 400).json(gotStudents ? students : "Couldn't fetch students");
    });


module.exports = router;