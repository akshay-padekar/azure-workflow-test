require('../models/locations');
require('../models/facilities');
require('../models/facilities-data');

module.exports = (app) => {
    app.get('/api/ping', (req, res) => {
        res.send({
            status: "Healthy"
        });
    });
    require('./locations')(app);
    require('./facilities')(app);
    require('./facilities-data')(app);
};