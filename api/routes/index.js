var multer = require('multer');
var https = require('https');
var http = require('http');
var fs = require('fs');
var sha1 = require('sha1');
var path = require('path');
var signature = require('../signature');
var config = require('../config.js');
var Form = require('../models/form.js');

var wxConfig = config.wxConfig;

var createSignature = signature.getSignature(wxConfig);
var accessToken = '';

module.exports = function(app) {

    app.get('/getWxConfig', function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        var url = req.body.url;
        // console.log(url);
        // var url = 'http://www.zhuiqiuwang.net/wx/';
        createSignature(url, function(error, result) {
            accessToken = result.token;
            if (error) {
                res.json({
                    'error': error
                });
            } else {
                res.json(result);
            }
        });
    })
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
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        var name = req.body.name;
        var tel = req.body.tel;
        var original = req.body.original;
        var audioId = req.body.audio;
        var audio = {
            localId: audioId,
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
        // downloadFile()
        downloadFile(accessToken, audioId);
        res.json({
            message: 'success'
        });
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
                                // req.flash('error', err);
                                // return res.redirect('/signup');
                                console.log(err);
                            }

                        })

                    } catch (e) {
                        console.error(e.message);
                    }
                });
            })
        }
    });


};