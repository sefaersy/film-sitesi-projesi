const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const creditSchema = new Schema({
    id: {
        type: SchemaTypes.ObjectId,
    },
    name: {
        type: SchemaTypes.String,
        required: true,
        trim: true,
    },
    fee: {
        type: SchemaTypes.Number,
    },
    amount: {
        type: SchemaTypes.Number,
    },
}, {collection: 'credit', timestamps: true});

const credit = mongoose.model('credit', creditSchema);

module.exports = credit;