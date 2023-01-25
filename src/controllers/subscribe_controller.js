const subscription = require('../model/subscription_model');
const userSubscriptionModel = require('../model/userSubscription_model');
const ObjectId = require('mongoose').Types.ObjectId;
const userCreditModel = require('../model/userCredit_model');
const userSubscription = require('../model/userSubscription_model');


const subscribe = async function (req, res, next) {
    const { user } = req
    const result = await subscription.find({}).sort('name').collation({locale: "en_US", numericOrdering: true});
    //console.log(result);

    const total_record = await userCreditModel.aggregate([ {$match:{userId: new ObjectId(user.id)}}, {$group: {_id:null, sum:{$sum:"$amount"}}}])
    const totalCredit = total_record[0]?.sum || 0
      
    res.render('pages/subscribe', { layout: './layout/yonetim_layout.ejs', subscribe: result, totalCredit});
}
const buy = async function (req, res, next) {
    const response = {}
    const { body: { _id }, user } = req

    const found_subscription = await subscription.findOne({ _id: new ObjectId(_id) })
    
    const existing_subscription = await userSubscription.findOne({ userId: new ObjectId(user.id), subscriptionId: new ObjectId(found_subscription._id) })

    if (existing_subscription) {
        response.message = 'zaten satın alındı';
        response.type = 'error';
        res.send(response);
        return next();
    }
    
    const total_record = await userCreditModel.aggregate([{$match:{userId: new ObjectId(user.id)}},{$group: {_id:null, sum:{$sum:"$amount"}}}])
    const total_user_credit = total_record[0]?.sum || 0
        

    if (total_user_credit < found_subscription.credit) {
        response.message = 'bakiye yetersiz'
        response.type = 'error';
        res.send(response);
        return next();
    }

    const user_credit_data = {
        userId: new ObjectId(user.id),
        amount: -found_subscription.credit
    }

    let userCredit = new userCreditModel(user_credit_data)
    userCredit = await userCredit.save();

    if(userCredit._id) {
        const subscription_data = {
            userId: new ObjectId(user.id),
            subscriptionId: new ObjectId(found_subscription._id),
            userCreditId: new ObjectId(user_credit_data._id)
        }

        const userSubscription = new userSubscriptionModel(subscription_data);
        const result = await userSubscription.save();

        if(result._id) {
            response.message = 'Abonelik Başarılı'
        } else {
            response.message = 'Abonelik Başarısız'
        }

        res.send(response);
    } else {
        response.message = 'Kullanıcı kredi harcaması başarısız'
        res.send(response);
    }
}

module.exports = {
    subscribe,
    buy
}