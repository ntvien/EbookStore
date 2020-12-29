var db = require('../select');
var express = require('express');
var helpers = require('handlebars-helpers')();

var router = express.Router();




router.get('/', (req, res) => {
var skeyword = req.query.keyword;
var idMuc = req.query.selectDanhMuc;
console.log(skeyword);
console.log(idMuc);
    if(idMuc==2)
{
    var sql = `Select * from book where name like '%${skeyword}%'`;
    console.log(sql)
    db.query(sql, function(err, val) {
        if (err) throw err;
        else {
            console.log(val);
            Promise.all([val]).then(([rowBooks]) => {
                var vm = {
                    book: rowBooks,
                    keyword: req.query.keyword,
                    url : "/tim-voi-key?selectDanhMuc=" + req.query.selectDanhMuc + "&keyword=" + req.query.keyword
             
                };
                req.session.reUrl = "/tim-voi-key?selectDanhMuc=" + req.query.selectDanhMuc + "&keyword=" + req.query.keyword;
                res.render('search/tim-theo-loai', vm);
            });
        };
    });
}
// else if(idMuc==3)
// {
//     var sql = `Select * from book where tac_gia like '%${keyword}%'`;

// }
// else if(idMuc==4){
//     var sql = `Select * from book,NhaSX where book.idNhaSX=NhaSX.idNhaSX and tenNhaSX like '%${keyword}%'`;

// }
// else {
//     var sql = `Select distinct idSach,ten_sach, giaBan,hinhAnh,tac_gia from book,NhaSX where book.idNhaSX=NhaSX.idNhaSX and tenNhaSX like '%${keyword}%' or
//     ten_sach like '%${keyword}%' or tac_gia like '%${keyword}%'`;

// }


});

module.exports = router;