const { body } = require('express-validator');


const validateNewUser = () => {
    return [
        body('email')
            .trim()
            .isEmail().withMessage('Geçerli bir mail adresi giriniz'),

        body('sifre').trim()
            .isLength({ min : 6 }).withMessage('Şifreniz en az 6 karakter olmalidir')
            .isLength({ max : 20 }).withMessage('Şifreniz en fazla 20 karakter olmalidir'),

        body('ad').trim()
            .isLength({ min : 2 }).withMessage('İsim en az 2 karakter olmalidir')
            .isLength({ max : 30 }).withMessage('İsim en fazla 30 karakter olmalidir'),

        body('soyad').trim()
            .isLength({ min : 2 }).withMessage('Soyisim en az 2 karakter olmalidir')
            .isLength({ max : 30 }).withMessage('Soyisim en fazla 30 karakter olmalidir'),

        body('resifre').trim().custom((value, { req }) => {
            
            if(value !== req.body.sifre) {
                throw new Error('Şifreler Eşleşmiyor');
            }
            return true;
        })
    ];
}

const validateNewPassword = () => {
    return [
        
        body('sifre').trim()
            .isLength({ min : 6 }).withMessage('Şifreniz en az 6 karakter olmalidir')
            .isLength({ max : 20 }).withMessage('Şifreniz en fazla 20 karakter olmalidir'),

        body('resifre').trim().custom((value, { req }) => {
            
            if(value !== req.body.sifre) {
                throw new Error('Şifreler Eşleşmiyor');
            }
            return true;
        })
    ];
}

const validateLogin = () => {
    return [
        body('email')
            .trim()
            .isEmail().withMessage('Geçerli bir mail adresi giriniz'),

        body('sifre').trim()
            .isLength({ min : 6 }).withMessage('Şifreniz en az 6 karakter olmalidir')
            .isLength({ max : 20 }).withMessage('Şifreniz en fazla 20 karakter olmalidir'),
    ];
}

const validateEmail = () => {
    return [
        body('email')
            .trim()
            .isEmail().withMessage('Geçerli bir mail adresi giriniz'),
    ];
}

module.exports = {
    validateNewUser,
    validateLogin,
    validateEmail,
    validateNewPassword
}