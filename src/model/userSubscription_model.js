const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const userSubscriptionSchema = new Schema({
    id: {
        type: SchemaTypes.ObjectId,
    },
    userId: {
        type: SchemaTypes.ObjectId,
        ref: 'user'
    },
    subscriptionId: {
        type: SchemaTypes.ObjectId,
        ref: 'subscription'
    },
    userCreditId: {
        type: SchemaTypes.ObjectId,
        ref: 'userCredit'
    }
}, {collection: 'userSubscription', timestamps: true});

const userSubscription = mongoose.model('userSubscription', userSubscriptionSchema);

module.exports = userSubscription;