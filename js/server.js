var http = require('http');
var https = require('https');

var server = http.createServer(function (request, response) {
}).listen(63342);

var WebSocketServer = require('websocket').server;

var wss = new WebSocketServer({
    httpServer: server
});

wss.on('request', function (request) {
    var connection = request.accept(null, request.origin);

    //Create event listener
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            //https://translate.google.com.ua/translate_a/single?client=t&sl=de&tl=ru&dt=bd&dt=t&q=Hallo
            //https://translate.google.com.ua/translate_a/single?client=t&sl=de&tl=ru&hl=en&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&ie=UTF-8&oe=UTF-8&source=bh&ssel=0&tsel=0&kc=1&tk=522569|847742&q=Hallo
            var options = {
                host: 'translate.google.com',
                port: 443,
                path: '/translate_a/single?client=p' +
                '&sl=de' +
                '&tl=en' +
                '&dt=bd' +
                '&dt=t' +
                '&q=' + message.utf8Data,
                method: 'GET'
            };
            var req = https.request(options, function (res) {
                var fullAnswer = "";
                res.on('data', function (d) {
                    fullAnswer += d.toString();
                }).on('end', function () {
                    connection.send(getTranslation(fullAnswer));
                });
            });
            req.end();

            req.on('error', function (e) {
                console.error(e);
            });
        }
    });
    connection.on('close', function () {
    });
});

function getTranslation(googleAnswer) {
    //var obj = JSON.parse(newString);
    return googleAnswer.replace(/,(?=,)/g, ',""');
}




