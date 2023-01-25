const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const userCreditSchema = new Schema({
    id: {
        type: SchemaTypes.ObjectId,
    },
    userId: {
        type: SchemaTypes.ObjectId,
        ref: 'user'
    },
    expenseId: {
        type: SchemaTypes.ObjectId,
        ref: 'userExpense'
    },
    amount: {
        type: SchemaTypes.Number,
    }
}, {collection: 'userCredit', timestamps: true});

const userCredit = mongoose.model('userCredit', userCreditSchema);

module.exports = userCredit;