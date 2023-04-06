const express = require('express');
const mongo = require("../db/mongodb");
const models = require("../models");
const router = express.Router();
const { ObjectId } = require("mongodb");

router.route("/")
    .get(async (req, res) => {
        let coPoMaps = await mongo.getDocs("CO PO Map");
        coPoMaps = coPoMaps.map(async copo => {
            copo.Subject = await mongo.getDoc("Subject", { _id: copo.Subject });
            return copo;
        });
        let fetchedCoPOMaps = coPoMaps.length > 0;

        res.status(fetchedCoPOMaps ? 200 : 400).json(fetchedCoPOMaps ? coPoMaps : "Couldn't fetch CO PO Mappings");
    })

module.exports = router;