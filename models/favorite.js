const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const favoriteSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        campsite: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Campsite'
        }]

    },
    {
        timestamps: true
    })
const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;