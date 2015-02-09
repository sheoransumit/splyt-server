'use strict';

angular.module('splytApp')
    .controller('UserManageCtrl', function($scope, Auth, manage, user) {

        //Getting Playlists
        var getPlaylistPromise = manage.getPlaylists();

        getPlaylistPromise.success(function(playlists) {
            $scope.playlists = [];
            for (var i = 0; i < playlists.length; i++) {
                if (playlists[i].friend_stream === false) {
                    $scope.playlists.push(playlists[i]);
                }
            }
        });
        //Get Followers and Subscriptions 
        var getFollowersandSubscriptionsPromise = user.getFollowersandSubscriptions();

        getFollowersandSubscriptionsPromise.success(function(user){
            $scope.currentUserSubscriptions = user.subscriptions;
            $scope.currentUserFollowers = user.followers;
        })
        //Gets users
        
        $scope.getUsers = function(selectedUser){
            var getUsersPromise = user.getUsers(selectedUser)
            getUsersPromise.success(function(data){
                if(!data){console.log("no users")}
                    else{
                        $scope.userList = data;
                    }
            })
        }

        //Get Specific Playlist
        $scope.getSpecificPlaylist = function(index){
            $scope.currentPlaylist = $scope.playlists[index];
            var getSpecificPlaylistPromise = manage.getSpecificPlaylist($scope.playlists[index]);
            getSpecificPlaylistPromise.success(function(onePlaylist){
                $scope.currentPlaylistSongs = onePlaylist.songs;
            })
        }

        //Create Playlist
        $scope.newPlaylist = {};

        $scope.createPlaylist = function() {
            var createPlaylistPromise = manage.createPlaylist($scope.newPlaylist);
            createPlaylistPromise.success(function(playlist){
                $scope.playlists.push(playlist);
            })
        }

        //Delete Playlist
        $scope.removePlaylist = function(index){
            var removePlaylistPromise = manage.removePlaylists($scope.playlists[index]);
            $scope.playlists.splice(index, 1);
        }


        //Subscribe
        $scope.subscribe = function(index){
            if($scope.currentUserSubscriptions.indexOf($scope.userList[index]) === -1){
                var subscribePromise = user.setSubscription($scope.userList[index]);
                subscribePromise.success(function(subscription){
                    $scope.currentUserSubscriptions.push($scope.userList[index]);
                })
            }
            else{
                console.log('already subscribed');
            }
        }

        //Remove subscriptions
        $scope.removeSubscription = function(index){
            console.log('front end', $scope.currentUserSubscriptions[index])
            var removeSubscriptionPromise = user.removeSubscription($scope.currentUserSubscriptions[index]);
            $scope.currentUserSubscriptions.splice(index, 1);
        }

        //Get specific User
        $scope.getSpecificUser = function(index){

        }
        //Remove Song from Playlist 
        $scope.removeSongfromPlaylist = function(index){
            console.log('front end', $scope.currentPlaylistSongs[index])
            console.log('currentPlaylist', $scope.currentPlaylist);
            var removeSongfromPlaylistPromise = manage.removeSongfromPlaylist($scope.currentPlaylist, $scope.currentPlaylistSongs[index]);
            $scope.currentPlaylistSongs.splice(index, 1);
        }






















    });