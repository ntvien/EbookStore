var express = require('express');
var db=require('../select');
//const { route } = require('./LoginRoutes');
var router = express.Router();
router.get('/login', (req, res) => {
    res.render('./account/login');
});
router.post('/login', (req, res) =>{
    var user = {
        username: req.body.username,
        password: req.body.pass
    
    };
    var sql =`call check_pass_staff('${user.username}','${user.password}')`;
        db.query(sql, function(error,value) {
            if (error) {
                    var vm = {
                    showError: true,
                    errorMsg: error.sqlMessage
                };
                res.render('./account/login', vm);
            } else {
                req.session.isLogged = true;
                req.session.user=user.username;
                req.session.account=value[0][0];
                req.session.Authorized=1;
                var url = '/staff/task';
                if (req.query.retUrl) {
                    url = req.query.retUrl;
                }
                res.redirect(url);
            }
            
});
});
router.get('/task',(req,res)=>{
res.render('./staff/listtask')
});
// Quản lý sách nhâp sách sửa thông tin

router.get('/book',(req,res)=>{
    res.render('./staff/sp/book')
    });
router.get('/book/add',(req,res)=>{
    db.query(`select * from publisher`,function(error,value){
        var vm={
            nxb: value
        }
        console.log(vm.nxb)
        res.render('./staff/sp/add',vm)
    })
    
    });

// Quản lý kho
router.get('/kho',(req,res)=>{
    res.render('./staff/kho/sstaff')
    });
router.get('/addkho',(req,res)=>{
    res.render('./staff/kho/addkho')
});
router.post('/addkho',(req,res)=>{
    if (check_sesion(req.session.Authorized)){
        //add_BookStorage(sname varchar(20),sadd varchar(100),mail varchar(100),phone varchar(15))
        var sql=`call add_BookStorage('${req.body.name}','${req.body.address}','${req.body.email}','${req.body.phone}') `;
        db.query(sql,function(error,value){
            if (error){
                var vm={
                    showError: true,
                    errorMsg: error.sqlMessage
                };
                console.log(error);
                res.render('./staff/kho/addkho',vm)
            }
            else {
                var vm={
                    Success: true,
                    Msg: "Thêm kho thành công"
                };
                res.render('./staff/kho/addkho',vm)
            }

        });
    }
    else {
        var vm={
            showError: true,
            errorMsg: "Bạn phải đăng nhập với tư cách nhân viên"
        };
        res.render('./staff/kho/addkho',vm)
    }
});


// quản lý nhân viên
router.get('/manstaff',(req,res)=>{
    res.render('./staff/kho/addauthor')
});
// cập nhật thông tin nhà xuất bản và tác giả ---------

router.get('/bsource',(req,res)=>{
    res.render('./staff/booksource/task')
    });
router.get('/author',(req,res)=>{
    res.render('./staff/booksource/addauthor')
});
//Thêm tác giả
router.post('/author',(req,res)=>{
    if (check_sesion(req.session.Authorized)){
var sql=`call add_author('${req.body.ssn}','${req.body.fname}','${req.body.mname}','${req.body.lname}',\
'${req.body.address}','${req.body.email}','${req.body.phone}','${req.body.sex}')`;
db.query(sql,function(error,value){
    if (error){
        var vm={
            showError: true,
            errorMsg: error.sqlMessage
        };
        console.log(error);
        res.render('./staff/booksource/addauthor',vm)
    }
    else {
        var vm={
            Success: true,
            Msg: "Thêm tác giả thành công"
        };
        res.render('./staff/booksource/addauthor',vm)
    }
});
    }
    else{
    var vm={
        showError: true,
        errorMsg: "Bạn phải đăng nhập với tư cách nhân viên"
    };
    res.render('./staff/booksource/addauthor',vm)
}
});

// Thêm nhà xuất bản

router.get('/publish',(req,res)=>{
    res.render('./staff/booksource/addpublish')
    });
router.post('/publish',(req,res)=>{
    if (check_sesion(req.session.Authorized)){
        //add_BookStorage(sname varchar(20),sadd varchar(100),mail varchar(100),phone varchar(15))
        var sql=`call add_publish('${req.body.name}','${req.body.code}','${req.body.address}','${req.body.email}','${req.body.phone}') `;
        db.query(sql,function(error,value){
            if (error){
                var vm={
                    showError: true,
                    errorMsg: error.sqlMessage
                };
                console.log(error);
                res.render('./staff/booksource/addpublish',vm)
            }
            else {
                var vm={
                    Success: true,
                    Msg: "Thêm nhà xuất bản thành công"
                };
                res.render('./staff/booksource/addpublish',vm)
            }

        });
    }
    else {
        var vm={
            showError: true,
            errorMsg: "Bạn phải đăng nhập với tư cách nhân viên"
        };
        res.render('./staff/booksource/addpublish',vm)
    }
})
// Quản lý nhân viên
router.get('/managestaff',(req,res)=>{
    if (check_sesion(req.session.Authorized)){
    if (req.session.account.stype==3){
        var vm={
            showError: true,
            errorMsg: "Bạn không được phép thực hiện tác vụ này"
        };
        res.render('./staff/listtask',vm)
    }else {
    res.render('./staff/mstaff/mastaff');
    }
}else {
    var vm={
        showError: true,
        errorMsg: "Bạn phải đăng nhập với tư cách nhân viên"
    };
    res.render('./staff/listtask',vm)
}
});
router.get('/addstaff',(req,res)=>{
    //db.query(`select * from `)
    res.render('./staff/mstaff/add')
});
router.post('/addstaff',(req,res)=>{
    if (check_sesion(req.session.Authorized)){
        if (req.session.account.stype==1){
            if(req.body.makho!=req.session.account.SID){
                var vm={
                    showError: true,
                    errorMsg: "Mã kho không trùng kop, bạn chỉ có thể thêm thành viên cho kho của bạn"
                };
                res.render('./staff/mstaff/add',vm);
                return;
            }
        }
        var sql=`call add_staff('${req.body.ssn}','${req.body.fname}','${req.body.mname}','${req.body.lname}','${req.body.email}','${req.body.phone}','${req.body.type}','${req.body.makho}','${req.body.pass}')`;
        db.query(sql,function(error,value){
            if(error){
                var vm={
                    showError: true,
                    errorMsg: error.sqlMessage
                };
                console.log(error);
                res.render('./staff/mstaff/add',vm)
            }
            else {
                var vm={
                    Success: true,
                    Msg: "Thêm nhân viên bản thành công"
                };
                res.render('./staff/mstaff/add',vm)

            }
        });
    }
    else {
        var vm={
            showError: true,
            errorMsg: "Bạn phải đăng nhập với tư cách nhân viên"
        };
        res.render('./staff/mstaff/add',vm)
    }
});

function check_sesion(sesion){
    if(sesion) return true;
    return false;
}
module.exports = router;