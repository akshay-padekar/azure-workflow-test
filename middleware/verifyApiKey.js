const bcrypt = require('bcrypt');
const config = require('config');

const verifyApiKey = (req, res, next) => {
    const apiKeyHash = req.headers["api_key"];
    const apiKey = config.get('api_key');
    try {
        const isValid = bcrypt.compareSync(apiKey, apiKeyHash);
        if (isValid) {
            return next();
        }
        return res.status(401).send();
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "Error occurred"
        });
    }
 }

module.exports = verifyApiKey;