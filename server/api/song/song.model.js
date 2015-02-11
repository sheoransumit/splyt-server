'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Playlist = require('../playlist/playlist.model'),
    User = require('../user/user.model');

var SongSchema = new Schema({
  tag: String,
  title: { type: String, required: true },
  artist: String,
  link: { type: String },
  audioSource: { type: String, default: null },
  source: {type: String, required: true }
});

//obj for returning song objects in proper format according to song source
var transformations = {
  newYoutubeSong: function(song_obj) {
    return {
      tag: song_obj.args.info.items[0].id,
      title: song_obj.args.info.items[0].snippet.title.split(' - ')[1],
      artist: song_obj.args.info.items[0].snippet.title.split(' - ')[0],
      link: song_obj.args.song.permalink_url,
      source: 'YouTube'
    }
  },
   newSCSong: function(song_obj) {
    var audio;
    song_obj.args.song.streamable ? audio = song_obj.args.song.stream_url : audio = null;
    return {
      tag: song_obj.args.song.id,
      title: song_obj.args.song.title,
      artist: song_obj.args.song.user.username,
      link: song_obj.args.song.permalink_url,
      audioSource: audio,
      source:'SoundCloud'
    }
  },
   newSpotifySong: function(song_obj) {
    return {
      tag: song_obj.args.info.id,
      title: song_obj.args.song.title,
      artist: song_obj.args.info.artists[0].name,
      link: song_obj.args.song.permalink_url,
      source: 'Spotify'
    }
  },
   newTumblrSong: function(song_obj) {
    return {
      title: song_obj.args.song.title,
      artist: song_obj.args.song.artist,
      link: song_obj.args.song.permalink_url,
      audioSource: song_obj.args.iframeSrc,
      source: 'Tumblr'
    }
  }
}

//add songs according to collection
SongSchema.statics.createSong = function(song_obj, cb) {

  var Song = this;
  var song_data = transformations[song_obj.song.action](song_obj.song);
  Song.create(song_data, function(err, data) {
    Playlist.addNewSong(data, song_obj.playlist, song_obj.userid, function(err, model) {
      cb(err, data);
    });
  });
}

module.exports = mongoose.model('Song', SongSchema);
