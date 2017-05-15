var multer = require('multer');
var https = require('https');
var http = require('http');
var fs = require('fs');
var sha1 = require('sha1');
var config = require('../config.js');
var Form = require('../models/form.js');


var appId = config.wxConfig.appId;
var secret = config.wxConfig.appSecret;
var timestamp = config.wxConfig.timestamp
var noncestr = config.wxConfig.nonceStr;
var url = config.wxConfig.url;
var accessToken = "";
var jsapi_ticket = "";
var signature = "";
getAccessToken(appId, secret);



module.exports = function(app) {
    app.get('/', function(req, res, next) {
        res.render('index', { title: '“家书抵万金”朗读大赛' });
    });

    app.get('/signup', function(req, res, next) {
        res.render('signup', {
            title: '“家书抵万金”朗读大赛',
            appId: config.wxConfig.appId,
            signature: req.query.signature,
            timestamp: req.query.timestamp,
            nonceStr: req.query.nonce
        });
    });

    app.get('/success', function(req, res, next) {
        res.render('success', { title: '“家书抵万金”朗读大赛' });

    });


    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            if (file.mimetype.indexOf('image') >= 0) {
                cb(null, './uploads/images')
            } else if (file.mimetype.indexOf('audio') >= 0) {
                cb(null, './uploads/audios')
            } else {
                cb(null, './uploads')
            }
        },
        filename: function(req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + "." + file.mimetype.split('/')[1]);
        }
    })

    var upload = multer({ storage: storage })
    var cpUpload = upload.fields([{ name: 'img1', maxCount: 1 }, { name: 'img2', maxCount: 1 }, { name: 'img3', maxCount: 1 }]);

    app.post('/signup', cpUpload, function(req, res, next) {

        var name = req.body.name;
        var tel = req.body.tel;
        var original = req.body.original;
        var audioId = req.body.audio;
        var audio = {
            fieldname: 'audio',
            mimetype: '',
            destination: './uploads/audios',
            filename: '',
            path: '',
            size: ''
        };
        // console.log(name + tel + original);
        //判断req.files['name']是否undefined
        var img1 = '';
        var img2 = '';
        var img3 = '';
        // var audio = '';

        if (req.files['img1']) {
            img1 = req.files['img1'][0];
            // saveImg(img1, targetDir);
        }
        if (req.files['img2']) {
            img2 = req.files['img2'][0];
            // saveImg(img2, targetDir);
        }
        if (req.files['img3']) {
            img3 = req.files['img3'][0];
            // saveImg(img3, targetDir);
        }
        // if (req.files['audio']) {
        //     audio = req.files['audio'][0];
        //     // saveImg(img3, targetDir);
        // }
        // var img2 = req.files['img2'][0];
        // var img3 = req.files['img3'][0];
        // console.log(img1);

        //根据audioId从微信服务器下载音频文件
        function downloadFile(accessToken, mediaId) {
            var url = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=" + accessToken + "&media_id=" + mediaId;
            http.get(url, function(res) {
                audio.mimetype = res.headers['content-type'];
                res.setEncoding("binary");
                var fileName = "audio-" + Date.now() + "." + audio.mimetype.split('/')[1];
                audio.filename = fileName;
                audio.path = "uploads\\audios\\" + fileName;
                audio.size = res.headers['content-length'];

                var rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {
                    try {
                        fs.writeFile("./uploads/audios/" + fileName, rawData, "binary", function(err) {
                            if (err) throw err;
                            // console.log('The file has been saved!');
                        });

                        //表单存储到数据库
                        var form = new Form(name, tel, original, img1, img2, img3, audio);
                        form.save(function(err) {
                            if (err) {
                                req.flash('error', err);
                                return res.redirect('/signup');
                            }
                            res.redirect('/success');
                        })

                    } catch (e) {
                        console.error(e.message);
                    }
                });
            })
        }
    });

    app.post('/getWeChatConfig', function(req, res) {
        var signature = req.query.signature;
        var timestamp = req.query.timestamp;
        var nonceStr = req.query.nonce;
        var appId = config.wxConfig.appId;

        res.json({
            appId: appId,
            timestamp: timestamp,
            signature: signature,
            nonceStr: nonceStr
        })
    });

};

function getAccessToken(appId, secret) {
    https.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appId=" + appId + "&secret=" + secret, function(res) {
        res.setEncoding('utf8');
        var rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                accessToken = parsedData.access_token;
                getjsApiTicket(accessToken)
            } catch (e) {
                console.error(e.message);
            }
        });
    });
}

function getjsApiTicket(accessToken) {
    https.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + accessToken + "&type=jsapi", function(res) {
        res.setEncoding('utf8');
        var rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                jsapi_ticket = parsedData.ticket;
                getJsSdkSignature(jsapi_ticket, noncestr, timestamp, url);
            } catch (e) {
                console.error(e.message);
            }
        });
    });
}

function getJsSdkSignature(jsapi_ticket, noncestr, timestamp, url) {
    var string = "jsapi_ticket=" + jsapi_ticket;
    string += "&noncestr=" + noncestr;
    string += "&timestamp=" + timestamp;
    string += "&url=" + url;
    var signature = sha1(string);
    return signature;
}