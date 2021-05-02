const FACILITIES_DATA = require('../models/facilities-data');
const FACILITIES = require('../models/facilities');
const VACCINES = require('../models/vaccines');
const APP_SETTINGS = require('../models/app-settings');
const mongoose = require("mongoose");
const moment = require('moment');

const create = async (req, res) => {
    if (!req.body || !req.body.date.trim() || !req.body.isFunctional.toString() || !req.body.facility.trim() || !req.body.vaccines.trim()) {
        return res.status(400).send({
            message: 'Bad request.'
        });
    }
    
    try {
        const facility = await FACILITIES.find({
            'NAME': req.body.facility
        }).collation({locale: 'en', strength: 2});
        let vaccinesArr = [];
        if (req.body.vaccines.includes(",")) {
            vaccinesArr = req.body.vaccines.trim().split(",").map(vaccine => vaccine.trim());
        }
        else {
            vaccinesArr = [req.body.vaccines.trim()];
        }
        const vaccines = await VACCINES.find({
            'NAME': {
                $in: vaccinesArr
            }
        }).collation({locale: 'en', strength: 2});
        const date = moment(req.body.date.trim(), "DD/MM/YYYY");
        const NEW_FACILITIES_DATA_REC = new FACILITIES_DATA({
            DATE: date,
            IS_FUNCTIONAL: req.body.isFunctional,
            REMARKS: req.body.remarks ? req.body.remarks.trim() : null,
            FACILITY: facility[0]._id,
            VACCINES: vaccines.map(vaccine => vaccine._id)
        });
        await NEW_FACILITIES_DATA_REC.save();
        await APP_SETTINGS.updateOne({
            KEY: "LAST_REFRESHED"
        }, {
            VALUE: new Date()
        });
        res.status(201).send(NEW_FACILITIES_DATA_REC);
    } catch (e) {
        res.status(500).send(e);
    }
}

const bulkInsert = async (req, res) => {
    if (!req.body || req.body.length === 0) {
        return res.status(400).send({
            message: 'Bad request.'
        });
    }
    const FACILITIES_DATA_RECS = [];
    for (let i=0; i<req.body.length; i++) {
        if (!req.body[i].date.trim() || !req.body[i].isFunctional.toString() || !req.body[i].facility.trim() || !req.body[i].vaccines.trim()) {
            return res.status(400).send({
                message: 'Bad request.'
            });
        }
        const facility = await FACILITIES.find({
            'NAME': req.body[i].facility.trim()
        }).collation({locale: 'en', strength: 2});
        let vaccinesArr = [];
        if (req.body[i].vaccines.includes(",")) {
            vaccinesArr = req.body[i].vaccines.trim().split(",").map(vaccine => vaccine.trim());
        }
        else {
            vaccinesArr = [req.body[i].vaccines.trim()];
        }
        const vaccines = await VACCINES.find({
            'NAME': {
                $in: vaccinesArr
            }
        }).collation({locale: 'en', strength: 2});
        const date = moment(req.body[i].date.trim(), "DD/MM/YYYY");
        FACILITIES_DATA_RECS.push(new FACILITIES_DATA({
            DATE: date,
            IS_FUNCTIONAL: req.body[i].isFunctional,
            REMARKS: req.body[i].remarks ? req.body[i].remarks.trim() : null,
            FACILITY: facility[0]._id,
            VACCINES: vaccines.map(vaccine => vaccine._id)
        }));
    }
    
    try {
        await FACILITIES_DATA.insertMany(FACILITIES_DATA_RECS);
        await APP_SETTINGS.updateOne({
            KEY: "LAST_REFRESHED"
        }, {
            VALUE: new Date()
        });
        res.status(201).send(FACILITIES_DATA_RECS);
    } catch (e) {
        res.status(500).send(e);
    }
}

const findAll = async (req, res) => {
    try {
        const FACILITIES_DATA_RECS = await FACILITIES_DATA.find({});
        return res.send(FACILITIES_DATA_RECS);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error occured.'
        });
    }
}

const findOne = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({
            message: 'Bad request.'
        });
    }

    try {
        const FACILITIES_DATA_REC = await FACILITIES_DATA.findById(req.params.id);
        if (!FACILITIES_DATA_REC) {
            return res.status(404).send({
                message: 'Record not found.'
            });
        }
        return res.send(FACILITIES_DATA_REC);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error occured.'
        });
    }
}

const getFacilitiesData = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({
            message: 'Bad request.'
        });
    }

    try {
        const FACILITIES_LATEST_DATE = await FACILITIES_DATA.aggregate([
            {
                $match: {
                    FACILITY: mongoose.Types.ObjectId(req.params.id)
                }
            },
            {
                $group: {
                    _id: "FACILITY",
                    latestDate: {$max: "$DATE"}
                }
            }
        ]);
        if (!FACILITIES_LATEST_DATE || FACILITIES_LATEST_DATE.length === 0) {
            return res.status(500).send({
                message: 'Error occurred.'
            });
        }
        const FACILITIES_DATA_REC = await FACILITIES_DATA.find({FACILITY: mongoose.Types.ObjectId(req.params.id)}, {DATE: FACILITIES_LATEST_DATE[0].latestDate})
                                                         .populate({path: "FACILITY", populate: {path: "LOCATION", populate: { path: "WARD" }}})
                                                         .populate({path: "FACILITY", populate: {path: "CATEGORY" }})
                                                         .populate("VACCINES");
        if (!FACILITIES_DATA_REC || FACILITIES_DATA_REC.length === 0) {
            return res.status(404).send({
                message: 'Record not found.'
            });
        }
        const facilitiesData = FACILITIES_DATA_REC.map(data => {
            const vaccines = data.VACCINES.reduce((acc, curr) => {
                if (acc) {
                    return acc + ', ' + curr.NAME
                }
                return curr.NAME
            }, '');
            return {
                facilitiesData: {
                    facility: data.FACILITY.NAME,
                    address: data.FACILITY.ADDRESS,
                    ward: data.FACILITY.LOCATION.WARD.NAME,
                    category: data.FACILITY.CATEGORY.NAME,
                    vaccines: vaccines,
                    contact: data.FACILITY.CONTACT,
                    date: data.DATE ? new Date(data.DATE) : null,
                    isFunctional: data.IS_FUNCTIONAL,
                    remarks: data.REMARKS
                },
                showingDataFor: moment(FACILITIES_LATEST_DATE[0].latestDate).format("DD/MM/YYYY")
            }
        })[0];
        return res.send(facilitiesData);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error occured.'
        });
    }
}

const update = async (req, res) => {
    if (!req.params.id || !req.body || (!req.body.date.trim() && !req.body.isFunctional.toString() && !req.body.facility.trim() && !req.body.vaccines.trim())) {
        return res.status(400).send({
            message: 'Bad request.'
        });
    }
    
    try {
        const facility = await FACILITIES.find({
            'NAME': req.body.facility.trim()
        }).collation({locale: 'en', strength: 2});
        let vaccinesArr = [];
        if (req.body.vaccines.includes(",")) {
            vaccinesArr = req.body.vaccines.trim().split(",").map(vaccine => vaccine.trim());
        }
        else {
            vaccinesArr = [req.body.vaccines.trim()];
        }
        const vaccines = await VACCINES.find({
            'NAME': {
                $in: vaccinesArr
            }
        }).collation({locale: 'en', strength: 2});
        const date = moment(req.body.date.trim(), "DD/MM/YYYY");
        const FACILITIES_DATA_REC = await FACILITIES_DATA.findById(req.params.id);
        if (!FACILITIES_DATA_REC) {
            return res.status(404).send({
                message: 'Record not found.'
            });
        }
        FACILITIES_DATA['DATE'] = date;
        FACILITIES_DATA['IS_FUNCTIONAL'] = req.body.isFunctional;
        FACILITIES_DATA['REMARKS'] = req.body.remarks ? req.body.remarks.trim() : null;
        FACILITIES_DATA['FACILITY'] = facility[0]._id;
        FACILITIES_DATA['VACCINES'] = vaccines.map(vaccine => vaccine._id);
        await FACILITIES_DATA.save();
        return res.send({
            message: 'Record updated.'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error occured.'
        });
    }
}

const deleteOne = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({
            message: 'Bad request.'
        });
    }

    try {
        const FACILITIES_DATA_REC = await FACILITIES_DATA.findByIdAndDelete(req.params.id);
        if (!FACILITIES_DATA_REC) {
            return res.status(404).send({
                message: 'Record not found.'
            });
        }
        return res.send({
            message: 'Record deleted.'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error occured.'
        });
    }
}

module.exports = {
    create,
    bulkInsert,
    findAll,
    findOne,
    getFacilitiesData,
    update,
    deleteOne
}