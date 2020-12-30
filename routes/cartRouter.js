var express = require('express');
var db = require('../select');
var cartRepo = require('./cartRepo');
//const { route } = require('./LoginRoutes');
var router = express.Router();

router.get('/', (req, res) => {
    if (req.session.account) {
        var sql = `select ISBN,Name,cost,amoutBook,concat(ISBN,'.jpg') as Image from cart join book on BookID=ISBN where customerID='${req.session.account.ID}';`;
        db.query(sql, function(err, value) {
            if (err) {
                throw err;
            } else {
                console.log(value)
                db.query(`select sum((cost*amoutBook))as total from cart join book on BookID=ISBN where customerID='${req.session.account.ID}';`,
                    function(err, value1) {

                        db.query(`select * from Transfer;`, function(error, value2) {
                            db.query(`select count(*) as count from cart where customerID=${req.session.account.ID} group by (customerID)`, function(error, value3) {
                                var total = 0;
                                if (value1[0].total != null)
                                    rtotal = value1[0].total;
                                else rtotal = 0;
                                console.log(value1)
                                var vm = {
                                    items: value,
                                    total: rtotal, //value1[0].total,
                                    thanhtoan: value2,
                                    isEmpty: req.session.cart.length === 0,
                                    diaChi: req.session.account.Address,
                                    SDT: req.session.account.PhoneNumber,
                                    url: "/cart"
                                };
                                if (JSON.stringify(value3) === '[]')
                                    req.session.lenCart = 0; //value1[0].count;
                                else req.session.lenCart = value3[0].count;
                                res.render('cart/cart', vm);
                            });

                        })

                    });
            }
        });
    } else {
        var vm = {
            showError: true,
            errorMsg: "Bạn phải đăng nhập với tư cách nhân viên"
        };
        res.redirect('/')
    }
    // res.render('./cart/cart');
});

router.post('/add', (req, res) => {
    // console.log(req.body.idSach);
    if (req.session.isLogged){
    db.query(`call update_amount('${req.body.idSach}','${req.session.account.ID}')`, function(error, value) {
        if (error) {
            console.log(error)
            res.redirect(req.session.reUrl);
        } else {
            db.query(`select count(*) as count from cart where customerID=${req.session.account.ID} group by (customerID)`, function(error, value3) {
                // var sql = `call searchbyISBN('${req.body.idSach}')`;
                // db.query(sql, function(err, value) {
                //     if (err) {
                //         throw err;
                //     } else {
                // var item = {
                //     idSach: req.body.idSach,
                //     ten_sach: value[0][0].BookName,
                //     giaBan: value[0][0].Cost,
                //     hinh: value[0][0].Image,
                //     sl: +req.body.sl,
                //     amount: value[0][0].Cost * +req.body.sl
                // };
                // cartRepo.add(req.session.cart, item);
                if (JSON.stringify(value3) === '[]')
                    req.session.lenCart = 0; //value1[0].count;
                else req.session.lenCart = value3[0].count;
                res.redirect(req.session.reUrl);
            });
        }
    });
}
else {
    res.redirect(req.session.reUrl);
}
});

router.post('/sl', (req, res) => {
    // cartRepo.updateSL(req.session.cart, req.body.idSach, req.body.sl);
    db.query(`update cart set amoutBook=${req.body.sl} where ${req.query.id}=BookID and ${req.session.account.ID}=customerID;`, function(error, value) {
        if (error) {
            console.log(error)
            var vm = {
                showError: true,
                errorMsg: error.sqlMessage
            };
            res.redirect('/cart');
        } else {
            // db.query(`select count(*) as count from cart where customerID=${req.session.account.ID} group by (customerID)`,function(error, value1){
            //     req.session.lenCart=value1[0].count;
            res.redirect('/cart');
            //     });
        }
    })

});

// router.get('/delete', (req, res) => {
//     var vm = {
//         idSach: req.query.id
//     };
//     res.render('cart/deleteSanPham', vm);
// });
router.post('/delete', (req, res) => {
    db.query(`delete from cart where ${req.query.id}=BookID and ${req.session.account.ID}=customerID;`, function(err, value) {
            if (err) {
                console.log(err)
                res.redirect('/cart');
            } else {
                // db.query(`select count(*) as count from cart where customerID=${req.session.account.ID} group by (customerID)`,function(error, value1){
                //     req.session.lenCart=value1[0].count;
                res.redirect('/cart');
                // })
            }

        })
        // SPRePo.delete(req.body.idSach).then(value => {
        //     res.redirect('/cart/sanpham');
        // });
});

router.post('/remove', (req, res) => {
    cartRepo.remove(req.session.cart, req.body.ProId);
    res.redirect(req.headers.referer);
});

router.post('/tt', (req, res) => {
    if (req.session.isLogged) {
        // var date = new Date().toLocaleString().slice(0, 19).replace('T', ' ');
        db.query(`select BookID,amoutBook from cart where customerID='${req.session.account.ID}'`, function(err, val) {
            if (err) {
                console.log(err)
                res.redirect('/cart');
            } else {
                for (var i in val) {
                    db.query(`call update_tt(${req.session.account.ID},${val[i].BookID},${req.body.thanhtoan},${val[i].amoutBook},1)`, function(error, value) {
                        if (error) {
                            console.log(error)
                        }
                    })

                }
                res.redirect('/cart');
            }

        });
    }
});


module.exports = router;