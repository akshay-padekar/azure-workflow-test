const mongoose = require("mongoose");

const facilitiesDataSchema = new mongoose.Schema({
    REMARKS:{
        type: String,
        required: false
    },
    DATE: {
        type: Date,
        required:true
    },
    FACILITY: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'FACILITIES'
    },
    VACCINES: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'VACCINES'
    }],
    IS_FUNCTIONAL:{
        type: Boolean,
        required: true
    },
},
{ 
    collection: 'FACILITIES_DATA' 
});

const facilitiesData = new mongoose.model("FACILITIES_DATA", facilitiesDataSchema);

module.exports = facilitiesData;