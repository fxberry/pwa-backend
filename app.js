var express = require('express');
var cors = require('cors');
var app = express();

var originsWhitelist = [
  'http://localhost:8080',
  'http://localhost:8888',
  'http://127.0.0.1'
];

var corsOptions = {
  origin: function(origin, callback){
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
  }
  //,credentials:true
}

//here is the magic
app.use(cors(corsOptions));

const webpush = require('web-push');
let pushSubscription = null;

const publicVapidKey = 'YOUR PUBLIC KEY';
const privateVapidKey = 'YOUR PUBLIC KEY';

webpush.setVapidDetails('mailto:my@email.com', publicVapidKey, privateVapidKey);

app.use(require('body-parser').json());

var apiFunction = function (req, res) {
  setTimeout(() => res.send(new Date()), 1000);
}

app.get('/first', apiFunction);

app.get('/second', apiFunction);

app.get('/third', apiFunction);

app.post('/subscribe', (req, res) => {
  pushSubscription = req.body;
  res.status(201).json({});
  console.log('Push Subscribtion', req.body);
});

app.post('/notifyme', (req, res) => {
  const payload = JSON.stringify({ notification:{
    'title': '2do PWA',
    'body': 'Something happened, do you like to update?',
    'icon': 'assets/icons/icon-128x128.png',
    'vibrate': [100, 50, 100],
    'data': {
       'id': 1,
       'name': 'Felix',
   'checked': true,
   'lastModified': '2019-05-03T14:25:43.511Z'
    },
   'actions': [{
       'action': 'update',
       'title': 'Lets see what happened!'
  }]
}
});
// console.log(pushSubscription.toString());

  webpush.sendNotification(pushSubscription, payload).catch(error => {
    console.error(error.stack);
  });

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
