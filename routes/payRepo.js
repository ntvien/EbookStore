var db = require('../fn/db');

exports.getPayment = (idCus) => {
    // var sql=`select * from ThanhToan where idKhachHang='${idCus}'`;
    var sql = `SELECT * 
            FROM Transaction INNER JOIN Cart ON Transaction.ISBN = Cart.BookID 
            WHERE Transaction.CustomerID = '${idCus}'`;
    return db.load(sql);
};
exports.getDH = (idDH) => {
    var sql = `SELECT * 
            FROM Transaction INNER JOIN Cart ON Transaction.ISBN = Cart.BookID 
            WHERE Transaction.PaymentID='${idDH}'`;
    return db.load(sql);
}
exports.getDatSP = (idGH) => {
    var sql = `SELECT * 
            FROM OrderSP INNER JOIN Book ON OrderSP.idMaSP=Book.ISBN
            WHERE OrderSP.idCart='${idGH}'`;
    return db.load(sql);
}
exports.addCart = (total) => {
    var sql = `insert into Cart(total) values('${total}')`;
    return db.save(sql);
};
exports.addPToCart = (maSP, SL, idCart) => {
    var sql = `insert into OrderSP(idMaSP,total, idCart) values('${maSP}', '${SL}', '${idCart}')`;
    return db.save(sql);
};
exports.addPayment = (idCart, idKH, isbn, ngay) => {
    var sql = `insert into Transaction(idcart, idcustomer,FLAG, ISBN, tDateTime) values('${idCart}', '${idKH}','${isbn}','${ngay}', '0')`;
    return db.save(sql);
};
exports.updateTrangThaiDH = (idDH, TT) => {
    var sql = `UPDATE Transaction SET FLAG='${TT}' WHERE PaymentID = '${idDH}'`;
    return db.save(sql);
};
exports.getAllPayment = () => {

    var sql = `SELECT * 
            FROM Transaction INNER JOIN Customer ON Transaction.IDCustomer=Customer.ID `;
    return db.load(sql);
};
exports.getBook = (idBook) => {
    var sql = `select* from book where ISBN='${idBook}'`;
    return db.load(sql);
};
exports.updateSLBook = (idBook, luotmua, sl) => {
    var sql = `update Book set luotMua = '${luotmua}',
    soLuong = '${sl}'
    where ISBN = ${idBook}`;
    return db.save(sql);
}