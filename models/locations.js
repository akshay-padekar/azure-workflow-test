const mongoose = require("mongoose");

const locationsSchema = new mongoose.Schema({
    NAME: {
        type: String,
        required: true
    },
    WARD: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "WARDS"
    }
},
{ 
    collection: 'LOCATIONS' 
});

locationsSchema.virtual('facilities', {
    ref: 'FACILITIES',
    localField: '_id',
    foreignField: 'LOCATION'
});

const locations = mongoose.model("LOCATIONS", locationsSchema);

module.exports = locations;