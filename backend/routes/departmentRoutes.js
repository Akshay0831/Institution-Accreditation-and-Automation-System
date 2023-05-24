const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();
const { ObjectId } = require("mongodb");

router.route("/")
    .get(async (req, res) => {
        let departments = await mongo.getDocs("Department");

        for (let department of departments)
            department.HoD = await mongo.getDoc("Teacher", { _id: department.HoD });

        let departmentsFetched = departments.length > 0;

        res.status(departmentsFetched ? 200 : 400).json(departmentsFetched ? departments : "Couldn't fetch departments");
    })

    .post(async (req, res) => {
        try {
            const departmentObj = req.body.Department;
            const departmentAdded = await mongo.addDoc("Department", departmentObj);

            res.status(departmentAdded ? 200 : 400).json(departmentAdded ? "Created new department" : "Couldn't create new department");
        } catch (error) {
            res.status(400).json(error.message);
        }
    })

    .put(async (req, res) => {
        try {
            const departmentObj = req.body.Department;
            const departmentUpdated = await mongo.updateDoc("Department", { _id: req.body._id }, departmentObj);

            res.status(departmentUpdated ? 200 : 400).json(departmentUpdated ? "Updated department" : "Couldn't update department");
        } catch (error) {
            res.status(400).json(error.message);
        }
    })

    .delete(async (req, res) => {
        const isDepartmentDeleted = await mongo.deleteDoc("Department", { _id: req.body._id });
        const isClassDeleted = await mongo.deleteDoc("Class", { Department: req.body._id });
        const isStudentDeleted = await mongo.deleteDoc("Student", { Department: req.body._id });
        const isSubjectDeleted = await mongo.deleteDoc("Subject", { Department: req.body._id });
        const isTeacherDeleted = await mongo.deleteDoc("Teacher", { Department: req.body._id });
        const isAllocationDeleted = await mongo.deleteDoc("Teacher Allocation", { Department: req.body._id });

        const isDeleteSuccess = isDepartmentDeleted && isAllocationDeleted && isTeacherDeleted && isClassDeleted && isStudentDeleted && isSubjectDeleted;

        res.status(isDeleteSuccess ? 200 : 400).json({ message: isDeleteSuccess ? "Deleted Successfully" : "Delete Unsuccessful" });
    });


module.exports = router;