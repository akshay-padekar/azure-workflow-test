const locationsController = require('../controllers/locations');
const verifyApiKey = require('../middleware/verifyApiKey');

module.exports = (app) => {
    app.post('/api/locations', verifyApiKey, (req, res) => {
        locationsController.create(req, res);
    });
    app.patch('/api/locations/:id', verifyApiKey, (req, res) => {
        locationsController.update(req, res);
    });
    app.get('/api/locations/:id', verifyApiKey, (req, res) => {
        locationsController.findOne(req, res);
    });
    app.get('/api/locations', verifyApiKey, (req, res) => {
        locationsController.findAll(req, res);
    });
    app.delete('/api/locations/:id', verifyApiKey, (req, res) => {
        locationsController.deleteOne(req, res);
    });
}