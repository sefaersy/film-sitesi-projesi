const userCreditModel = require('../model/userCredit_model');
const film_model = require('../model/film_model');
const userSubscription = require('../model/userSubscription_model');
const ObjectId = require('mongoose').Types.ObjectId; 


const search = async function (req, res, next) {
    const { user, query: { search } } = req
console.log(search)
    const total_record = await userCreditModel.aggregate([ {$match:{userId: new ObjectId(user.id)}}, {$group: {_id:null, sum:{$sum:"$amount"}}}])
    const totalCredit = total_record[0]?.sum || 0

    const result = await film_model.find({ name: {'$regex': search}});
    console.log(result)
    const existing_subscription = await userSubscription.findOne({ userId: new ObjectId(user.id) });



    res.render('pages/search', { layout: './layout/yonetim_layout.ejs', bulunan_filmler: result, totalCredit, existing_subscription});
}




module.exports = {
    search
}