const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();

router.route("/")
    .get(async (req, res) => {
        let teachers = await mongo.getDocs("Teacher");
        teachers = await Promise.all(teachers.map(async (teacherObj) => {
            teacherObj.Department = await mongo.getDoc("Department", { _id: teacherObj.Department });
            return teacherObj;
        }));
        let gotTeachers = teachers.length > 0;
        res.status(gotTeachers ? 200 : 400).json(gotTeachers ? teachers : "Couldn't fetch teachers");
    })


    .post(async (req, res) => {
        const teacherObj = req.body.Teacher;
        const teacherAdded = await mongo.addDoc("Teacher", teacherObj);

        res.status(teacherAdded ? 200 : 400).json(teacherAdded ? "Created new teacher" : "Couldn't create new teacher");
    })

    .put(async (req, res) => {

        const teacherObj = req.body.Teacher;
        const teacherUpdated = await mongo.updateDoc("Teacher", { _id: req.body._id }, teacherObj);

        res.status(teacherUpdated ? 200 : 400).json(teacherUpdated ? "Updated teacher" : "Couldn't update teacher");
    })

    .delete(async (req, res) => {
        const teacherDeleted = await mongo.deleteDoc("Teacher", { _id: req.body._id });

        res.status(teacherDeleted ? "200" : "400").json(teacherDeleted ? "Teacher deleted" : "Couldn't delete teacher");
    });

module.exports = router;