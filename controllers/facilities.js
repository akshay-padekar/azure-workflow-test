const FACILITIES = require('../models/facilities');
const CATEGORIES = require('../models/categories');
const LOCATIONS = require('../models/locations');

const create = async (req, res) => {
    if (!req.body || !req.body.name.trim() || !req.body.address.trim() || !req.body.category.trim() || !req.body.location.trim()) {
        return res.status(400).send({
            message: 'Bad request.'
        });
    }
    
    try {
        const category = await CATEGORIES.find({
            'NAME': req.body.category.trim()
        }).collation({locale: 'en', strength: 2});
        const location = await LOCATIONS.find({
            'NAME': req.body.location.trim()
        }).collation({locale: 'en', strength: 2});
        const NEW_FACILITY_REC = new FACILITIES({
            NAME: req.body.name.trim(),
            ADDRESS: req.body.address.trim(),
            CONTACT: req.body.contact ? req.body.contact.trim() : null,
            LONGITUDE: req.body.longitude ? req.body.longitude.trim() : null,
            LATITUDE: req.body.latitude ? req.body.latitude.trim() : null,
            CATEGORY: category._id,
            LOCATION: location._id
        });
        await NEW_FACILITY_REC.save()
        res.status(201).send(NEW_FACILITY_REC)
    } catch (e) {
        res.status(500).send(e)
    }
}

const bulkInsert = async (req, res) => {
    if (!req.body || req.body.length === 0) {
        return res.status(400).send({
            message: 'Bad request.'
        });
    }
    const FACILITIES_RECS = [];
    for (let i=0; i<req.body.length; i++) {
        if (!req.body[i].name.trim() || !req.body[i].address.trim() || !req.body[i].category.trim() || !req.body[i].location.trim()) {
            return res.status(400).send({
                message: 'Bad request.'
            });
        }
        const category = await CATEGORIES.find({
            'NAME': req.body[i].category.trim()
        }).collation({locale: 'en', strength: 2});
        const location = await LOCATIONS.find({
            'NAME': req.body[i].location.trim()
        }).collation({locale: 'en', strength: 2});
        FACILITIES_RECS.push(new FACILITIES({
            NAME: req.body[i].name.trim(),
            ADDRESS: req.body[i].address.trim(),
            CONTACT: req.body[i].contact ? req.body[i].contact.trim() : null,
            LONGITUDE: req.body[i].longitude ? req.body[i].longitude.trim() : null,
            LATITUDE: req.body[i].latitude ? req.body[i].latitude.trim() : null,
            CATEGORY: category[0]._id,
            LOCATION: location[0]._id
        }));
    }
    
    try {
        await FACILITIES.insertMany(FACILITIES_RECS);
        res.status(201).send(FACILITIES_RECS);
    } catch (e) {
        res.status(500).send(e);
    }
}

const findAll = async (req, res) => {
    try {
        const FACILITIES_RECS = await FACILITIES.find({});
        return res.send(FACILITIES_RECS);
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
        const FACILITY_REC = await FACILITIES.findById(req.params.id);
        if (!FACILITY_REC) {
            return res.status(404).send({
                message: 'Record not found.'
            });
        }
        return res.send(FACILITY_REC);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error occured.'
        });
    }
}

const update = async (req, res) => {
    if (!req.params.id || !req.body || (!req.body.name.trim() && !req.body.address.trim() && !req.body.category.trim() && !req.body.location.trim())) {
        return res.status(400).send({
            message: 'Bad request.'
        });
    }
    
    try {
        const category = await CATEGORIES.find({
            'NAME': req.body.category.trim()
        }).collation({locale: 'en', strength: 2});
        const location = await LOCATIONS.find({
            'NAME': req.body.location.trim()
        }).collation({locale: 'en', strength: 2});
        const FACILITY_REC = await FACILITIES.findById(req.params.id);
        if (!FACILITY_REC) {
            return res.status(404).send({
                message: 'Record not found.'
            });
        }
        FACILITY_REC['NAME'] = req.body.name.trim();
        FACILITY_REC['ADDRESS'] = req.body.address.trim();
        FACILITY_REC['CONTACT'] = req.body.contact ? req.body.contact.trim() : null;
        FACILITY_REC['LONGITUDE'] = req.body.longitude ? req.body.longitude.trim() : null;
        FACILITY_REC['LATITUDE'] = req.body.latitude ? req.body.latitude.trim() : null;
        FACILITY_REC['CATEGORY'] = category._id;
        FACILITY_REC['LOCATION'] = location._id;
        await FACILITY_REC.save();
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
        const FACILITY_REC = await FACILITIES.findByIdAndDelete(req.params.id);
        if (!FACILITY_REC) {
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

const search = async (req, res) => {
    if (!req.query.searchString) {
        return res.status(400).send({
            message: 'Bad request.'
        });
    }
    try {
        const facilities = await FACILITIES.fuzzySearch({query: req.query.searchString, prefixOnly: true, exact: true});
        return res.send(facilities.map(facility => {
            return {
                id: facility._id,
                name: facility.NAME,
                address: facility.ADDRESS,
                label: facility.NAME + ' - ' + facility.ADDRESS
            }
        }));
    }
    catch (err) {
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
    update,
    deleteOne,
    search
}