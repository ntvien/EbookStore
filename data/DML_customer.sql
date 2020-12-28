use ebookstore_01;
INSERT INTO Payment VALUE (1);
INSERT INTO Payment VALUE (2);
INSERT INTO Payment VALUE (3);
INSERT INTO Payment VALUE (4);
INSERT INTO Payment VALUE (5);
INSERT INTO Payment VALUE (6);
INSERT INTO Payment VALUE (7);
INSERT INTO Payment VALUE (8);
INSERT INTO Payment VALUE (9);
INSERT INTO Payment VALUE (10);

INSERT INTO CardPayment VALUE (1);
INSERT INTO CardPayment VALUE (2);
INSERT INTO CardPayment VALUE (3);
INSERT INTO CardPayment VALUE (4);
INSERT INTO CardPayment VALUE (5);

INSERT INTO Transfer VALUE (6, 123969340, 'DongAbank', 'Quan 3');
INSERT INTO Transfer VALUE (7, 123632323, 'OCB', 'Quan 6');
INSERT INTO Transfer VALUE (8, 123463666, 'TPBank', 'Quan 11');
INSERT INTO Transfer VALUE (9, 126666666, 'DongAbank', 'Quan 12');
INSERT INTO Transfer VALUE (10, 123613123, 'DongAbank', 'Quan 7');
# CREATE TABLE Customer(
# 	ID INT,
# 	FName VARCHAR(20) NOT NULL,
# 	MName VARCHAR(20) NOT NULL,
# 	LName VARCHAR(20) NOT NULL,
# 	NickName VARCHAR(20) UNIQUE NOT NULL,
# 	Password VARCHAR(100) NOT NULL,
# 	DOB DATE,
# 	Sex CHAR(1),
# 	PhoneNumber VARCHAR(15) NOT NULL,
# 	Address VARCHAR(20) NOT NULL,
# 	PRIMARY KEY (ID)
# );
-- check passworld
drop procedure if exists check_pass;
delimiter |
create procedure check_pass(user_name varchar(20),pass_cus varchar(100))
begin
    select ID,FName,MName,LName, DOB ,Sex ,PhoneNumber,Address,Mail from customer
        where NickName=user_name and Password=pass_cus;
end |
select * from customer;
-- call check_pass('linhcute','15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225');



drop procedure if exists createaccout;
DELIMITER $$
create procedure createaccout(nfname varchar(20),
nName varchar(20),
nlname varchar(20),
nick varchar(20),
npass varchar(500),
ndob date,nsex char(1),phone varchar(15),naddress varchar(20),mail varchar(100))
begin
    declare max int default 0;
#     declare mp varchar(100);
#     select Password(npass) into mp;
select max(id) into  max from customer;
if max is null then
        insert into customer
        value (1,nfname,nName,nlname,nick,npass,ndob,nsex,phone,naddress,mail);
    else
        insert into customer
        value (max+1,nfname,nName,nlname,nick,npass,ndob,nsex,phone,naddress,mail);
    end if;
end $$
DELIMITER  ;
-- delete from customer;
-- call createaccout('Nhat','Nhat','Nguyen','linhcute01','ahihi','980501','M','00222222211','Tp.HCM');
use ebookstore_01;
select * from customer;
# CREATE TABLE CreditCard(
# 	CustomerID INT NOT NULL,
# 	Code VARCHAR(20) NOT NULL,
# 	FName VARCHAR(20) NOT NULL,
# 	MName VARCHAR(20) NOT NULL,
# 	LName VARCHAR(20) NOT NULL,
# 	BankName VARCHAR(20) NOT NULL,
# 	BranchName VARCHAR(20) NOT NULL,
# 	EndDate DATE NOT NULL,
# 	PRIMARY KEY (CustomerID, Code),
# 	FOREIGN KEY (CustomerID) REFERENCES Customer(ID)ON DELETE CASCADE  ON UPDATE CASCADE
# );
drop procedure if exists createaccCard;
DELIMITER $$
create procedure createaccCard(
nid int,
 ncode varchar(20),
 nbankname varchar(20),
 branch varchar(20),
 nenddate date,
 idpay int)
Begin
    insert into creditcard
    select id,ncode,fname,MName,lname,nbankName,branch,nenddate,idpay from customer where id =nid;
end $$
DELIMITER  ;
call createaccCard(1,'12345678900','obc','ly thuong kiet','221230',1);
select * from creditcard;
-- update information
drop procedure if exists update_info_cus;
DELIMITER |
CREATE PROCEDURE update_info_cus(
	Customer_ID INT,
	Customer_FName VARCHAR(20),
	Customer_MName VARCHAR(20),
	Customer_LName VARCHAR(20),
	Customer_PhoneNumber varchar(15),
	Customer_Address VARCHAR(20),
	email varchar(100)
)
BEGIN
	UPDATE Customer
	SET FName = Customer_Fname,
		MName = Customer_MName,
		LName = Customer_LName,
		PhoneNumber = Customer_PhoneNumber,
		Address = Customer_Address,
	    Mail=email
	WHERE ID = Customer_ID;
	select ID,FName,MName,LName, DOB ,Sex ,PhoneNumber,Address,Mail from customer
        where ID = Customer_ID;
END;
DELIMITER ;

-- (ii.2). Cập nhật thông tin thanh toán.

 -- Cập nhật giao dịch mua hàng.
# CustomerID int         not null,
#     ISBN       decimal(15) not null,
#     tDateTime  datetime    not null,
#     FLAG       decimal(1)  not null,
#     amount     int         not null,
#     PaymentID  int         not null,
#     TTime      datetime    null,
#     model      varchar(4)  not null,
drop procedure if exists capnhat_giaodich;
DELIMITER |
CREATE PROCEDURE capnhat_giaodich(
	Trans_CustomerID INT,
	Trans_ISBN decimal(15,0),
	Trans_PaymentID INT,
	a int,nmodel varchar(4)
)
BEGIN
	insert into Transaction
	value (Trans_CustomerID,Trans_ISBN,CURRENT_TIMESTAMP(),0,a,Trans_PaymentID,nmodel,null);
END;
DELIMITER ;
select CURRENT_TIMESTAMP();
-- ). Xem danh sách sách theo thể loại
drop procedure if exists xem_ds_theloai;

DELIMITER |
CREATE PROCEDURE xem_ds_theloai(
	theloai varchar(20)
)
BEGIN
	SELECT Name, AField
	FROM Book JOIN Field ON ISBN = BookID
	WHERE AField = theloai;
END;
DELIMITER ;
-- Xem danh sách sách theo tác giả
drop procedure if exists xem_dssach_tacgia;
use ebookstore_01;
DELIMITER |
CREATE PROCEDURE xem_dssach_tacgia(
	tacgia varchar(20)
)
BEGIN
	SELECT Name, (FName + MName + LName) AS Author
	FROM Author JOIN (Book JOIN WrittenBy ON ISBN = BookISBN) ON SSN = AuthorSSN
	WHERE FName LIKE ('%' + tacgia + '%');
END |
DELIMITER ;
-- (ii.6). Xem danh sách sách theo từ khóa.
drop procedure if exists xem_dssach_tukhoa;

DELIMITER |
CREATE PROCEDURE xem_dssach_tukhoa(
	tukhoa varchar(20)
)
BEGIN
	SELECT Name, AKeyword
	FROM Book JOIN Keyword ON ISBN = BookID
	WHERE tukhoa = AKeyword;
END;
DELIMITER ;
-- (ii.7). Xem danh sách sách theo năm xuất bản.
drop procedure if exists xem_dssach_namx;

DELIMITER |
CREATE PROCEDURE xem_dssach_namxb(
	namxb INT
)
BEGIN
	SELECT Name, YEAR(Year) AS YearPub
	FROM Book
	WHERE YEAR(Year) = namxb;
END;
DELIMITER ;

-- (ii.8). Xem danh sách sách mà mình đã mua trong một tháng.
drop procedure if exists xem_sach_thang;

delimiter |
CREATE PROCEDURE xem_sach_thang(
	cusID INT,moth varchar(8)
)
BEGIN
	DECLARE curDate DATE;
	select curdate() into curDate;
	-- SET curDate = CAST(GETDATE() AS DATE);
	SELECT ISBN
	FROM Transaction
	WHERE CustomerID = cusID AND Transaction.tDateTime like (moth+'%');
END;
DELIMITER ;

-- CALL xem_sach_thang  (112);
drop procedure if exists xem_sach_thang;
DELIMITER |
CREATE PROCEDURE xem_giaodich_thang(
	cusID INT,moth varchar(8)
)
BEGIN
	SELECT *
	FROM Transaction
	WHERE CustomerID = cusID AND Transaction.tDateTime like (moth+'%');
END;
DELIMITER ;

-- CALL xem_giaodich_thang (112);
-- (ii.12). Xem danh sách tác giả của cùng một thể loại.
drop procedure if exists xem_tacgia_cungtheloai;
DELIMITER |
CREATE PROCEDURE xem_tacgia_cungtheloai(
	theloai varchar(20)
)
BEGIN
	SELECT distinct SSN ,FName, MName, LName
	FROM Author JOIN WrittenBy ON BookISBN IN (
		SELECT ISBN
		FROM Book JOIN Field ON ISBN = BookID
		WHERE theloai = AField
	);
END;
DELIMITER ;

-- (ii.14). Xem tổng số sách theo từng thể loại mà mình đã mua trong một tháng.
delimiter $$
CREATE PROCEDURE xem_tongsach_theotheloai(
	cusID INT,
	theloai varchar(20),moth varchar(8)
)
BEGIN
	SELECT AField, COUNT(*) AS Tong
	FROM Field
	WHERE BookID IN (
		SELECT Book.ISBN
		FROM Book JOIN Transaction ON (Book.ISBN = Transaction.ISBN AND CustomerID = cusID)
		WHERE Transaction.tDateTime like (moth+'%')
	)
	GROUP BY AField;
END $$
DELIMITER ;
-- -- --
-- cau 15 Xem các giao dịch mà mình đã thực hiện có số lượng sách được mua nhiều nhất trong một tháng

use EBookStore_01;
delimiter $$
create trigger insert_cus
    before insert on customer
    for each row
    begin
        declare tmp int default 0;
        select ID into tmp from customer where NickName=new.NickName;
            if tmp then
                SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'tai khoan da ton tai';
            end if ;
    end $$
delimiter ;
select * from customer;
use ebookstore_01;
#delete from customer;
################################################
# Kiểm tra mật khẩu cho khách hàng
drop procedure if exists update_pass;
delimiter $$
create procedure update_pass(cID int,oldpass varchar(500), newpass varchar(500))
begin
    declare checkid varchar(500) default null;
    select Password into checkid from customer where cID=ID;
    if (checkid!=oldpass) then
        SIGNAL SQLSTATE '45001'
			SET MESSAGE_TEXT = 'Mat khau khong hop le';
    end if ;
        update customer
            set Password=newpass
        where ID=cID;
end $$
delimiter ;
#call update_pass(1,"1234567890","15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225");,"15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225");