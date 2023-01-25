const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const userFilmSchema = new Schema({
    id: {
        type: SchemaTypes.ObjectId,
    },
    filmId: {
        type: SchemaTypes.ObjectId,
        ref: 'film'
    },
    userId: {
        type: SchemaTypes.ObjectId,
        ref: 'user'
    },
    userCreditId: {
        type: SchemaTypes.ObjectId,
        ref: 'user'
    },
    type: {
        type: SchemaTypes.String,
        default: 'rent'
    },
    duration: {
        type: SchemaTypes.Number,
    },
    active: {
        type: SchemaTypes.Boolean,
    },
}, {collection: 'userFilm', timestamps: true});

const userFilm = mongoose.model('userFilm', userFilmSchema);

module.exports = userFilm;