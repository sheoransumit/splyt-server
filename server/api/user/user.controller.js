'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var request = require('request');
var Song = require('../song/song.model');
var Playlist = require('../playlist/playlist.model')
var eventMachine = require('./userEvents')

var validationError = function(res, err) {
    return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
    User.find({}, '-salt -hashedPassword', function(err, users) {
        if (err) return res.send(500, err);
        res.json(200, users);
    });
};
/**
 * Search for users
 *
 */
exports.getUsers = function(req, res) {
    User.find({name: new RegExp(req.params.name, 'gi')}).exec(function(err, users){
        if (err) return res.send(500, err);
        res.json(200, users);
    });
};

/**
 * Checks for song source and sends it to proper place
 */
exports.addSong = function(req, res) {
    var song_obj = {};
    song_obj.userid = req.params.id;
    song_obj.song = req.body;
    song_obj.playlist = req.params.listid;

    //find the user
    User.findById(req.params.id, function(err, user) {
        user.addSong(song_obj, function(err, data) {
          res.json(200, data);
          User.propagateToFollowers(data, user.followers, function(err, model) {
          });
        });
    });
}

/**
 * Gets Playlists for Current User
 */
exports.getPlaylists = function(req, res) {
    var userid = req.params.id;
    User.getPlaylists(userid, function(err, user) {
        res.json(200, user.playlist);
    });
}
/**
 * Gets Followers and Subscriptions for Current User
 */
exports.getFollowersandSubscriptions = function(req, res) {
    var userid = req.params.id;
    User.getFollowersandSubscriptions(userid, function(err, user) {
        res.json(200, user);
    });
}
/**
 * Set Subscription
 */
exports.setSubscription = function(req, res) {
    User.setSubscription(req.params.id, req.body, function(err, user) {
        res.json(200, user);
    });
}
/**
 * Remove Subscription
 */
exports.removeSubscription = function(req, res) {
    User.removeSubscription(req.params.id, req.body, function(err, user) {
        res.json(200, user);
    });
}
/**
 * Creates a new user
 */
exports.create = function(req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.role = 'user';
    newUser.save(function(err, user) {
        if (err) {
          return validationError(res, err);
        };
        var token = jwt.sign({
            _id: user._id
        }, config.secrets.session, {
            expiresInMinutes: 60 * 1000000000000
        });
        res.json({
            token: token
        });
    });
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
    var userId = req.params.id;

    User.findById(userId, function(err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);
        res.json(user.profile);
    });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err, user) {
        if (err) return res.send(500, err);
        return res.send(204);
    });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    User.findById(userId, function(err, user) {
        if (user.authenticate(oldPass)) {
            user.password = newPass;
            user.save(function(err) {
                if (err) return validationError(res, err);
                res.send(200);
            });
        } else {
            res.send(403);
        }
    });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
    var userId = req.user._id;
    User.findOne({
        _id: userId
    }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
        if (err) return next(err);
        if (!user) return res.json(401);
        res.json(user);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};
