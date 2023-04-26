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

        const isSubjectDeleted = await mongo.deleteDoc("Subject", { _id: req.body._id });
        const isCOPOMapDeleted = await mongo.deleteDoc("CO PO Map", { Subject: req.body._id });
        const isFeedbackDeleted = await mongo.deleteDoc("Feedback", { Subject: req.body._id });
        const isMarksDeleted = await mongo.deleteDoc("Marks", { Subject: req.body._id });
        const isAllocationDeleted = await mongo.deleteDoc("Teacher Allocation", { Subject: req.body._id });

        const isDeleteSuccess = isAllocationDeleted && isMarksDeleted && isCOPOMapDeleted && isFeedbackDeleted && isSubjectDeleted;

        res.status(isDeleteSuccess ? 200 : 400).json({ message: isDeleteSuccess ? "Deleted Successfully" : "Delete Unsuccessful" });
    });

router.route("/:id")
    .get(async (req, res) => {
        let subject = await mongo.getDoc("Subject", { _id: req.params.id });
        if (subject && Object.keys(subject).length > 0) {
            subject.Department = await mongo.getDoc("Department", { _id: subject.Department });
            res.status(200).json(subject);
        } else {
            res.status(400).json("Couldn't fetch subject");
        }
    })

module.exports = router;