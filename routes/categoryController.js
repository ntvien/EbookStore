/**
 * Created by tutrinh on 6/2/18.
 */
var express = require('express');

var helpers = require('handlebars-helpers')();


var router = express.Router();

var db = require('../select');


// router.get('/', (req, res) => {
//     var sql1 = `select * from field`;
//     var sql2 = `select * from book`;
//     var sql3 = `select * from publisher`;
//     db.query(sql1, function(err, res1) {
//         if (err) throw err;
//         else{
//             db.query(sql2, function(err, res2) {
//                 if (err) throw err;
//                 else {
//                     db.query(sql3, function(err, res3){
//                         if (err) throw err;
//                         else{
//                             Promise.all([res1, res2,res3]).then(([rowloais, rowBooks,rowNhaSXs]) => {
//                                 req.session.reUrl = "/tim-kiem";                
//                                 var vm = {
//                                     url:"/tim-kiem",
//                                     loai: rowloais,
//                                     book:rowBooks,
//                                     NhaSX:rowNhaSXs
//                                 };
//                                 // console.log(res1);
//                                 // console.log(res2);
//                                 // console.log(res3);
//                                 res.render('search/tim-kiem', vm);
//                             });
//                         };
//                     });
//                 }
//             });
//         };
//     });
    
// });

router.get('/theo-loai/', (req, res) => {
    console.log('entering')
    console.log(req.query);
    var sql0 = `select * from Field where AField = '${req.query.tenLoai}'`;
    
    var sql1 = `select distinct AField from field`;
    // var sql1 = `select * from book`;
    var sql2 = `select * from publisher`;
    var sql3 = `call bookwcate('${req.query.tenLoai}')`;
    db.query(sql1, function(err, res1) {
        if (err) throw err;
        else{
            db.query(sql2, function(err, res2) {
                if (err) throw err;
                else {
                    db.query(sql3, function(err, res3) {
                        if (err) throw err;
                        else{
                            db.query(sql0, function(err, res0){
                                if (err) throw err;
                                else{
                                    Promise.all([res1, res2, res3, res0]).then(([menu,nxb, rowBooks, byLoai]) => {
                                        console.log('menu')
                                        console.log(menu)
                                        console.log('nxb')
                                        console.log(nxb)
                                        
                                        console.log('rowbooks')
                                        console.log(rowBooks[0]);
                                        console.log('byLoai')
                                        console.log(byLoai)
                                        req.session.reUrl = "/tim-kiem/theo-loai/?tenLoai="+req.query.tenLoai;
                                        var vm = {
                                            loai: menu,
                                            book:rowBooks[0],
                                            NhaSX:nxb,
                                            loaifull:byLoai,
                                            url : "/tim-kiem/theo-loai/?tenLoai="+req.query.tenLoai
                                
                                        };
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
    // var p3 =categoryRepo.load_by_idLoai(req.query.id); // tenLoai
    // var p5= categoryRepo.loadL(req.query.id);
});
// router.get('/theo-NhaSX/', (req, res) => {
//     var p3 =categoryRepo.load_by_idNhaSX(req.query.id);

//     var p5=categoryRepo.loadNXB(req.query.id);
//     Promise.all([p1, p3,p4,p5]).then(([rowloais, rowBooks,rowNhaSXs,tenNXB]) => {
//         req.session.reUrl = "/tim-kiem/theo-NhaSX/?id="+req.query.id;
//         var vm = {
//             loai: rowloais,
//             book:rowBooks,
//             NhaSX:rowNhaSXs,
//             tenNXB:tenNXB[0],
//             url : "/tim-kiem/theo-NhaSX/?id="+req.query.id
//         };
//         res.render('search/theo-nhasx', vm);
//     });

// });

// router.get('/theo-gia/', (req, res) => {
//     var p3 = categoryRepo.search_with_price(req.query.giadau,req.query.giacuoi);
//     Promise.all([p1, p3,p4]).then(([rowloais, rowBooks,rowNhaSXs]) => {
//         req.session.reUrl = "/tim-kiem/theo-gia/?giadau=" + req.query.giadau + "&giacuoi=" + req.query.giacuoi;
//         var vm = {
//             loai: rowloais,
//             book:rowBooks,
//             NhaSX:rowNhaSXs,
//             keyword: req.query.giadau,
//             keyword2: req.query.giacuoi,
//             url : "/tim-kiem/theo-gia/?giadau=" + req.query.giadau + "&giacuoi=" + req.query.giacuoi
//         };
//         // console(rowloais)

//         res.render('search/tim-theo-loai', vm);
//     });

// });
module.exports = router;