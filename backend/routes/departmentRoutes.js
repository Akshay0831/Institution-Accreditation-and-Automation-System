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
        const departmentObj = req.body.Department;
        const departmentAdded = await mongo.addDoc("Department", departmentObj);

        res.status(departmentAdded ? 200 : 400).json(departmentAdded ? "Created new department" : "Couldn't create new department");
    })

    .put(async (req, res) => {

        const departmentObj = req.body.Department;
        const departmentUpdated = await mongo.updateDoc("Department", { _id: req.body._id }, departmentObj);

        res.status(departmentUpdated ? 200 : 400).json(departmentUpdated ? "Updated department" : "Couldn't update department");
    })

    .delete(async (req, res) => {
        const departmentDeleted = await mongo.deleteDoc("Department", { _id: req.body._id });

        res.status(departmentDeleted ? 200 : 400).json(departmentDeleted ? "Department deleted" : "Couldn't delete department");
    });


module.exports = router;