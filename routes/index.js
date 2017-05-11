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

    app.post('/signup', function(req, res) {
        var name = req.body.name;
        var tel = req.body.tel;
        var original = req.body.original;
    });
};