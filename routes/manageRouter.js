var express = require('express');
var restrict = require('../middle-wares/restrictManager');
var categoryRepo = require('../repos/categoryRepo');
var payRepo = require('../repos/payRepo');
var router = express.Router();
var manager = require('../repos/managerRepo');
var acountRepo = require('../repos/accountRepo');
var SHA256 = require('crypto-js/sha256');
var formidable = require('formidable');
var fs = require('fs');

var SPRePo = require('../repos/SPRePo');

var multer = require('multer')

router.get('/dashboard', restrict, (req, res) => {
    res.render('manager/dashboard');
});


router.get('/don-hang', restrict, (req, res) => {
    payRepo.getAllPayment().then(rows => {
        var vm = {
            donhang: rows
        }

        res.render('manager/qly-donhang', vm);
    });
});


router.post('/don-hang', (req, res) => {
    console.log(req.body.idThanhToan);
    console.log(req.body.select);
    payRepo.updateTrangThaiDH(req.body.idThanhToan, req.body.select);
    res.redirect('don-hang');
});


module.exports = router;