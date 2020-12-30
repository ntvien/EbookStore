/**
 * Created by tutrinh on 6/2/18.
 */
var express = require('express');

var helpers = require('handlebars-helpers')();


var router = express.Router();

var db = require('../select');


router.get('/', (req, res) => {
    var sql1 = `select distinct AField from field`;
    var sql2 = `select * from book join writtenby on bookisbn = isbn join author on ssn = authorssn`;
    var sql3 = `select * from publisher`;
    db.query(sql1, function(err, res1) {
        if (err) throw err;
        else {
            db.query(sql2, function(err, res2) {
                if (err) throw err;
                else {
                    db.query(sql3, function(err, res3) {
                        if (err) throw err;
                        else {
                            Promise.all([res1, res2, res3]).then(([rowloais, rowBooks, rowNhaSXs]) => {
                                req.session.reUrl = "/tim-kiem";
                                var vm = {
                                    url: "/tim-kiem",
                                    loai: rowloais,
                                    book: rowBooks,
                                    NhaSX: rowNhaSXs
                                };
                                // console.log('asasas')
                                // console.log('loai')
                                // console.log(rowloais)
                                // console.log('books')
                                // console.log(rowBooks)
                                // console.log('nhasx')
                                // console.log(rowNhaSXs)
                                res.render('search/tim-kiem', vm);
                            });
                        };
                    });
                }
            });
        };
    });

});

router.get('/theo-loai/', (req, res) => {
    console.log('entering')
    console.log(req.query);
    var sql0 = `select  distinct AField from Field where AField = '${req.query.tenLoai}'`;
    var sql1 = `select distinct AField from field`;
    var sql2 = `select * from publisher`;
    var sql3 = `call bookwcate('${req.query.tenLoai}')`;
    db.query(sql1, function(err, res1) {
        if (err) throw err;
        else {
            db.query(sql2, function(err, res2) {
                if (err) throw err;
                else {
                    db.query(sql3, function(err, res3) {
                        if (err) throw err;
                        else {
                            db.query(sql0, function(err, res0) {
                                if (err) throw err;
                                else {
                                    Promise.all([res1, res2, res3, res0]).then(([menu, nxb, rowBooks, byLoai]) => {
                                        req.session.reUrl = "/tim-kiem/theo-loai/?tenLoai=" + req.query.tenLoai;
                                        var vm = {
                                            loai: menu,
                                            book: rowBooks[0],
                                            NhaSX: nxb,
                                            loaifull: byLoai[0],
                                            url: "/tim-kiem/theo-loai/?tenLoai=" + req.query.tenLoai

                                        };
                                        // console.log('menu')
                                        // console.log(menu)
                                        // console.log('nxb')
                                        // console.log(nxb)
                                        // console.log('rowBooks')
                                        // console.log(rowBooks)
                                        // console.log('byLoai')
                                        // console.log(byLoai[0])
                                        res.render('search/tim-theo-loai', vm);
                                    });
                                }
                            })
                        }
                    });


                }
            });
        }
    });
});

router.get('/theo-NhaSX/', (req, res) => {
    // var p3 =categoryRepo.load_by_idNhaSX(req.query.id);
    var sql1 = `select distinct AField from field`;
    var sql2 = `select * from publisher`;
    var sql3 = `select distinct ISBN, Cost, b.name as BookName, PubName, AField, concat_ws(" ", FName,\
    MName, LName) as AuthName from book b join field on b.isbn = bookid join writtenby on bookisbn = b.isbn \
    join author on ssn = authorssn join publisher p on pubname = p.name where p.code = '${req.query.id}' `;
    var sql4 = `select * from publisher where code = '${req.query.id}'`;

    db.query(sql1, function(err, res1) {
        if (err) throw err;
        else {
            db.query(sql2, function(err, res2) {
                if (err) throw err;
                else {
                    db.query(sql3, function(err, res3) {
                        if (err) throw err;
                        else {
                            db.query(sql4, function(eff, res4) {
                                Promise.all([res1, res2, res3, res4]).then(([rowloais, rowNhaSXs, rowBooks, tenNXB]) => {
                                    req.session.reUrl = "/tim-kiem/theo-NhaSX/?id=" + req.query.id;
                                    var vm = {
                                        loai: rowloais,
                                        book: rowBooks,
                                        NhaSX: rowNhaSXs,
                                        tenNXB: tenNXB[0],
                                        url: "/tim-kiem/theo-NhaSX/?id=" + req.query.id
                                    };
                                    res.render('search/theo-nhasx', vm);
                                });
                            });
                        }
                    });
                }
            });
        }
    });



});

router.get('/theo-nam/', (req, res) => {
    // var p3 = categoryRepo.search_with_price(req.query.giadau,req.query.giacuoi);

    var sql0 = `Select * from book where year>='${req.query.namdau}' and year<'${req.query.namcuoi}'`;
    var sql1 = `select distinct AField from field`;
    var sql2 = `select * from publisher`;
    db.query(sql1, function(err, res1) {
        if (err) throw err;
        else {
            db.query(sql2, function(err, res2) {
                if (err) throw err;
                else {
                    db.query(sql0, function(err, res0) {
                        Promise.all([res1, res2, res0]).then(([rowloais, rowNhaSXs, rowBooks]) => {
                            req.session.reUrl = "/tim-kiem/theo-nam/?namdau=" + req.query.namdau + "&namcuoi=" + req.query.namcuoi;
                            var vm = {
                                loai: rowloais,
                                book: rowBooks,
                                NhaSX: rowNhaSXs,
                                keyword: req.query.namdau,
                                keyword2: req.query.namcuoi,
                                url: "/tim-kiem/theo-nam/?namdau=" + req.query.namdau + "&namcuoi=" + req.query.namcuoi
                            };
                            // console(rowloais)

                            res.render('search/tim-theo-loai', vm);
                        });
                    });
                }
            });
        }
    });


});
module.exports = router;