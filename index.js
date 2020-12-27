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
var accountController=require('./routes/LoginRoutes');
var cartcontroler=require('./routes/cartRouter');
var cartcontroler=require('./routes/staffrouter')
var handleLayoutMDW = require('./middle-wares/handleLayout');
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
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(handleLayoutMDW);
app.get('/', (req, res) => {

    // Promise.all([p1, p2, p3]).then(([newB, bestS, Views]) => {
    //     req.session.reUrl = "/"
        // var vm = {
        //     newBook: newB,
        //     bestSaleBook: bestS,
        //     byViews: Views,
        //     url:"/"
        // };
        res.render('index');
    // });
});

app.use('/account', accountController);
app.use('/cart',cartcontroler);
app.use('/staff',cartcontroler);
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