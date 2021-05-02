const facilitiesController = require('../controllers/facilities');
const verifyApiKey = require('../middleware/verifyApiKey');

module.exports = (app) => {
    app.post('/api/facilities', verifyApiKey, (req, res) => {
        facilitiesController.create(req, res);
    });
    app.post('/api/facilities/bulk', verifyApiKey, (req, res) => {
        facilitiesController.bulkInsert(req, res);
    });
    app.patch('/api/facilities/:id', verifyApiKey, (req, res) => {
        facilitiesController.update(req, res);
    });
    app.get('/api/facilities/:id', verifyApiKey, (req, res) => {
        facilitiesController.findOne(req, res);
    });
    app.get('/api/facilities', verifyApiKey, (req, res) => {
        facilitiesController.findAll(req, res);
    });
    app.get('/api/search', verifyApiKey, (req, res) => {
        facilitiesController.search(req, res);
    });
    app.delete('/api/facilities/:id', verifyApiKey, (req, res) => {
        facilitiesController.deleteOne(req, res);
    });
}