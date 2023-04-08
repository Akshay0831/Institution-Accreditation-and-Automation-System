const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();
const { ObjectId } = require("mongodb");

router.route("/")
    .get(async (req, res) => {
        let coPoMaps = await mongo.getDocs("CO PO Map");
        for (let copo of coPoMaps)
            copo.Subject = await mongo.getDoc("Subject", { _id: copo.Subject });
        let fetchedCoPOMaps = coPoMaps.length > 0;

        res.status(fetchedCoPOMaps ? 200 : 400).json(fetchedCoPOMaps ? coPoMaps : "Couldn't fetch CO PO Mappings");
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

module.exports = router;