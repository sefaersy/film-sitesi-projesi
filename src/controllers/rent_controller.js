const userSubscription = require('../model/userSubscription_model');
const userFilm_model = require('../model/userFilm_model');
const film_model = require('../model/film_model');
const ObjectId = require('mongoose').Types.ObjectId; 
const userCreditModel = require('../model/userCredit_model');


const rent = async function (req, res, next) {
    const response = {};
    const { body: { _id }, user } = req
    
    const film_rent = await film_model.findOne({ _id: new ObjectId(_id) });

    const existing_rent = await userFilm_model.findOne(
        { userId: new ObjectId(user.id), filmId: new ObjectId(film_rent._id), type: 'rent' }
        )
        
    if (existing_rent && existing_rent.active) {
        response.message = 'zaten filmi kiraladınız';
        response.type = 'error';
        res.send(response);
        return next();
    }


    const total_record = await userCreditModel.aggregate([{$match:{userId: new ObjectId(user.id)}},{$group: {_id:null, sum:{$sum:"$amount"}}}])
    const total_user_credit = total_record[0]?.sum || 0


    
    if(total_user_credit < film_rent.credit/10) {
        response.message = 'bakiye yetersiz';
        res.send(response);
        return next();
    }

    const credit_data = {
        userId: new ObjectId(user.id),
        amount: -(film_rent.credit/10),
        expenseId: null
    }


    const userCredit = await new userCreditModel(credit_data);

    const saved_user_credit = await userCredit.save();

    const user_film_data = {
        filmId: new ObjectId(film_rent._id),
        userId: new ObjectId(user.id),
        userCreditId: new ObjectId(saved_user_credit._id),
        duration: 5,
        active: true,
        type: 'rent'
    }

    const userRentFilm = new userFilm_model(user_film_data);

    const saved_film = await userRentFilm.save();



    if (saved_film._id && saved_user_credit._id) {
        response.message = 'Kiralama Başarılı'
        res.send(response);
        return next();
    } else {
        response.message = 'Kiralama Başarısız'
        res.send(response);
        return next();
    }
}


const rentedFilm = async function (req, res) {
    const { user } = req

    const user_rented_films = await userFilm_model.find({ userId: new ObjectId(user.id), type: 'rent' })
    console.log(user_rented_films);
    let rented_film_id_array = []; 

    user_rented_films.map((rented_film) => {
        rented_film_id_array.push(new ObjectId(rented_film.filmId))
    })
    console.log(rented_film_id_array);
    const result = await film_model.find({_id: { $in: rented_film_id_array }});
    const total_record = await userCreditModel.aggregate([ {$match:{userId: new ObjectId(user.id)}}, {$group: {_id:null, sum:{$sum:"$amount"}}}])
    const totalCredit = total_record[0]?.sum || 0
    const existing_subscription = await userSubscription.findOne({ userId: new ObjectId(user.id) });
    
    res.render('pages/rented', { layout: './layout/yonetim_layout.ejs', filmler: result, totalCredit, existing_subscription});
}

module.exports ={
    rent,
    rentedFilm
}