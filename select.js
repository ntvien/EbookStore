var mysql = require('mysql');
var cn = mysql.createConnection({
    host: 'localhost',
    // port: 3306,
    user: 'root',
    password: '',
    database: 'ebookstore_01'
});
module.exports = cn;
// exports.load = sql => {
//     return new Promise((resolve, reject) => {
//         var cn = mysql.createConnection({
//             host: 'localhost',
//             // port: 3306,
//             user: 'Meme',
//             password: '13152989Ln@',
//             database: 'ebookstore_01',
//         });

//         cn.connect();

//         cn.query(sql, function(error, rows, fields) {
//             if (error) {
//               res.send({ success: false, message: 'query error', error: error });
//             } else {
//                 resolve(rows);
//             }

//             cn.end();
//         });
//     });
// }

// exports.save = sql => {
//     return new Promise((resolve, reject) => {
//         var cn = mysql.createConnection({
//             host: 'localhost',
//             // port: 3306,
//             user: 'Meme',
//             password: '13152989Ln@',
//             database: 'ebookstore_01',
//         });

//         cn.connect();

//         cn.query(sql, function(error, value) {
//             if (error) {
//               return error;
//             } else {
//               //console.log(value);
//               resolve(value);

//             }

//             cn.end();
//         });
//     });
// }