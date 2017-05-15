var mongodb = require('./db');

function Form(name, tel, original, img1, img2, img3, audio) {
    this.name = name;
    this.tel = tel;
    this.original = original;
    this.img1 = img1;
    this.img2 = img2;
    this.img3 = img3;
    this.audio = audio;
}

module.exports = Form;

//存储报名表的信息
Form.prototype.save = function(callback) {
    var date = new Date();

    //存储各种时间格式
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };

    //要存入数据库的文档
    var form = {
        time: time,
        name: this.name,
        tel: this.tel,
        original: this.original,
        img1: this.img1,
        img2: this.img2,
        img3: this.img3,
        audio: this.audio
    };

    //打开数据
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }

        //读取posts集合
        db.collection('forms', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            //将文档插入posts集合
            collection.insert(form, {
                safe: true
            }, function(err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

//根据电话获取报名表信息
Form.getByPhone = function(tel, callback) {
    //打开数据库
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }

        //读取forms集合
        db.collection('forms', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (tel) {
                query.tel = tel;
            }

            //根据query对象查询
            collection.find(query).sort({
                time: -1
            }).toArray(function(err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    });
};

//获取所有报名表信息
Form.getAll = function(callback) {
    //打开数据库
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }

        //读取form集合
        db.collection('form', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //根据query对象查询
            collection.find().sort({
                time: -1
            }).toArray(function(err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    });
};