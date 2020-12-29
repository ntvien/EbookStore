var db = require('../select');



exports.getCus = (idCus) => {
    var sql = `select * from Customer where idCustomer='${idCus}'`;
    return db.load(sql);
};