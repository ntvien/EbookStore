var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var express_handlebars_sections = require('express-handlebars-sections');
var wnumb = require('wnumb');
var helpers = require('handlebars-helpers');
var path = require('path');
var ss = require('handlebars-dateformat');
var Handlebars = require('handlebars');
var HandlebarsIntl = require('handlebars-intl');
var SHA256 = require('crypto-js/sha256');
var session = require('express-session');
//var MySQLStore = require('express-mysql-session')(session);
var accountController = require('./routes/LoginRoutes');
var cartcontroler = require('./routes/cartRouter');
var staffcontroler = require('./routes/staffrouter')
var productController = require('./routes/productRouter');
var searchController = require('./routes/searchRouter');
var timkiemController = require('./routes/categoryController');

var handleLayoutMDW = require('./middle-wares/handleLayout');
var db = require('./select');
var app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
//app.engine('.hbs', exphbs({extname: '.hbs'}));

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: 'hbs',
    layoutsDir: 'views/layout',
    helpers: {
        section: express_handlebars_sections(),
        number_format: n => {
            var nf = wnumb({
                thousand: '.'
            });
            return nf.to(n);
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "views"));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(handleLayoutMDW);
app.get('/', (req, res) => {

    var sql = `select B.ISBN, concat(B.ISBN,'.jpg') as Image, Cost, B.Name as BookName, \
    (select concat_ws(" ", A.fname, A.mname, A.lname)) as AuthName \
    from Book B join writtenby on bookisbn = B.ISBN join author A on authorssn = ssn order by isbn desc limit ${10} offset ${0}`;
    db.query(sql, function(error, value) {
        if (error) {
            var vm = {
                showError: true,
                errorMsg: 'Không có sách để hiển thị'
            };
            res.render('index', vm);
        } else {
            Promise.all([value]).then(([newB]) => {
                req.session.reUrl = "/"
                var vm = {
                    newBook: newB,
                    url: "/"
                };
                // console.log('aaa');
                // console.log(vm);
                res.render('index', vm);
            });
        }
    });
});
app.use('/sample_product', productController);
app.use('/account', accountController);
app.use('/cart', cartcontroler);
app.use('/staff', staffcontroler);
app.use('/tim-voi-key', searchController);
app.use('/tim-kiem', timkiemController);
// app.post('/auth', function(request, response) {
// 	var username = request.body.username;
// 	var password = request.body.password;
// 	if (username && password) {
// 		connection.query('select * from customer WHERE NickName = ? AND Password = ?', [username, password], function(error, results, fields) {
// 			if (results.length > 0) {
// 				request.session.loggedin = true;
// 				request.session.username = JSON.stringify(results);//username;
// 				console.log(results[0].ID);
//                 console.log(request.session.username)
// 				response.redirect('/home');
// 			} else {
// 				response.send('Incorrect Username and/or Password!');
// 			}			
// 			response.end();
// 		});
// 	} else {
// 		response.send('Please enter Username and Password!');
// 		response.end();
// 	}
// });

// app.get('/home', function(request, response) {
// 	if (request.session.loggedin) {
// 		response.send('Welcome back, ' + request.session.username + '!');
// 	} else {
// 		response.send('Please login to view this page!');
// 	}
// 	response.end();
// });

app.listen(3001);