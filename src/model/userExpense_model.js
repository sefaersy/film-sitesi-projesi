const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const creditSchema = new Schema({
    id: {
        type: SchemaTypes.ObjectId,
    },
    creditId: {
        type: SchemaTypes.ObjectId,
        ref: 'credit'
    },
    userId: {
        type: SchemaTypes.ObjectId,
        ref: 'user'
    },
}, {collection: 'userExpense', timestamps: true});

const credit = mongoose.model('userExpense', creditSchema);

module.exports = credit;