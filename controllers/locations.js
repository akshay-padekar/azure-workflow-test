const LOCATIONS = require('../models/locations');
const WARDS = require('../models/wards');

const create = async (req, res) => {
    if (!req.body || !req.body.name.trim() || !req.body.ward.trim()) {
        return res.status(400).send({
            message: 'Bad request.'
        });
    }
    
    try {
        const ward = await WARDS.find({
            'NAME': req.body.ward.trim()
        }).collation({locale: 'en', strength: 2});
        const NEW_LOCATION_REC = new LOCATIONS({
            NAME: req.body.name.trim(),
            WARD: ward[0]._id
        });
        await NEW_LOCATION_REC.save()
        res.status(201).send(NEW_LOCATION_REC)
    } catch (e) {
        res.status(500).send(e)
    }
}

const findAll = async (req, res) => {
    try {
        const LOCATIONS_RECS = await LOCATIONS.find({});
        return res.send(LOCATIONS_RECS);
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
        const LOCATION_REC = await LOCATIONS.findById(req.params.id);
        if (!LOCATION_REC) {
            return res.status(404).send({
                message: 'Record not found.'
            });
        }
        return res.send(LOCATION_REC);
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error occured.'
        });
    }
}

const update = async (req, res) => {
    if (!req.params.id || !req.body || (!req.body.name.trim() && !req.body.ward.trim())) {
        return res.status(400).send({
            message: 'Bad request.'
        });
    }
    
    try {
        const ward = await WARDS.find({
            'NAME': req.body.ward.trim()
        }).collation({locale: 'en', strength: 2});;
        const LOCATION_REC = await LOCATIONS.findById(req.params.id);
        if (!LOCATION_REC) {
            return res.status(404).send({
                message: 'Record not found.'
            });
        }
        LOCATION_REC['NAME'] = req.body.name.trim();
        LOCATION_REC['WARD'] = ward[0]._id;
        await LOCATION_REC.save();
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
        const LOCATION_REC = await LOCATIONS.findByIdAndDelete(req.params.id);
        if (!LOCATION_REC) {
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
    findAll,
    findOne,
    update,
    deleteOne
}