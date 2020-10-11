



// this is a module DAO for Users
const mongoose = require('mongoose')

const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  };

const burndownSchema = mongoose.Schema({
_id : mongoose.Schema.Types.ObjectId,
sprint: String,
giorni: String,
storyPointTot: Number
},{timestamps: true})

module.exports = mongoose.model('burndowns', burndownSchema) 