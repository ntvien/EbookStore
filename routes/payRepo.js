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
            FROM OrderBook INNER JOIN Book ON OderBook.idMaSP=Book.idSach
            WHERE DatSP.idGioHang='${idGH}'`;
    return db.load(sql);
}
exports.addCart = (total) => {
    var sql = `insert into GioHang(tongGia) values('${total}')`;
    return db.save(sql);
};
exports.addPToCart = (maSP, SL, idCart) => {
    var sql = `insert into DatSP(idMaSP, sl, idGioHang) values('${maSP}', '${SL}', '${idCart}')`;
    return db.save(sql);
};
exports.addPayment = (idCart, idKH, diaChi, ngay, sdt) => {
    var sql = `insert into ThanhToan(idGioHang, idKhachHang, diaChiThanhToan,ngayDatHang,sdtNhanHang,trangThai) values('${idCart}', '${idKH}', '${diaChi}','${ngay}','${sdt}','0')`;
    return db.save(sql);
};
exports.updateTrangThaiDH = (idDH, TT) => {
    var sql = `UPDATE ThanhToan SET trangThai='${TT}' WHERE idThanhToan = '${idDH}'`;
    return db.save(sql);
};
exports.getAllPayment = () => {

    var sql = `SELECT * 
            FROM ThanhToan INNER JOIN KhachHang ON ThanhToan.idKhachHang=KhachHang.idKhachHang `;
    return db.load(sql);
};
exports.getBook = (idBook) => {
    var sql = `select* from book where idSach='${idBook}'`;
    return db.load(sql);
};
exports.updateSLBook = (idBook, luotmua, sl) => {
    var sql = `update Book set luotMua = '${luotmua}',
    soLuong = '${sl}'
     where idSach = ${idBook}`
    return db.save(sql);
}