var MyApp = angular.module('Dictionary', []);

MyApp.factory('SocketService', function() {
    // init socket
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    var connection = new WebSocket('ws://localhost:63342/');

    connection.onopen = function () {
        // connection is opened and ready to use
    };

    connection.onerror = function (error) {
        console.log(error.text);
        // an error occurred when sending/receiving data
    };

    connection.onmessage = function (message) {
        // try to decode json (I assume that each message from server is json)
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        // handle incoming message
        console.log(message);
    };

    return {
        sendToServer: function(word) {
            connection.send(word);
        }
    };
});

MyApp.controller('VoiceCtrl', function ($scope, SocketService) {
    $scope.language = "Deutsch Female";
    $scope.translateWord = function() {
        SocketService.sendToServer($scope.word);
    };
});