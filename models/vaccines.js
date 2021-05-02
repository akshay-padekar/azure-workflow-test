const mongoose = require("mongoose");

const vaccineSchme = new mongoose.Schema({
    NAME: {
        type: String,
        required: true
    },
    MAKE: {
        type: String,
        required: true
    },
    IS_ACTIVE: {
        type: Boolean,
        required: true
    }
},
{ 
    collection: 'VACCINES' 
});

vaccineSchme.virtual('facilitiesData', {
    ref: 'FACILITIES_DATA',
    localField: '_id',
    foreignField: 'VACCINES'
});

const vaccines = new mongoose.model("VACCINES", vaccineSchme);

module.exports = vaccines;