const credit = require('../model/credit_model');
const ObjectId = require('mongoose').Types.ObjectId; 
const userCreditModel = require('../model/userCredit_model');
const userExpenseModel = require('../model/userExpense_model');

const kredi = async function (req, res, next) {
    const { user } = req
    const result = await credit.find({});
    const total_record = await userCreditModel.aggregate([ {$match:{userId: new ObjectId(user.id)}}, {$group: {_id:null, sum:{$sum:"$amount"}}}])
    const totalCredit = total_record[0]?.sum || 0
    res.render('pages/credit', { layout: './layout/yonetim_layout.ejs', credit: result, totalCredit });
}

const buy = async function (req, res, next) {
    const response = {}
    const { body: { _id }, user } = req

    const found_credit = await credit.findOne({ _id: new ObjectId(_id) });
            
    const expense_data = {
        userId: new ObjectId(user.id),
        creditId: new ObjectId(found_credit._id)
    }

    const userExpense = new userExpenseModel(expense_data);
    
    const saved_expense = await userExpense.save();

    const credit_data = {
        userId: new ObjectId(user.id),
        amount: found_credit.amount,
        expenseId: new ObjectId(saved_expense._id)
    }
    
    const userCredit = await new userCreditModel(credit_data);

    const saved_user_credit = await userCredit.save();

    if(saved_user_credit._id && saved_expense._id) {
        response.message = 'Kredi Alımı Başarılı'
        res.send(response);
        return next();
    } else {
        response.message = 'Kredi Alımı Başarısız'
        res.send(response);
        return next();
    }
    

}


const totalCredit = async function (req, res, next) {
    const response = {}
    const {user} = req

    console.log(response);

    res.send(response);
}

module.exports = {
    kredi,
    buy,
    totalCredit
}