const mongoose = require("mongoose"); 

const appSettingsSchema = new mongoose.Schema({
    KEY:{
        type: String,
        required: true
    },
    VALUE:{
        type: String,
        required: true
    }
},
{ 
    collection: 'APP_SETTINGS' 
});

const appSettings = new mongoose.model("APP_SETTINGS", appSettingsSchema);

module.exports = appSettings;