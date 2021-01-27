const express = require('express');
const favoriteRouter = express.Router();
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');
// const Campsite = require('../models/campsite');

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors,authenticate.verifyUser, (req, res, next) => {
    Favorite.find({user: req.user._id})
    .populate('user')
    .populate('campsite')
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
            req.body.forEach(item => {
                    if(favorite.campsite.includes(item._id)){
                        console.log('already existe');

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    }else{
                        favorite.campsite.push(item._id)
                        console.log('favorite added ');
                        favorite.save()
                        .then(favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                        })
                    }
                }
            )
            function checkInclude(item) {
                if(favorite.campsite.includes(item._id)){
                    console.log('already existe');
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }else{
                    favorite.campsite.push(item._id)
                    console.log('favorite added ');
                    favorite.save()
                    .then(favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
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
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if(favorite){
                
                    if(favorite.campsite.includes(req.params.campsiteId)){
                        console.log('already existe');
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    }else{
                        favorite.campsite.push(req.params.campsiteId)
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
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id })
    .then(favorite => {
        if (favorite) {
            const index = favorite.campsites.indexOf(req.params.campsiteId);
            if (index >= 0) {
                favorite.campsites.splice(index, 1);
            }

            /* can alternatively use filter as below, instead of using indexOf/splice, 
               but make sure to use loose inequality OR do fav.toString() before comparing: */
            //favorite.campsites = favorite.campsites.filter(fav => fav.toString() !== req.params.campsiteId);

            favorite.save()
            .then(favorite => {
                console.log('Favorite Campsite Deleted!', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }).catch(err => next(err));
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any favorites to delete.');
        }
    }).catch(err => next(err))
})
module.exports = favoriteRouter;