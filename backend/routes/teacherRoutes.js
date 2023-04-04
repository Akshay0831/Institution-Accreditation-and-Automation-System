const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();

let getTeacherObj = req => {
    const teacherObj = { ...models.Teacher };
    teacherObj.fk_Department = req.body.department;
    teacherObj.Mail = req.body.mail;
    teacherObj.Role = req.body.role;
    teacherObj["Teacher Name"] = req.body.name;
}

router.route("/")
    .get(async (req, res) => {
        let teachers = mongo.getDocs("Teacher");
        res.status(teachers ? 200 : 400).json(teachers ? teachers : "Couldn't fetch teachers");
    })


    .post(async (req, res) => {
        const teacherObj = getTeacherObj(req);
        const teacherAdded = await mongo.addDoc("Teacher", teacherObj);

        res.status(teacherAdded ? 201 : 400).json(teacherAdded ? "Created new teacher" : "Couldn't create new teacher");
    })

    .put(async (req, res) => {
        const teacherObj = getTeacherObj(req);
        const teacherUpdated = await mongo.updateDoc("Teacher", { _id: req.body._id }, teacherObj);

        res.status(teacherUpdated ? 200 : 400).json(teacherUpdated ? "Updated teacher" : "Couldn't update teacher");
    })

    .delete(async (req, res) => {
        const teacherDeleted = await mongo.deleteDoc("Teacher", { _id: req.body._id });

        res.status(teacherDeleted ? "200" : "400").json(teacherDeleted ? "Teacher deleted" : "Couldn't delete teacher");
    });

module.exports = router;