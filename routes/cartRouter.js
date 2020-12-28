var express = require('express');
var db = require('../select');
var cartRepo = require('./cartRepo');
//const { route } = require('./LoginRoutes');
var router = express.Router();

router.get('/', (req, res) => {
    if (req.session.account) {
        var sql = `select * from customer where id = '${req.session.account.ID}'`;
        db.query(sql, function(err, value) {
            if (err) {
                throw err;
            } else {
                console.log(value[0])
                var vm = {
                    items: req.session.cart,
                    total: cartRepo.getTotal(req.session.cart),
                    isEmpty: req.session.cart.length === 0,
                    diaChi: value[0].Address,
                    SDT: value[0].PhoneNumber,
                    url: "/cart"
                };
                res.render('cart/cart', vm);
            }
        });
    } else {
        var vm = {
            items: req.session.cart,
            total: cartRepo.getTotal(req.session.cart),
            isEmpty: req.session.cart.length === 0,
            url: "/cart"
        };
        res.render('cart/cart', vm);
    }
    // res.render('./cart/cart');
});

router.post('/add', (req, res) => {
    console.log(req.body.idSach);
    var sql = `call searchbyISBN('${req.body.idSach}')`;
    db.query(sql, function(err, value) {
        if (err) {
            throw err;
        } else {
            var item = {
                idSach: req.body.idSach,
                ten_sach: value[0][0].BookName,
                giaBan: value[0][0].Cost,
                hinh: value[0][0].Image,
                sl: +req.body.sl,
                amount: value[0][0].Cost * +req.body.sl
            };
            cartRepo.add(req.session.cart, item);
            res.redirect(req.session.reUrl);
        }
    });

});

router.post('/sl', (req, res) => {
    cartRepo.updateSL(req.session.cart, req.body.idSach, req.body.sl);
    res.redirect('/cart');
});

router.post('/tt', (req, res) => {
    if (req.session.isLogged) {
        // var date = new Date().toLocaleString().slice(0, 19).replace('T', ' ');
        var d = new Date();
        // var date = new Date().getTime();

        var dd = d.getDate();
        var yyyy = d.getFullYear();
        var h = d.getHours();
        var m = d.getMinutes();
        var mm = d.getMonth();
        var s = d.getSeconds();
        var cart = req.session.cart;
        if (cart.length === 0) {
            vm = {
                items: req.session.cart,
                total: cartRepo.getTotal(req.session.cart),
                isEmpty: req.session.cart.length === 0,
                url: "/cart",
                ErrMsg: true,
                Msg: "Không có sản phẩm trong giỏ hàng"
            }
            res.render('cart/cart', vm);
            return;
        }

        for (i = cart.length - 1; i >= 0; i--) {
            var soluong = parseInt(cart[i].sl);
            payRepo.getBook(cart[i].idSach).then(rows => {
                if (parseInt(rows[0].soLuong) < soluong) {
                    res.redirect('/cart')
                    return;
                }
            });
        }
        var idGioHang;
        payRepo.addCart(cartRepo.getTotal(req.session.cart)).then(value => {
            idGioHang = value.insertId;
            for (i = cart.length - 1; i >= 0; i--) {

                payRepo.addPToCart(cart[i].idSach, cart[i].sl, idGioHang);
                var sl = parseInt(cart[i].sl);
                payRepo.getBook(cart[i].idSach).then(row => {
                    var slUpdate = parseInt(row[0].soLuong) - sl;
                    var lmUpdate = parseInt(row[0].luotMua) + 1;
                    payRepo.updateSLBook(row[0].idSach, lmUpdate, slUpdate);
                });
                if (i == 0) {
                    accountRepo.getCus(req.session.user.idNguoiSuDung).then(use => {
                        payRepo.addPayment(idGioHang, use[0].idKhachHang, use[0].diaChi, yyyy + '-' + mm + '-' + dd + ' ' + h + ':' + m + ':' + s, use[0].soDT).then(value => {
                            req.session.cart = [];
                            res.redirect('/account/profile');
                        });
                    });

                }
            }
        });
    } else {
        res.redirect('/account/login?retUrl=/cart');
    }
});


module.exports = router;