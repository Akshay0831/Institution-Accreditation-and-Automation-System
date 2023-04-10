const express = require('express');
const mongo = require("../db/mongodb");
const router = express.Router();

router.route("/")
    .get(async (req, res) => {
        let subjects = await mongo.getDocs("Subject")
        for (subject of subjects)
            subject.Department = await mongo.getDoc("Department", { _id: subject.Department });

        let gotSubjects = subjects.length > 0;

        res.status(gotSubjects ? 200 : 400).json(gotSubjects ? subjects : "Couldn't fetch subjects");
    })


    .post(async (req, res) => {
        const subjectObj = req.body.Subject;
        const subjectAdded = await mongo.addDoc("Subject", subjectObj);

        res.status(subjectAdded ? 200 : 400).json(subjectAdded ? "Created new subject" : "Couldn't create new subject");
    })

    .put(async (req, res) => {

        const subjectObj = req.body.Subject;
        const subjectUpdated = await mongo.updateDoc("Subject", { _id: req.body._id }, subjectObj);

        res.status(subjectUpdated ? 200 : 400).json(subjectUpdated ? "Updated subject" : "Couldn't update subject");
    })

    .delete(async (req, res) => {
        const subjectDeleted = await mongo.deleteDoc("Subject", { _id: req.body._id });

        res.status(subjectDeleted ? 200 : 400).json(subjectDeleted ? "Subject deleted" : "Couldn't delete subject");
    });

module.exports = router;