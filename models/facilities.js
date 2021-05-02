const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

const facilitiesSchema = new mongoose.Schema({
    NAME: {
        type: String,
        required: true
    },
    ADDRESS:{
        type: String,
        required: true
    },
    CONTACT: {
        type: String,
        required: false
    },
    LONGITUDE: {
        type: String,
        required: false
    },
    LATITUDE: {
        type: String,
        required: false
    },
    CATEGORY: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'CATEGORIES'
    },
    LOCATION: {
        type: mongoose.Schema.Types.ObjectId,
        rquired: true,
        ref: 'LOCATIONS'
    }
},
{ 
    collection: 'FACILITIES' 
});


facilitiesSchema.virtual('facilitiesData', {
    ref: 'FACILITIES_DATA',
    localField: '_id',
    foreignField: 'FACILITY'
});

facilitiesSchema.plugin(mongoose_fuzzy_searching, { fields: [
    {
        name: 'NAME',
        prefixOnly: true
    }, 
    {
        name: 'ADDRESS',
        prefixOnly: true
    }
] });

const facilities = mongoose.model("FACILITIES", facilitiesSchema);

module.exports = facilities;

