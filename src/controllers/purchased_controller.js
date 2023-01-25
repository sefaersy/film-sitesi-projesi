const userSubscription = require('../model/userSubscription_model');
const userFilm_model = require('../model/userFilm_model');
const film_model = require('../model/film_model');
const ObjectId = require('mongoose').Types.ObjectId; 
const userCreditModel = require('../model/userCredit_model');


const purchase = async function (req, res, next) {
    const response = {};
    const { body: { _id }, user } = req
    
    const film_purchase = await film_model.findOne({ _id: new ObjectId(_id) });

    const existing_purchase = await userFilm_model.findOne(
        { userId: new ObjectId(user.id), filmId: new ObjectId(film_purchase._id), type: 'purchase' }
        )
        
    if (existing_purchase && existing_purchase.active) {
        response.message = 'zaten filmi satın aldınız';
        response.type = 'error';
        res.send(response);
        return next();
    }


    const total_record = await userCreditModel.aggregate([{$match:{userId: new ObjectId(user.id)}},{$group: {_id:null, sum:{$sum:"$amount"}}}])
    const total_user_credit = total_record[0]?.sum || 0


    
    if(total_user_credit < film_purchase.credit) {
        response.message = 'bakiye yetersiz';
        res.send(response);
        return next();
    }

    const credit_data = {
        userId: new ObjectId(user.id),
        amount: -film_purchase.credit,
        expenseId: null
    }


    const userCredit = await new userCreditModel(credit_data);

    const saved_user_credit = await userCredit.save();

    const user_film_data = {
        filmId: new ObjectId(film_purchase._id),
        userId: new ObjectId(user.id),
        userCreditId: new ObjectId(saved_user_credit._id),
        duration: 0,
        active: true,
        type: 'purchase'
    }

    const userPurchaseFilm = new userFilm_model(user_film_data);

    const saved_film = await userPurchaseFilm.save();



    if (saved_film._id && saved_user_credit._id) {
        response.message = 'Satın Alma Başarılı'
        res.send(response);
        return next();
    } else {
        response.message = 'Satın Alma Başarısız'
        res.send(response);
        return next();
    }
}


const purchaseFilm = async function (req, res) {
    const { user } = req
    
    const user_purchase_films = await userFilm_model.find({ userId: new ObjectId(user.id), type: 'purchase' })
    console.log(user_purchase_films);
    let purchased_film_id_array = []; 

    user_purchase_films.map((purchased_film) => {
        purchased_film_id_array.push(new ObjectId(purchased_film.filmId))
    })
    console.log(purchased_film_id_array);
    const result = await film_model.find({_id: { $in: purchased_film_id_array }});
    const total_record = await userCreditModel.aggregate([ {$match:{userId: new ObjectId(user.id)}}, {$group: {_id:null, sum:{$sum:"$amount"}}}])
    const totalCredit = total_record[0]?.sum || 0
    const existing_subscription = await userSubscription.findOne({ userId: new ObjectId(user.id) });
    
    res.render('pages/purchase', { layout: './layout/yonetim_layout.ejs', filmler: result, totalCredit, existing_subscription});
}

module.exports ={
    purchase,
    purchaseFilm
}