const mongoose = require("mongoose");

const wardsSchema = mongoose.Schema({
    NAME:{
        type: String,
        required: true
    }
},
{ 
    collection: 'WARDS' 
});

wardsSchema.virtual('locations', {
    ref: 'LOCATIONS',
    localField: '_id',
    foreignField: 'WARDS'
});

const wards = mongoose.model("WARDS", wardsSchema);

module.exports = wards;