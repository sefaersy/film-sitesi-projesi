const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true, 
    useFindAndModify: false
})
    .then(() => console.log('veritabanina bağlanildi'))
    .catch(hata => console.log(`veritabani bağlanti hatasi ${hata}`))