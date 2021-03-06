'use strict';

angular.module('splytApp')
  .factory('SoundcloudNonstreamable', function ($sce, $q) {
    // var timerInterval;

    var SoundcloudNonstreamableAudioSource = function(song) {
      var trustSrc = $sce.trustAsResourceUrl;
      var self = this;
      this.timerInterval;
      this.onReadyFunctions = [];
      this.domElement = $('<iframe style="display:none;" width="100%" height="166" scrolling="no" frameborder="no" src=""></iframe>')
      this.domElement.attr('id', song.tag)
      this.songTag = song.tag;
      $('body').append(this.domElement);
      this.url = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + song.tag + "&color=0066cc";
      $('#' + song.tag).attr('src', trustSrc(this.url));
      this.widget = SC.Widget(document.getElementById(this.songTag));
      this.widget.bind(SC.Widget.Events.READY, function() {
        self.onReadyFunctions.forEach(function(fn){
          fn();
        })
      });
    }

    SoundcloudNonstreamableAudioSource.prototype.onReady = function(fn) {
      this.onReadyFunctions.push(fn);
    }

    SoundcloudNonstreamableAudioSource.prototype.play = function() {
      this.widget.play();
    }

    SoundcloudNonstreamableAudioSource.prototype.pause = function() {
      this.widget.pause();
    }

    SoundcloudNonstreamableAudioSource.prototype.seek = function(num) {
      this.widget.seekTo(num*1000);
    }

    SoundcloudNonstreamableAudioSource.prototype.currentTime = function() {
      var deferral = $q.defer();
      this.widget.getPosition(function(e) {
        deferral.resolve(e/1000);
      })
      return deferral.promise;
    }

    SoundcloudNonstreamableAudioSource.prototype.duration = function() {
      var deferral = $q.defer();
      this.widget.getDuration(function(e){
        deferral.resolve(e/1000);
      });
      return deferral.promise;
    }

    SoundcloudNonstreamableAudioSource.prototype.addEndedListener = function(cb) {
      return this.widget.bind(SC.Widget.Events.FINISH, function() {
        cb();
      })
    }

    SoundcloudNonstreamableAudioSource.prototype.timer = function(playerTimeUpdate) {
      var x = 0, self = this;
      this.timerInterval = setInterval(function() {
        self.currentTime().then(function(position){
          if(position !== x) {
            x = position;
            playerTimeUpdate(position);
          }
        })
      }, 100);
    }

    SoundcloudNonstreamableAudioSource.prototype.stop = function(newSong) {
      clearInterval(this.timerInterval);
      this.widget.pause();
      this.widget.seekTo(0);
      $('#' + this.songTag).remove();
    }

    SoundcloudNonstreamableAudioSource.prototype.setVolume = function(num) {
      this.widget.setVolume(num/100);
    }

    return SoundcloudNonstreamableAudioSource;
  });
