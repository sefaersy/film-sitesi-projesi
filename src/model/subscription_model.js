const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const subscriptionSchema = new Schema({
    id: {
        type: SchemaTypes.ObjectId,
    },
    name: {
        type: SchemaTypes.String,
        required: true,
        trim: true
    },
    credit: {
        type: SchemaTypes.Number,
        required: true
    }
}, {collection: 'subscription', timestamps: true});

const subscription = mongoose.model('subscription', subscriptionSchema);

module.exports = subscription;