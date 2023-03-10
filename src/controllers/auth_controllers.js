const { validationResult } = require('express-validator');
const User = require('../model/user_model');
const passport = require('passport');
require('../config/passport_local')(passport);
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const loginFormunuGoster = (req, res, next) => {
    res.render('login', { layout: './layout/auth_layout.ejs' });
}

const login = (req, res, next) => {
    
    const hatalar = validationResult(req);
        req.flash('email', req.body.email);
        req.flash('sifre', req.body.sifre);
    if(!hatalar.isEmpty()) {
       
        req.flash('validation_error',hatalar.array());
        


        res.redirect('/login');  

    } else {
        passport.authenticate('local',  {
            successRedirect : '/yonetim',
            failureRedirect : '/login',
            failureFlash : true
        })(req, res, next);
    }
}

const registerFormunuGoster = (req, res, next) => {
    res.render('register', { layout: './layout/auth_layout.ejs' });
}

const register = async (req, res, next) => {

    const hatalar = validationResult(req);
    if(!hatalar.isEmpty()) {
       
        req.flash('validation_error',hatalar.array());
        req.flash('email', req.body.email);
        req.flash('ad', req.body.ad);
        req.flash('soyad', req.body.soyad);
        req.flash('sifre', req.body.sifre);
        req.flash('resifre', req.body.resifre);


        res.redirect('/register');  
    } else {

        try{
            const _user = await User.findOne({ email: req.body.email});

            if(_user && _user.emailAktif == true) {
                req.flash('validation_error', [{ msg : "Bu mail adresi kullanimda"}]);
                req.flash('email', req.body.email);
                req.flash('ad', req.body.ad);
                req.flash('soyad', req.body.soyad);
                req.flash('sifre', req.body.sifre);
                req.flash('resifre', req.body.resifre);
                res.redirect('/register');
            } else if ((_user && _user.emailAktif == false) || _user == null) {

                if (_user) {
                    await User.findByIdAndRemove({ _id: _user._id });
                    
                }
                const newUser = new User({
                    email:req.body.email,
                    emailAktif: true,
                    ad:req.body.ad,
                    soyad:req.body.soyad,
                    sifre: await bcrypt.hash(req.body.sifre, 10)
                });
                await newUser.save();
                console.log("kullanici kaydedildi");

                req.flash('success_message', [{ msg : 'Ba??ar??yla Kay??t Olundu.'}]);
                res.redirect('/login');
            }
        } catch(err) {
            console.log(err)   
        }
    }
}

const forgetPasswordFormunuGoster = (req, res, next) => {
    res.render('forget_password', { layout: './layout/auth_layout.ejs'});
}

const forgetPassword = async (req, res, next) => {

    const hatalar = validationResult(req);

    if(!hatalar.isEmpty()) {
       
        req.flash('validation_error',hatalar.array());
        req.flash('email', req.body.email);
        

        res.redirect('/forget-password');  
    } 
    
    else {
        try {
            const _user = await User.findOne({ email : req.body.email, emailAktif : true });

            if (_user) {
                //KULLANICIYA S??FRE SIFIRLAMA MA??L?? ATILAB??L??R

                const jwtBilgileri = {
                    id: _user._id,
                    mail: _user.email
                };
                const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _user.sifre;
                const jwtToken = jwt.sign(jwtBilgileri, secret, {expiresIn:'1d'});

                //mail g??nderme i??lemleri
                const url = process.env.WEB_SITE_URL + 'reset-password/'+_user._id+"/" + jwtToken;
                

                let transporter = nodemailer.createTransport({
                    service : 'SendGrid',
                    auth : {
                        user : 'apikey',
                        pass : process.env.SENDGRID_API_KEY
                    }
                });

                await transporter.sendMail({
                    from: 'Nodejs Uygulamasi <yeniemail@email.com',
                    to : _user.email,
                    subject: "??ifre G??ncelleme",
                    text: "??ifrenizi olu??turmak i??in lutfen ??u linke tiklayiniz:" + url
                }, (error, info) => {
                    if (error) {
                        console.log("bir hata var" + error);
                    }
                    console.log("Mail G??nderildi");
                    console.log(info);
                    transporter.close();
                });

                req.flash('success_message', [{ msg : 'L??tfen mail kutunuzu kontrol edin' }]);
                res.redirect('/login');




            } else {
                req.flash('validation_error', [{msg : "Bu mail kayitli de??il veya kullanici pasif"}]);
                req.flash('email', req.body.email);
                res.redirect('forget-password');
            }
                //jwt i??lemleri

       
            
        } catch (err) {
            console.log("user kaydedilirken hata ??ikti" + err);
        }
    }


    //res.render('forget_password', { layout: './layout/auth_layout.ejs'});
}

const logout = (req, res, next) => {
    req.logout();
    req.session.destroy((error) => {
        res.clearCookie('connect.sid');
        //req.flash('success_message', [{ msg : 'Ba??ariyla ??iki?? yapildi'}]);
        res.render('login', { layout: './layout/auth_layout.ejs', success_message : [{ msg : '??iki?? yapildi' }] });
        //res.redirect('/login');
        //res.send('??iki?? Yapildi');
    })
}

const verifyMail = (req, res, next) => {

    const token = req.query.id;
    if(token) {

        try {
            jwt.verify(token, process.env.CONFIRM_MAIL_JWT_SECRET, async (e, decoded) => {

                if(e) {
                    req.flash('error', 'Kod hatali ya da s??resi ge??mi??');
                    res.redirect('/login');
                } else {
                    const tokenIcindekiIdDegeri = decoded.id;
                    const sonuc = await User.findByIdAndUpdate(tokenIcindekiIdDegeri, {emailAktif : true});

                    if(sonuc) {
                        req.flash("success_message", [{ msg : 'Ba??ar??yla Mail Onayland??' }]);
                        res.redirect('/login');
                    } else {
                        req.flash("error", [{ msj : ' L??tfen Tekrar Kullan??c?? Olu??turun' }]);
                        res.redirect('/login');
                    }
                }
            });
        } catch (err) {

        }


    } else {
        req.flash("error", 'Token Yok veya Ge??ersiz');
        res.redirect('/login');
    }

}

const yeniSifreyiKaydet = async (req, res, next) => {
    const hatalar = validationResult(req);

    if (!hatalar.isEmpty()) {
        req.flash('validation_error', hatalar.array());
        req.flash('sifre', req.body.sifre);
        req.flash('resifre', req.body.resifre);

        console.log("formdan gelen de??erler");
        console.log(req.body);

        res.redirect('/reset-password/' + req.body.id + "/" + req.body.token);
    } else {

        const _bulunanUser = await User.findOne({ _id : req.body.id, emailAktif : true });

        const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _bulunanUser.sifre;

                    try {
                        jwt.verify(req.body.token, secret, async (e, decoded) => {
            
                            if(e) {
                                req.flash('error', 'Kod hatal?? ya da s??resi ge??mi??');
                                res.redirect('/forget-password');
                            } else {

                            const hashedPassword = await bcrypt.hash(req.body.sifre, 10);
                            const sonuc = await User.findByIdAndUpdate(req.body.id, {sifre : hashedPassword});

                            if(sonuc) {
                                req.flash("success_message", [{ msg : 'Ba??ar??yla ??ifre G??ncellendi' }]);
                                res.redirect('/login');
                            } else {
                                req.flash("error", [{ msj : ' L??tfen Tekrar ??ifre S??f??rlama Ad??mlar??n?? Yap??n' }]);
                                res.redirect('/login');
                            }
                            }
                        });
                    } catch (err) {
            
                    }
    }
}

const yeniSifreFormuGoster = async (req, res, next) => {
    const linktekiId = req.params.id;
    const linktekiToken = req.params.token;

    if ( linktekiId && linktekiToken ) {
        
        const _bulunanUser = await User.findOne({ _id : linktekiId });

        const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _bulunanUser.sifre;

                    try {
                        jwt.verify(linktekiToken, secret, async (e, decoded) => {
            
                            if(e) {
                                req.flash('error', 'Kod hatal?? ya da s??resi ge??mi??');
                                res.redirect('/forget-password');
                            } else {
                                res.render('new_password', { id:linktekiId, token: linktekiToken, layout: './layout/auth_layout.ejs', title: '??ifre G??ncelle' });   
                             }
                        });
                    } catch (err) {
            
                    }
    } else {
        req.flash('validation_error', [{msg : "L??tfen maildeki linke tiklayin. Token bulunamadi"}]);
        res.redirect('forget-password');
    }
}


module.exports = {
    loginFormunuGoster,
    registerFormunuGoster,
    register,
    login,
    forgetPasswordFormunuGoster,
    forgetPassword,
    logout,
    verifyMail,
    yeniSifreFormuGoster,
    yeniSifreyiKaydet
}