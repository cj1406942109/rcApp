var multer = require('multer');

var Form = require('../models/form.js');

module.exports = function(app) {
    app.get('/', function(req, res, next) {
        res.render('index', { title: '“家书抵万金”朗读大赛' });
    });

    app.get('/signup', function(req, res, next) {
        res.render('signup', { title: '“家书抵万金”朗读大赛' });
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
    var cpUpload = upload.fields([{ name: 'img1', maxCount: 1 }, { name: 'img2', maxCount: 1 }, { name: 'img3', maxCount: 1 }, { name: 'audio', maxCount: 1 }]);
    app.post('/signup', cpUpload, function(req, res, next) {

        var name = req.body.name;
        var tel = req.body.tel;
        var original = req.body.original;

        // console.log(name + tel + original);
        //判断req.files['name']是否undefined
        var img1 = '';
        var img2 = '';
        var img3 = '';
        var audio = '';

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
        if (req.files['audio']) {
            audio = req.files['audio'][0];
            // saveImg(img3, targetDir);
        }
        // var img2 = req.files['img2'][0];
        // var img3 = req.files['img3'][0];
        // console.log(img1);
        var form = new Form(name, tel, original, img1, img2, img3, audio);
        form.save(function(err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/signup');
            }
            res.redirect('/success');
        })
    });
};