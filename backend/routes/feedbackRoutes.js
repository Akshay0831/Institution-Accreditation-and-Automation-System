const express = require('express');
const mongo = require("../db/mongodb");
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const models = require('../models');
const getIndirectAttainmentValues = require('../feedbackProcess');

const excelFormat = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/');
    },
    filename: function (req, file, cb) {
        if (excelFormat === file.mimetype)
            cb(null, "feedback.xlsx");
        else
            cb(new Error("Invalid format"), "");
    }
});

// Initialize Multer upload middleware
const upload = multer({ storage: storage });

router.route("/")
    .get(async (req, res) => {
        let feedbacks = await mongo.getDocs("Feedback");
        feedbacks = await Promise.all(feedbacks.map(async (feedback) => {
            feedback.Subject = await mongo.getDoc("Subject", { _id: feedback.Subject });
            return feedback;
        }));

        let gotFeedbacks = feedbacks.length > 0;
        res.status(gotFeedbacks ? 200 : 400).json(gotFeedbacks ? feedbacks : null);
    })


router.route("/:Subject")
    .get(async (req, res) => {
        let feedback = await mongo.getDoc("Feedback", { Subject: req.params.Subject });
        feedback.Subject = await mongo.getDoc("Subject", { _id: feedback.Subject });

        let gotFeedback = Object.keys(feedback).length > 0;
        res.status(gotFeedback ? 200 : 400).json(gotFeedback ? feedback : null);
    })

    .post(upload.single('file'), async (req, res) => {
        let file = req.file;
        const indirectAttainmentValues = getIndirectAttainmentValues(file.filename);
        setTimeout(async () => {
            fs.unlink("./public/feedback.xlsx", error => {
                if (error) {
                    console.error(error);
                    res.status(400).json({ error: "Unable to process" })
                }
            });
            const feedback = { ...models.Feedback };
            feedback.Subject = req.params.Subject;
            feedback.values = indirectAttainmentValues;
            const success = await mongo.addDoc("Feedback", feedback);
            res.status(success ? 200 : 400).json(success ? feedback : null);
        }, 1000);
    })

module.exports = router;