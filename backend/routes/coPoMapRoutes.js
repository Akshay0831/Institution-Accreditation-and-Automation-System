const express = require('express');
const mongo = require("../db/mongodb");
const router = express.Router();

router.route("/")
    .get(async (req, res) => {
        let coPoMaps = await mongo.getDocs("CO PO Map");
        for (let copo of coPoMaps)
            copo.Subject = await mongo.getDoc("Subject", { _id: copo.Subject });
        let fetchedCoPOMaps = coPoMaps.length > 0;

        res.status(fetchedCoPOMaps ? 200 : 400).json(fetchedCoPOMaps ? coPoMaps : "Couldn't fetch CO PO Mappings");
    })

    .post(async (req, res) => {
        try {
            const copoMapObj = req.body["CO PO Map"];
            const copoMapAdded = await mongo.addDoc("CO PO Map", copoMapObj);

            res.status(copoMapAdded ? 200 : 400).json(copoMapAdded ? "Created new class allocation" : "Couldn't create new class allocation");
        } catch (error) {
            res.status(400).json(error.message);
        }
    })

    .put(async (req, res) => {
        try {
            const copoMapObj = req.body["CO PO Map"];
            const copoMapUpdated = await mongo.updateDoc("CO PO Map", { _id: req.body._id }, copoMapObj);

            res.status(copoMapUpdated ? 200 : 400).json(copoMapUpdated ? "Updated CO PO Map" : "Couldn't update CO PO Map");
        } catch (error) {
            res.status(400).json(error.message);
        }
    })

    .delete(async (req, res) => {
        const copoMapDeleted = await mongo.deleteDoc("CO PO Map", { _id: req.body._id });

        res.status(copoMapDeleted ? 200 : 400).json(copoMapDeleted ? "CO PO Map deleted" : "Couldn't delete CO PO Map");
    });

router.route("/:Subject")
    .get(async (req, res) => {
        let docs = await mongo.getDocs("CO PO Map");
        let COPOs = { 'PO1': {}, 'PO2': {}, 'PO3': {}, 'PO4': {}, 'PO5': {}, 'PO6': {}, 'PO7': {}, 'PO8': {}, 'PO9': {}, 'PO10': {}, 'PO11': {}, 'PO12': {}, 'PSO1': {}, 'PSO2': {} };
        for (let doc of docs)
            if (req.params.Subject == doc.Subject)
                COPOs[doc['PO']][doc['CO']] = doc['Value'];
        for (let PO in COPOs)
            if (Object.keys(COPOs[PO]).length === 0)
                delete COPOs[PO];
        res.json(COPOs);
    });

router.route("/table/:subjectSelected")
    .post((req, res) => {
        let body = Object(req.body);
        let subjectSelected = req.params["subjectSelected"]
        let updates = [];
        for (let CO in body)
            for (let PO in body[CO])
                if (body[CO][PO])
                    updates.push({ "Subject": subjectSelected, "CO": CO, "PO": PO, "Value": body[CO][PO] });
        mongo.deleteThenInsert("CO PO Map", { Subject: subjectSelected }, updates)
            .then(() => res.status(200).send("Updated Mapping!"))
            .catch(err => res.status(500).send(err));
    });

module.exports = router;