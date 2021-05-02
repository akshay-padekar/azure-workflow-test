const facilitiesDataController = require('../controllers/facilities-data');
const verifyApiKey = require('../middleware/verifyApiKey');

module.exports = (app) => {
    app.post('/api/facilitiesdata', verifyApiKey, (req, res) => {
        facilitiesDataController.create(req, res);
    });
    app.post('/api/facilitiesdata/bulk', verifyApiKey, (req, res) => {
        facilitiesDataController.bulkInsert(req, res);
    });
    app.patch('/api/facilitiesdata/:id', verifyApiKey, (req, res) => {
        facilitiesDataController.update(req, res);
    });
    app.get('/api/facilitiesdata/:id', verifyApiKey, (req, res) => {
        facilitiesDataController.findOne(req, res);
    });
    app.get('/api/facilitiesdata/facility/:id', verifyApiKey, (req, res) => {
        facilitiesDataController.getFacilitiesData(req, res);
    });
    app.get('/api/facilitiesdata', verifyApiKey, (req, res) => {
        facilitiesDataController.findAll(req, res);
    });
    app.delete('/api/facilitiesdata/:id', verifyApiKey, (req, res) => {
        facilitiesDataController.deleteOne(req, res);
    });
}