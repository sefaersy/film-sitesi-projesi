const userSubscription = require('../model/userSubscription_model');
const axios = require('axios');
const { render } = require('ejs');
const { response } = require('express');
const ObjectId = require('mongoose').Types.ObjectId;
const userCreditModel = require('../model/userCredit_model');
const film = require('../model/film_model');



const anaSayfayiGoster = async function (req, res, next) {

    const { user } = req
    console.log(new ObjectId(user.id));
    console.log(user);
    const existing_subscription = await userSubscription.findOne({ userId: new ObjectId(user.id) })
    console.log(existing_subscription);

        let sayfalama = "";
        let aktifPage = 1;
        
        if (req.query.page) {
            sayfalama = "page=" + req.query.page;
            aktifPage = req.query.page;
        }
    
        try {
            //console.log(blogAPI);
            const total_record = await userCreditModel.aggregate([ {$match:{userId: new ObjectId(user.id)}}, {$group: {_id:null, sum:{$sum:"$amount"}}}])
            const totalCredit = total_record[0]?.sum || 0
            const result = await film.find({}).sort('name').collation({locale: "en_US", numericOrdering: true});
            res.render('pages/index', { layout: './layout/yonetim_layout.ejs', filmler: result, totalCredit, existing_subscription });
            //console.log(result);
        } catch (hata) {
            
            res.json({
                mesaj: 'hata çikti:' + hata
            })
        }
}


const aramaYap = async (req, res) => {

    let aranacakKelime = req.body.search;

    let combining = /[\u0300-\u036F]/g;

    console.log(aranacakKelime.normalize('NFKD').replace(combining, ''));

    aranacakKelime = aranacakKelime.normalize('NFKD').replace(combining, '');

    let sayfalama = "";
    let aktifPage = 1;
    
    if (req.query.page) {
        sayfalama = "page=" + req.query.page;
        aktifPage = req.query.page;
    }

    try {
        const result = await film.find({}).sort('name').collation({locale: "en_US", numericOrdering: true});
        res.render('./pages/index', {filmler: result, aktifPage : aktifPage});
    } catch (hata) {
        
        res.json({
            mesaj: 'hata çikti:' + hata
        })
    }
}


module.exports = {
    anaSayfayiGoster,
    aramaYap
}