var express = require('express');
var helpers = require('handlebars-helpers');
// var ProductRePo = require('../repos/ProductRePo');
var db = require('../select');
var app = express();
var router = express.Router();

router.get('/', (req, res) => {
    var p = 0;
    var sql = `call searchbyISBN('${req.query.id}')`;
    db.query(sql, function(error, value) {
        if (error) {
            throw error;
        } else {
            var sql1 = `call loadNXB('${value[0][0].PubName}', '${req.query.id}')`;
            db.query(sql1, function(error, result) {
                if (error) {
                    throw error;
                } else {
                    p = result;
                    Promise.all(p).then((prod) => {
                        req.session.reUrl = "/sample_product?id=" + req.query.id
                        var vm = {
                            products: value[0],
                            nxb: prod[0],
                            url: "/sample_product?id=" + req.query.id
                        }

                        res.render('sample_product', vm);
                    });
                }
            });

        }
    });
});



module.exports = router;