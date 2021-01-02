var express = require('express');
var db = require('../select');
const upload = require('../middle-wares/uploadMiddleware');
const Resize = require('../Resize');
const path = require('path');
//const { route } = require('./LoginRoutes');
var router = express.Router();
router.get('/login', (req, res) => {
    res.render('./account/login');
});
router.post('/login', (req, res) => {
    var user = {
        username: req.body.username,
        password: req.body.pass

    };
    var sql = `call check_pass_staff('${user.username}','${user.password}')`;
    db.query(sql, function(error, value) {
        if (error) {
            var vm = {
                showError: true,
                errorMsg: error.sqlMessage
            };
            res.render('./account/login', vm);
        } else {
            req.session.isLogged = true;
            req.session.user = user.username;
            req.session.account = value[0][0];
            req.session.Authorized = 1;
            var url = '/staff/task';
            // if (req.query.retUrl) {
            //     url = req.query.retUrl;
            // }
            res.redirect(url);
        }

    });
});

//cập nhật thông tin cá nhân
router.get('/profile', (req, res) => {
    if (req.session.isLogged) {
        var vm = {
            FName: req.session.account.FName,
            MName: req.session.account.MName,
            LName: req.session.account.LName,
            PhoneNumber: req.session.account.PhoneNumber,
            SID: req.session.account.SID,
            Email: req.session.account.Email
        }
        res.render('./staff/mstaff/update', vm)
    } else {
        var vm = {
            showError: true,
            errorMsg: "Bạn chưa đăng nhập"
        }
        res.render('./staff/listtask', vm)
    }
});

router.get('/task', (req, res) => {
    res.render('./staff/listtask')
});
// Quản lý sách nhâp sách sửa thông tin

router.get('/book', (req, res) => {
    if (check_sesion(req.session.Authorized)) {
        db.query(`select * from book join sstored on book.ISBN = sstored.ISBN where '${req.session.account.SID}'=StorageID`, function(error, value) {
            if (error) {
                var vm = {
                    showError: true,
                    errorMsg: error.sqlMessage
                }
                res.render('./staff/sp/book', vm)
            } else {
                var vm = {
                    Book: value
                }
                res.render('./staff/sp/book', vm)
            }
        });
    } else {
        var vm = {
            showError: true,
            errorMsg: "Bạn phải đăng nhập với tư cách nhân viên"
        }
        res.render('./staff/listtask', vm)
    }

});
router.post('/book', (req, res) => {
    if (check_sesion(req.session.Authorized)) {
        db.query(`call check_book_exit(${req.body.ma})`, function(error, value) {
            console.log(value);
            if (error) {
                var vm = {
                    showError: true,
                    errorMsg: error.sqlMessage
                };
                res.render('./staff/sp/book', vm)
            } else if (JSON.stringify(value[0]) === '[]') res.redirect(`/staff/book/add?id=${req.body.ma}`);
            else {
                res.redirect(`/staff/book/update?id=${req.body.ma}`);
            }
        })
    } else {
        var vm = {
            showError: true,
            errorMsg: "Bạn phải đăng nhập với tư cách nhân viên"
        };
        res.render('./staff/sp/book', vm)
    }

});

// update thông tin sách 
router.get('/book/update', (req, res) => {
    publisher((error, value) => {
        db.query(`select * from book where ISBN=${req.query.id}`, function(error, nvalue) {
            //console.log(nvalue[0].Summary)
            var vm = {
                nxb: value,
                sum: nvalue[0].Summary,
                cost: nvalue[0].Cost,
                name: nvalue[0].Name,
                pub: nvalue[0].PubName,
                year: nvalue[0].Year,
                time: nvalue[0].Time,
                isbn: req.query.id

            };
            //console.log(vm.nxb)
            res.render('./staff/sp/update', vm)
        })

    })
})
router.post('/book/update', (req, res) => {
    //console.log(req);
    if (check_sesion(req.session.Authorized)) {
        if (req.body.type === 1) {
            db.query(`call update_in('${req.session.account.SID}',${req.body.sl},${req.query.id},'${req.session.user}')`, function(error, value) {
                if (error) {
                    console.log(error);
                    console.log(req.session.account)
                    res.send({ test: error.sqlMessage })
                } else {
                    res.send({ test: "Thành công" })
                }
            });
        } else if (req.body.type == 2) {
            db.query(`call update_info(${req.query.id},\
    '${req.body.sum}',\
    ${req.body.cost},\
    '${req.body.name}','${req.body.pub}',${req.body.year},${req.body.times})`, function(error, value) {
                if (error) {
                    console.log(error);
                    res.send({ test: error.sqlMessage })
                } else {
                    res.send({ test: "Thành công" })
                }
            })
        }
    } else {
        res.send({ test: "Chỉ có nhân viên mới được thự hiện tác vụ này" })
    }

})

// Tạo sách
const publisher = (callback) => {
    db.query(`select * from publisher`, function(error, value) {
        //console.log(value);
        callback(error, value)
    });
}
const author = (callback) => {
    db.query(`select * from author`, function(error, value) {
        //console.log(value);
        callback(error, value)
    });
}
const kho = (callback) => {
    db.query(`select bookstorage.StorageID,Address,Name,Email,PhoneNumber,sum(amount) as total
    from bookstorage left join sstored s on bookstorage.StorageID = s.StorageID
    group by (bookstorage.StorageID)`, function(error, value) {
        //console.log(value);
        callback(error, value)
    });
}
router.get('/book/add', (req, res) => {
    publisher((error, value) => {
        var vm = {
            nxb: value,
            isbn: req.query.id
        };
        console.log(vm.nxb)
        res.render('./staff/sp/add', vm)
    })

});

router.post('/book/add', upload.single('file'), async function(req, res) {
    if (check_sesion(req.session.Authorized)) {
        let eaddr = null;
        if (req.body.idLoai == 1) eaddr = req.body.addrsave;
        var sql = `call import_book('${req.body.ma}',\
'${req.body.moTa}','${req.body.giaBan}','${req.body.name}',\
'${req.body.idNhaSX}','${req.body.year}','${req.body.time}','${eaddr}','${req.session.user}','${req.body.sl}')`;
        db.query(sql, async function(error, value) {
            if (error) {
                publisher((err, pvalue) => {
                    var vm = {
                        showError: true,
                        errorMsg: error.sqlMessage,
                        nxb: pvalue
                    };
                    console.log(error)
                    res.render('./staff/sp/add', vm);
                    return;
                });
            } else {
                const imagePath = path.join(__dirname, '../public/image');
                // call class Resize
                const fileUpload = new Resize(imagePath, `${req.body.ma}` + '.jpg');
                //console.log(req.file)
                if (!req.file) {
                    res.status(401).json({ error: 'Please provide an image' });
                    return;
                }
                const filename = await fileUpload.save(req.file.buffer);
                //return res.status(200).json({ name: filename });//
                publisher((err, pvalue) => {
                    var vm = {
                        Success: true,
                        Msg: "Thêm kho thành công",
                        nxb: pvalue
                    };
                    res.redirect(`/staff/book/addauthor?id=${req.body.ma}`)
                });
            }
        });
    } else {
        var vm = {
            showError: true,
            errorMsg: "Bạn phải đăng nhập với tư cách nhân viên"
        };
        res.render('./staff/sp/add', vm)
    }
});
// cập nhật tác giả
router.get('/book/addauthor', (req, res) => {
    author((error, value) => {
        var vm = {
            ISBN: req.query.id,
            author: value
        }
        res.render('./staff/sp/addauthor', vm)
    })
});
router.post('/book/addauthor', (req, res) => {
    console.log(req.body)
    if (check_sesion(req.session.Authorized)) {
        if (req.body.type === 1) {
            db.query(`call writeby(${req.body.isbn},'${req.body.SSN}')`, function(error, value) {
                if (error) {
                    console.log(error);
                    res.send({ test: error.sqlMessage })
                } else {
                    res.send({ test: "Thành công" })
                }
            })
        } else if (req.body.type == 2) {
            var sql = `call add_author('${req.body.ssn}','${req.body.fname}','${req.body.mname}','${req.body.lname}',\
            '${req.body.address}','${req.body.email}','${req.body.phone}','${req.body.sex}')`;
            db.query(sql, function(error, value) {
                if (error) {
                    console.log(error);
                    res.send({ test: error.sqlMessage })
                } else {
                    db.query(`call writeby(${req.body.isbn},'${req.body.ssn}')`, function(error, value) {
                        if (error) {
                            console.log(error);
                            res.send({ test: error.sqlMessage })
                        } else {
                            res.send({ test: "Thành công" })
                        }
                    });
                }
            });
        } else if (req.body.type == 3) {
            db.query(`insert into field value(${req.body.isbn},'${req.body.field}')`, function(error, value) {
                if (error) {
                    console.log(error);
                    res.send({ test: error.sqlMessage })
                } else {
                    res.send({ test: "Thành công" })
                }
            })
        } else if (req.body.type == 4) {
            db.query(`insert into keyword value(${req.body.isbn},'${req.body.key}')`, function(error, value) {
                if (error) {
                    console.log(error);
                    res.send({ test: error.sqlMessage })
                } else {
                    res.send({ test: "Thành công" })
                }
            })
        }
    } else {
        res.send({ test: "Bạn phải đăng nhập với tư cách nhân viên" })
    }
});

// Quản lý kho
router.get('/kho', (req, res) => {
    kho((error, value) => {
        var vm = {
            kho: value
        }
        res.render('./staff/kho/sstaff', vm)
    })
});
router.get('/addkho', (req, res) => {
    res.render('./staff/kho/addkho')
});
router.post('/addkho', (req, res) => {
    if (check_sesion(req.session.Authorized)) {
        //add_BookStorage(sname varchar(20),sadd varchar(100),mail varchar(100),phone varchar(15))
        var sql = `call add_BookStorage('${req.body.name}','${req.body.address}','${req.body.email}','${req.body.phone}') `;
        db.query(sql, function(error, value) {
            if (error) {
                var vm = {
                    showError: true,
                    errorMsg: error.sqlMessage
                };
                console.log(error);
                res.render('./staff/kho/addkho', vm)
            } else {
                var vm = {
                    Success: true,
                    Msg: "Thêm kho thành công"
                };
                res.render('./staff/kho/addkho', vm)
            }

        });
    } else {
        var vm = {
            showError: true,
            errorMsg: "Bạn phải đăng nhập với tư cách nhân viên"
        };
        res.render('./staff/kho/addkho', vm)
    }
});


// quản lý nhân viên
router.get('/manstaff', (req, res) => {
    res.render('./staff/kho/addauthor')
});
// cập nhật thông tin nhà xuất bản và tác giả ---------

router.get('/bsource', (req, res) => {
    publisher((err, val) => {
        author((error, value) => {
            var vm = {
                Book: value,
                pub: val
            }
            res.render('./staff/booksource/task', vm)
        });
    })

});
router.get('/author', (req, res) => {
    res.render('./staff/booksource/addauthor')
});
//Thêm tác giả
router.post('/author', (req, res) => {
    if (check_sesion(req.session.Authorized)) {
        var sql = `call add_author('${req.body.ssn}','${req.body.fname}','${req.body.mname}','${req.body.lname}',\
'${req.body.address}','${req.body.email}','${req.body.phone}','${req.body.sex}')`;
        db.query(sql, function(error, value) {
            if (error) {
                var vm = {
                    showError: true,
                    errorMsg: error.sqlMessage
                };
                console.log(error);
                res.render('./staff/booksource/addauthor', vm)
            } else {
                var vm = {
                    Success: true,
                    Msg: "Thêm tác giả thành công"
                };
                res.render('./staff/booksource/addauthor', vm)
            }
        });
    } else {
        var vm = {
            showError: true,
            errorMsg: "Bạn phải đăng nhập với tư cách nhân viên"
        };
        res.render('./staff/booksource/addauthor', vm)
    }
});

// Thêm nhà xuất bản

router.get('/publish', (req, res) => {
    res.render('./staff/booksource/addpublish')
});
router.post('/publish', (req, res) => {
        if (check_sesion(req.session.Authorized)) {
            //add_BookStorage(sname varchar(20),sadd varchar(100),mail varchar(100),phone varchar(15))
            var sql = `call add_publish('${req.body.name}','${req.body.code}','${req.body.address}','${req.body.email}','${req.body.phone}') `;
            db.query(sql, function(error, value) {
                if (error) {
                    var vm = {
                        showError: true,
                        errorMsg: error.sqlMessage
                    };
                    console.log(error);
                    res.render('./staff/booksource/addpublish', vm)
                } else {
                    var vm = {
                        Success: true,
                        Msg: "Thêm nhà xuất bản thành công"
                    };
                    res.render('./staff/booksource/addpublish', vm)
                }

            });
        } else {
            var vm = {
                showError: true,
                errorMsg: "Bạn phải đăng nhập với tư cách nhân viên"
            };
            res.render('./staff/booksource/addpublish', vm)
        }
    })
    // Quản lý nhân viên
router.get('/managestaff', (req, res) => {
    if (check_sesion(req.session.Authorized)) {
        if (req.session.account.stype == 3) {
            var vm = {
                showError: true,
                errorMsg: "Bạn không được phép thực hiện tác vụ này"
            };
            res.render('./staff/listtask', vm)
        } else {
            res.render('./staff/mstaff/mastaff');
        }
    } else {
        var vm = {
            showError: true,
            errorMsg: "Bạn phải đăng nhập với tư cách nhân viên"
        };
        res.render('./staff/listtask', vm)
    }
});
router.get('/addstaff', (req, res) => {
    //db.query(`select * from `)
    res.render('./staff/mstaff/add')
});
router.post('/addstaff', (req, res) => {
    if (check_sesion(req.session.Authorized)) {
        if (req.session.account.stype == 1) {
            if (req.body.makho != req.session.account.SID) {
                var vm = {
                    showError: true,
                    errorMsg: "Mã kho không trùng kop, bạn chỉ có thể thêm thành viên cho kho của bạn"
                };
                res.render('./staff/mstaff/add', vm);
                return;
            }
        }
        var sql = `call add_staff('${req.body.ssn}','${req.body.fname}','${req.body.mname}','${req.body.lname}','${req.body.email}','${req.body.phone}','${req.body.type}','${req.body.makho}','${req.body.pass}')`;
        db.query(sql, function(error, value) {
            if (error) {
                var vm = {
                    showError: true,
                    errorMsg: error.sqlMessage
                };
                console.log(error);
                res.render('./staff/mstaff/add', vm)
            } else {
                var vm = {
                    Success: true,
                    Msg: "Thêm nhân viên bản thành công"
                };
                res.render('./staff/mstaff/add', vm)

            }
        });
    } else {
        var vm = {
            showError: true,
            errorMsg: "Bạn phải đăng nhập với tư cách nhân viên"
        };
        res.render('./staff/mstaff/add', vm)
    }
});

//quản lý đơn hàng
const Inbook = (callback) => {
    db.query(`select * from Inbook`, function(error, value) {
        callback(error, value);
    });
}
const Outbook = (callback) => {
    db.query(`select * from outbook`, function(error, value) {
        callback(error, value);
    });
}
const waitpay = (callback) => {
    db.query(`select * from transaction join customer c on c.ID = transaction.CustomerID Where FLAG=0`, function(error, value) {
        callback(error, value);
    })
}
const waitout = (callback) => {
    db.query(`select * from transaction join customer c on c.ID = transaction.CustomerID Where FLAG=1`, function(error, value) {
        callback(error, value);
    })
}
const out = (callback) => {
    db.query(`select * from transaction join customer c on c.ID = transaction.CustomerID Where FLAG=2`, function(error, value) {
        callback(error, value);
    })
}
router.get('/donhang', (req, res) => {
        if (check_sesion(req.session.Authorized)) {
            Inbook((error, value) => {
                Outbook((error, value1) => {
                    db.query(`select * from transaction join customer c on c.ID = transaction.CustomerID Where FLAG=1 and sid=${req.session.account.SID}`, function(error, value3) {
                        //console.log(value)
                        waitpay((error, value2) => {
                            out((error, value4) => {
                                var vm = {
                                    nhap: value,
                                    xuat: value1,
                                    donhang: value2,
                                    donhang1: value3,
                                    donhang2: value4
                                }
                                res.render('./staff/donhang/donhang', vm)

                            })
                        })

                    })
                })
            })
        } else {
            var vm = {
                showError: true,
                errorMsg: "Bạn phải đăng nhập với tư cách nhân viên"
            };
            res.render('./staff/listtask', vm)
        }
    })
    // Chuyển trạng thái cho đơn hàng
router.post('/donhang', (req, res) => {
    if (check_sesion(req.session.Authorized)) {
        var date = convert(req.body.date)
        db.query(`call update_trangthai(${req.body.idcus},${req.body.isbn},'${date}',${req.session.account.SID})`, (error, value) => {
            if (error) {
                // console.log(error)
                // res.redirect('/staff/donhang')

                Inbook((error1, value1) => {
                    Outbook((error2, value2) => {
                        db.query(`select * from transaction join customer c on c.ID = transaction.CustomerID Where FLAG=1 and sid=${req.session.account.SID}`, function(error3, value3) {
                            //console.log(value)
                            waitpay((error4, value4) => {
                                out((error5, value5) => {
                                    var vm = {
                                        nhap: value1,
                                        xuat: value2,
                                        donhang: value4,
                                        donhang1: value3,
                                        donhang2: value5,
                                        showError: true,
                                        errorMsg: error.sqlMessage
                                    }
                                    res.render('./staff/donhang/donhang', vm)

                                })
                            })

                        })
                    })
                })


            } else {
                res.redirect('/staff/donhang')
            }
        })
    } else {
        var vm = {
            showError: true,
            errorMsg: "Bạn phải đăng nhập với tư cách nhân viên"
        };
        res.render('./staff/listtask', vm)
    }
})

function check_sesion(sesion) {
    if (sesion) return true;
    return false;
}

function convert(str) {
    var mnths = {
            Jan: "01",
            Feb: "02",
            Mar: "03",
            Apr: "04",
            May: "05",
            Jun: "06",
            Jul: "07",
            Aug: "08",
            Sep: "09",
            Oct: "10",
            Nov: "11",
            Dec: "12"
        },
        date = str.split(" ");

    return [date[3], mnths[date[1]], date[2]].join("-") + ' ' + date[4];
}
module.exports = router;