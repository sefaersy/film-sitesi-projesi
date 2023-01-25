const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const filmSchema = new Schema({
    id: {
        type: SchemaTypes.ObjectId,
    },
    name: {
        type: SchemaTypes.String,
        required: [true, "Film adi boş olamaz"],
        trim: true,
    },
    type: {
        type: SchemaTypes.String,
    },
    credit: {
        type: SchemaTypes.Number,
        default: 0,
        required: true
    },
    image: {
        type: SchemaTypes.String,
    },
    imdb: {
        type: SchemaTypes.Number,
    },
}, {collection: 'film', timestamps: true});

const film = mongoose.model('film', filmSchema);

module.exports = film;