//var categoryRepo = require('../repos/categoryRepo');
var db = require('../select');

module.exports = (req, res, next) => {

    if (req.session.isLogged === undefined) {
        req.session.isLogged = false;
    }
    if (req.session.cart === undefined) {
        req.session.cart = [];
    }
    let type = -1;
    if (req.session.Authorized) {
        type = req.session.account.stype;
    }
    res.locals.layoutVM = {
        categories: '',
        suppliers: '',
        isLogged: req.session.isLogged,
        curUser: req.session.account,
        usename: req.session.user,
        totalCart: req.session.lenCart,
        categories: '',
        nxb: '',
        Authorized: req.session.Authorized,
        reUrl: 'req.session.reUrl',
        type: type
    };

    

    var sql1 = `select distinct AField from field`;
    // var sql1 = `select * from book`;
    var sql2 = `select * from publisher`;
    db.query(sql1, function(err, res1) {
        if (err) throw err;
        else{
            db.query(sql2, function(err, res2) {
                if (err) throw err;
                else {
                    // console.log('asasasas')
                    // console.log(res1)
                    // console.log(res2)
                    Promise.all([res1, res2]).then(([menu,nxb]) => {

                        res.locals.layoutVM.categories = menu;
                        res.locals.layoutVM.nxb = nxb;
                });
                
            }
            });
            }
        });
    
    // var p1 = categoryRepo.loadAll();
    // let menu = categoryRepo.loadAllKind();
    // let nxb = categoryRepo.loadAllPD();

    // Promise.all([p1,menu,nxb]).then(([rows,menu,nxb]) => {

    //     res.locals.layoutVM = {
    //         categories: rows,
    //         suppliers: rows,
    //         isLogged: req.session.isLogged,
    //         curUser: req.session.user,
    //         totalCart: req.session.cart.length,
    //         categories: menu,
    //         nxb:nxb,
    //         Authorized:req.session.Authorized,
    //         reUrl:req.session.reUrl
    //     };

    //     next();
    // });
    next();
};