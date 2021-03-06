'use strict';

var should = require('should');
var app = require('../../app');
var Song = require('./song.model');
var User = require('../user/user.model');
var Playlist = require('../playlist/playlist.model');

var user = new User({
  provider: 'local',
  name: 'Fake User',
  email: 'test@test.com',
  password: 'password'
});

var playlist = new Playlist({
  name:'default',
  aggregate_stream: true
})



var youtube_song = {
  userid: user._id,
  song: {"action":"newYoutubeSong","method":"","args":{"info":{"kind":"youtube#videoListResponse","etag":"\"4FSIjSQU83ZJMYAO0IqRYMvZX98/_5UUyXhhR_hsY80buFNLXXNl30k\"","pageInfo":{"totalResults":1,"resultsPerPage":1},"items":[{"kind":"youtube#video","etag":"\"4FSIjSQU83ZJMYAO0IqRYMvZX98/UR1AAdXygvkiUEQjfYNOubm3aPs\"","id":"fMxIuFMgt4U","snippet":{"publishedAt":"2010-05-15T05:02:58.000Z","channelId":"UCD1g3LY8kFOekjdsmPHXcTA","title":"Best of Me - The Starting Line lyrics","description":"Tell me what you thought about when you were gone \r\nAnd so alone \r\nThe worst is over \r\nYou can have the best of me \r\nWe got older \r\nBut we're still young \r\nWe never grew out of this feeling that we wont give up \r\n\r\nHere we lay again \r\nOn two separate beds \r\nRiding phone lines \r\nto meet a familiar voice \r\nAnd pictures drawn from memory \r\nWe reflect on miscommunications \r\nAnd misunderstandings \r\nAnd missing each other too \r\nMuch to have had to let go \r\n\r\nTurn our music down \r\nAnd we whisper \r\n\"Say what you're thinking right now\" \r\n\r\nTell me what you thought about when you were gone \r\nAnd so alone \r\nThe worst is over \r\nYou can have the best of me \r\nWe got older \r\nBut we're still young \r\nWe never grew out of this feeling that we wont give up \r\n\r\nJumping to conclusions \r\nMade me fall away from you \r\nI'm so glad that the truth has brought back together me and you \r\n\r\nWe're sitting on the ground and we whisper \r\n\"Say what you're thinking out loud\" \r\n\r\nTell me what you thought about when you were gone \r\nAnd so alone \r\nThe worst is over \r\nYou can have the best of me \r\nWe got older \r\nBut we're still young \r\nWe never grew out of this feeling that we wont give up \r\n\r\nTurn our music down \r\nAnd we whisper \r\nWe're sitting on the ground \r\nAnd we whisper \r\nWe turn our music down \r\nWe're sitting on the ground \r\nThe next time I'm in town \r\nWe will kiss girl \r\nWe will kiss girl \r\n\r\nTell me what you thought about when you were gone \r\nAnd so alone \r\nThe worst is over \r\ncan have the best of me \r\nWe got older \r\nBut we're still young \r\nWe never grew out of this feeling that we won't \r\nFeeling that we can't \r\nThat were not ready to give up \r\n\r\nWe got older, but we're still young \r\nWe never grew out of this feeling that we wont give up","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/fMxIuFMgt4U/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/fMxIuFMgt4U/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/fMxIuFMgt4U/hqdefault.jpg","width":480,"height":360}},"channelTitle":"aubschoosesjoy411","categoryId":"10","liveBroadcastContent":"none","localized":{"title":"Best of Me - The Starting Line lyrics","description":"Tell me what you thought about when you were gone \r\nAnd so alone \r\nThe worst is over \r\nYou can have the best of me \r\nWe got older \r\nBut we're still young \r\nWe never grew out of this feeling that we wont give up \r\n\r\nHere we lay again \r\nOn two separate beds \r\nRiding phone lines \r\nto meet a familiar voice \r\nAnd pictures drawn from memory \r\nWe reflect on miscommunications \r\nAnd misunderstandings \r\nAnd missing each other too \r\nMuch to have had to let go \r\n\r\nTurn our music down \r\nAnd we whisper \r\n\"Say what you're thinking right now\" \r\n\r\nTell me what you thought about when you were gone \r\nAnd so alone \r\nThe worst is over \r\nYou can have the best of me \r\nWe got older \r\nBut we're still young \r\nWe never grew out of this feeling that we wont give up \r\n\r\nJumping to conclusions \r\nMade me fall away from you \r\nI'm so glad that the truth has brought back together me and you \r\n\r\nWe're sitting on the ground and we whisper \r\n\"Say what you're thinking out loud\" \r\n\r\nTell me what you thought about when you were gone \r\nAnd so alone \r\nThe worst is over \r\nYou can have the best of me \r\nWe got older \r\nBut we're still young \r\nWe never grew out of this feeling that we wont give up \r\n\r\nTurn our music down \r\nAnd we whisper \r\nWe're sitting on the ground \r\nAnd we whisper \r\nWe turn our music down \r\nWe're sitting on the ground \r\nThe next time I'm in town \r\nWe will kiss girl \r\nWe will kiss girl \r\n\r\nTell me what you thought about when you were gone \r\nAnd so alone \r\nThe worst is over \r\ncan have the best of me \r\nWe got older \r\nBut we're still young \r\nWe never grew out of this feeling that we won't \r\nFeeling that we can't \r\nThat were not ready to give up \r\n\r\nWe got older, but we're still young \r\nWe never grew out of this feeling that we wont give up"}}}]},"iframeSrc":"https://www.youtube.com/embed/fMxIuFMgt4U?feature=oembed&enablejsapi=1&origin=http://safe.txmblr.com&wmode=opaque","song":{"permalink_url":"https://www.youtube.com/watch?v=fMxIuFMgt4U","title":"Best of Me - The Starting Line lyrics"}}},
  playlist: playlist._id
}

var soundcloud_song = {
  userid:1,
  song: {"action":"newSCSong","method":"","args":{"song":{"kind":"track","id":188658265,"created_at":"2015/01/30 16:52:27 +0000","user_id":14730,"duration":247401,"commentable":true,"state":"finished","original_content_size":10137923,"last_modified":"2015/02/03 18:10:45 +0000","sharing":"public","tag_list":"","permalink":"diplo-alvaro-6th-gear-gta-remix-feat-kstylis","streamable":true,"embeddable_by":"all","downloadable":false,"purchase_url":null,"label_id":null,"purchase_title":null,"genre":"Dance","title":"Diplo & Alvaro - 6th Gear (GTA Remix) [feat. Kstylis]","description":"Support on iTunes: http://smarturl.it/6thGearRemixes\nSupport on Beatport: btprt.dj/1zynkGw\nSupport on Amazon: http://amzn.to/1BSCS6f\n\nFirst released on Random White Dude Be Everywhere, Diplo & Alvaro throttled dance floors and festival stages into high gear with their track “6th Gear (feat. Kstylis)”.  \"6th Gear\" now receives an elite remix treatment from Mad Decent favorites GTA and ETC!ETC, plus an A+ squad of newcomers such as Ricky Remedy, Obscene & Big Syphe, and DJ Yonny and Grand & Warren. The official remix EP includes the original track plus 5 banging remixes, turning the track inside out with wild taste.\n\nFollow GTA\nSoundcloud: @GTA\nFacebook: http://www.facebook.com/WeAreGTA\nTwitter: http://twitter.com/weareGTA\n\nFollow Diplo\nSoundcloud: @diplo\nFacebook: http://www.facebook.com/diplo\nTwitter: http://twitter.com/diplo\n\nFollow Alvaro\nTwitter: twitter.com/djalvaro\nFacebook: facebook.com/alvaro\nSoundcloud: @djalvaro\n\nFollow Kstylis\nTwitter: www.twitter.com/kstylis\nFacebook: www.facebook.com/Teamkstylis\nSoundcloud: @kstylis","label_name":"Mad Decent","release":null,"track_type":null,"key_signature":null,"isrc":null,"video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"mp3","license":"all-rights-reserved","uri":"https://api.soundcloud.com/tracks/188658265","user":{"id":14730,"kind":"user","permalink":"maddecent","username":"Mad Decent","last_modified":"2015/02/03 18:39:34 +0000","uri":"https://api.soundcloud.com/users/14730","permalink_url":"http://soundcloud.com/maddecent","avatar_url":"https://i1.sndcdn.com/avatars-000112599114-5etg3g-large.jpg"},"permalink_url":"http://soundcloud.com/maddecent/diplo-alvaro-6th-gear-gta-remix-feat-kstylis","artwork_url":"https://i1.sndcdn.com/artworks-000105419019-x4c4ph-large.jpg","waveform_url":"https://w1.sndcdn.com/L2BYurmYW5qX_m.png","stream_url":"https://api.soundcloud.com/tracks/188658265/stream","playback_count":405472,"download_count":0,"favoritings_count":18102,"comment_count":271,"attachments_uri":"https://api.soundcloud.com/tracks/188658265/attachments","policy":"MONETIZE"},"iframeSrc":"https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/1886…e&show_comments=true&show_user=false&show_reposts=false&show_artwork=false","$$hashKey":"00G"}},
  playlist: 1
}

var spotify_song = {
  userid:1,
  song: {"action":"newSpotifySong","method":"","args":{"info":{"album":{"album_type":"single","available_markets":["CA","MX","US"],"external_urls":{"spotify":"https://open.spotify.com/album/3FHMLI0Vz2t0gdypH1yImX"},"href":"https://api.spotify.com/v1/albums/3FHMLI0Vz2t0gdypH1yImX","id":"3FHMLI0Vz2t0gdypH1yImX","images":[{"height":640,"url":"https://i.scdn.co/image/d8e78b7a8fb94ad1f3b8bae372f04b261dd9df7f","width":640},{"height":300,"url":"https://i.scdn.co/image/1ee3f29e92f78615a4278573663f405f0c07eae7","width":300},{"height":64,"url":"https://i.scdn.co/image/e9224f06708686b9b6c0210e768052b044410b7f","width":64}],"name":"Odd Look","type":"album","uri":"spotify:album:3FHMLI0Vz2t0gdypH1yImX"},"artists":[{"external_urls":{"spotify":"https://open.spotify.com/artist/0UF7XLthtbSF2Eur7559oV"},"href":"https://api.spotify.com/v1/artists/0UF7XLthtbSF2Eur7559oV","id":"0UF7XLthtbSF2Eur7559oV","name":"Kavinsky","type":"artist","uri":"spotify:artist:0UF7XLthtbSF2Eur7559oV"},{"external_urls":{"spotify":"https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ"},"href":"https://api.spotify.com/v1/artists/1Xyo4u8uXC1ZmMpatF05PJ","id":"1Xyo4u8uXC1ZmMpatF05PJ","name":"The Weeknd","type":"artist","uri":"spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ"}],"available_markets":["CA","MX","US"],"disc_number":1,"duration_ms":252853,"explicit":false,"external_ids":{"isrc":"FRS711300690"},"external_urls":{"spotify":"https://open.spotify.com/track/3Q6mwJseOFYBJ10d5CXp4o"},"href":"https://api.spotify.com/v1/tracks/3Q6mwJseOFYBJ10d5CXp4o","id":"3Q6mwJseOFYBJ10d5CXp4o","name":"Odd Look","popularity":57,"preview_url":"https://p.scdn.co/mp3-preview/488c0002f7872ae49c48d086810b91e4dd987ca9","track_number":1,"type":"track","uri":"spotify:track:3Q6mwJseOFYBJ10d5CXp4o"},"iframeSrc":"http://embed.spotify.com/?uri=spotify:track:3Q6mwJseOFYBJ10d5CXp4o&view=coverart","song":{"permalink_url":"https://open.spotify.com/track/3Q6mwJseOFYBJ10d5CXp4o","title":"Odd Look"}}},
  playlist: 1
}


describe('Song Model', function() {
  before(function(done) {
    // Clear songs before testing
    Song.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    Song.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no songs', function(done) {
    Song.find({}, function(err, songs) {
      songs.should.have.length(0);
      done();
    });
  });

  it('should add a Youtube song', function(done) {
    Song.createSong(youtube_song, function(err, createdSong) {

      createdSong.tag.should.equal('fMxIuFMgt4U');
      createdSong.title.should.equal('The Starting Line lyrics');
      createdSong.artist.should.equal('Best of Me');
      createdSong.link.should.equal('https://www.youtube.com/watch?v=fMxIuFMgt4U');
      createdSong.source.should.equal('YouTube');
      done();
    });
  });

  //  it('should add a Soundcloud song', function(done) {
  //   Song.createSong(soundcloud_song, function(err, createdSong) {

  //     createdSong.tag.should.equal('188658265');
  //     createdSong.title.should.equal('Diplo & Alvaro - 6th Gear (GTA Remix) [feat. Kstylis]');
  //     createdSong.artist.should.equal('Mad Decent');
  //     createdSong.link.should.equal('http://soundcloud.com/maddecent/diplo-alvaro-6th-gear-gta-remix-feat-kstylis');
  //     createdSong.source.should.equal('SoundCloud');
  //     done();
  //   });
  // });

  //   it('should add a Spotify song', function(done) {
  //   Song.createSOng(spotify_song, function(err, createdSong) {

  //     createdSong.tag.should.equal('3Q6mwJseOFYBJ10d5CXp4o');
  //     createdSong.title.should.equal('Odd Look');
  //     createdSong.artist.should.equal('Kavinsky');
  //     createdSong.link.should.equal('https://open.spotify.com/track/3Q6mwJseOFYBJ10d5CXp4o');
  //     createdSong.source.should.equal('Spotify');
  //     done();
  //   });
  // });
});

