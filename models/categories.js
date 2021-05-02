const mongoose = require("mongoose"); 

const categoriesSchema = new mongoose.Schema({
    NAME:{
        type: String,
        required: true
    }
},
{ 
    collection: 'CATEGORIES' 
});

categoriesSchema.virtual('facilities', {
    ref: 'FACILITIES',
    localField: '_id',
    foreignField: 'CATEGORY'
});

const categories = new mongoose.model("CATEGORIES", categoriesSchema);

module.exports = categories;