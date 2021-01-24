const express = require('express');
const favoriteRouter = express.Router();
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Campsite = require('../models/campsite');

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors,(req, res, next) => {
    Favorite.find({user: req.user._id})
    .populate('user')
    .populate('campsites')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if(favorite){
            req.body.forEach(
                function (item) {
                    if(favorite.campsites.includes(item)){
                        console.log('already existe');
                        res.statusCode = 200;
                    }else{
                        favorite.campsites.push(item)
                        console.log('favorite added ');
                        res.statusCode = 200;
                        favorite.save();
                    }
                }
            )
            function checkInclude(item) {
                if(favorite.campsites.includes(item)){
                    console.log('already existe');
                    res.statusCode = 200;
                }else{
                    favorite.campsites.push(item)
                    console.log('favorite added ');
                    res.statusCode = 200;
                    favorite.save();
                }
            }
            
                
            
        }else{
            Favorite.create({user: req.user._id,campsites : [req.body]})
            .then(favorite => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({user: req.user._id })
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors,(req, res, next) => {
    res.statusCode = 403;
    res.end('Get operation not supported on /favorites');
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if(favorite){
                
                    if(favorite.campsites.includes(req.params.campsiteId)){
                        console.log('already existe');
                        res.statusCode = 200;
                    }else{
                        favorite.campsites.push(req.params.campsiteId)
                        console.log('favorite added ');
                        res.statusCode = 200;
                        favorite.save()
                        .then(favorite => {
                            console.log('Favorite Created ', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err))
                    }
            
        }else{
            Favorite.create({user: req.user._id,campsites : [req.params.campsiteId]})
            .then(favorite => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        favorite.campsites.filter(campsite => campsite !== req.params.campsiteId)
        favorite.save()
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = favoriteRouter;