const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const userSchema = new Schema({
    id: {
        type: SchemaTypes.ObjectId,
    },
    ad: {
        type: SchemaTypes.String,
        required: [true, "Ad alani boş olamaz"],
        trim: true,
        minlength: 2,
        maxlength: 30
    },
    soyad: {
        type: SchemaTypes.String,
        required: [true, "Soyad alani boş olamaz"],
        trim: true,
        minlength: 2,
        maxlength: [30, "Soyadi maximum 30 karakter olmalidir"]
    },
    email: {
        type: SchemaTypes.String,
        required: true, 
        trim: true,
        unique: true,
        lowercase: true
    },
    emailAktif: {
        type: SchemaTypes.Boolean,
        default: false
    },
    sifre: {
        type: SchemaTypes.String,
        required: true,
        trim: true,
    }
}, {collection: 'user', timestamps: true});

const user = mongoose.model('user', userSchema);

module.exports = user;