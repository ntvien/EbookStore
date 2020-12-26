use ebookstore_01;

INSERT INTO BookStorage VALUE (0, 'Center', 'USA', 'pn@gmail.com', '0956632156');

INSERT INTO Staff VALUE ("1123456789", 'Le', 'Thi', 'J','sdfb@gmail.com', 0325325252, 0,2333,0);
select * from staff;
# select * from author;
# select * from writtenby;
# select * from author;
select * from book;
select * from inbook;
select * from sstored;
delete from book;
select * from author;
-- Insert ten tac gia
select * from staff;
drop procedure if exists check_pass_staff;
delimiter |
create procedure check_pass_staff(s_ssn varchar(10),spass varchar(500))
begin
    declare checkid varchar(500) default null;
    select spassword into checkid from staff where s_ssn=ID;
    if (checkid!=spass)or checkid is null then
        SIGNAL SQLSTATE '45001'
			SET MESSAGE_TEXT = 'Mat khau khong hop le';
    else select FName,MName,LName,stype,SID from staff where s_ssn=ID;
    end if ;

end |
delimiter ;
#call check_pass_staff('0123456789','2333')
#call check_pass_staff('123','2333')
drop procedure if exists insert_author;
delimiter |
# SSN         varchar(20)  not null
#         primary key,
#     FName       varchar(20)  not null,
#     MName       varchar(20)  not null,
#     LName       varchar(20)  not null,
#     Address     varchar(100) null,
#     Email       varchar(20)  null,
#     PhoneNumber varchar(15)  null

# create procedure insert_author(
# isb decimal(15,0),
# nssn varchar(20),
# fn varchar(20),
# mn varchar(20),
# ln varchar(20))
# begin
#     if nssn not in (select ssn from author) then
#     insert into author(ssn, fname, mname, lname)
#     value (nssn,fn,mn,ln);
#     end if;
#     insert into writtenby
#     value (nssn,isb);
# end |
# #call insert_author(100000000000000,CURRENT_TIMESTAMP(),'Ánh','Dương','Nguyễn');

select * from author;
select * from writtenby;

# select * from publisher;
#insert into book values (2146563245, NULL, NULL, 16.47, 'Herry Potta'
drop procedure if exists import_book;
#1 Cập nhật thông tin về sách khi sách được nhập kho.

select * from book;
select * from inbook;
DELIMITER //
CREATE PROCEDURE import_book(isb decimal(15,0), img varchar(100), sum varchar(500),
ccost decimal(10,2),
cname varchar(100),
pub varchar(50),
yr year(4),
tme int(11),
caddress varchar(100),
snid char(10),
countb int
)
BEGIN
declare ids int default 0;
select  sid into ids from staff where ID=1;
    if isb not in (select ISBN from book) then
	insert into book values (isb, img, sum, ccost, cname, pub, yr, tme);
        IF caddress IS NULL
        THEN insert into paperbook values (isb);
        ELSE insert into ebook values (isb, caddress);
        END IF;
# 	ISBN      decimal(15) not null,
#     StorageID int         not null,
#     StaffID   char(10)    not null,
#     amount    int         not null,
        insert into sstored
        value(isb,ids,snid,countb);
	insert into Inbook
# 	ISBN      decimal(15) not null,
#     StorageID int         not null,
#     import    datetime    not null,
#     amount    int         not null,
        value(isb,ids,CURRENT_TIMESTAMP(),countb);
	else
    insert into Inbook
# 	ISBN      decimal(15) not null,
#   StorageID int         not null,
#   import    datetime    not null,
#   amount    int         not null,
    value(isb,ids,CURRENT_TIMESTAMP(),countb);
    update sstored
        set amount=amount+countb
        where ISBN=isb;
	end if;

END //

#  SELECT NAME FROM PUBLISHER;
#  INSERT INTO BOOK VALUES (1234567891,NULL,NULL,15.15,'Eat, love and pray','Crown',2016,1);
# #call import_book(1234567892,NULL,NULL,15.15,'Come','Crown',2016,1, NULL);
# #call import_book(1234567894,NULL,NULL,15.15,'Get out','Crown',2019,10, 'google.com');
# delete from book where isbn =1234567892;
# select * from paperbook;
#2 Cập nhật thông tin về sách khi sách được xuất kho
DELIMITER //
CREATE PROCEDURE export_book(isb decimal(15),oamount int,sid char(10))
BEGIN
	#DELETE FROM paperbook where isbn = isb;
	declare ids int default  0;
	select SID into ids from staff where ID =sid;
    insert  into Outbook
#     ISBN      decimal(15) not null,
#     StorageID int         not null,
#     Otime     datetime    not null,
#     amount    int         not null,
    value (isb,sid,curdate()+current_time(),oamount);
	update sstored
	    set amount=amount-oamount
    where ISBN=isb;
END //
#call export_book(1234567892);

#3 Cập nhật thông tin giao dịch khi giao dịch trực tuyến gặp sự cố.
# select * from transaction;
# DELIMITER //
# CREATE PROCEDURE upd_trans(cus int(11), isb int(11), dt datetime, pid int(11), tt datetime)
# BEGIN
# 	update transaction set tDateTime = dt, paymentid = pid, ttime = tt
#     where customerid = cus and isbn = isb;
# END//
# #call upd_trans(3,1501145258,'2020-01-01 11:12:43',2,'2020-11-25 22:19:34');

#4 ). Xem tất cả các sách tính theo ISBN được mua trong một ngày.
DELIMITER //
CREATE PROCEDURE view_by_isbn(isb int(11),newday date)
BEGIN
	SELECT COUNT(*) FROM TRANSACTION WHERE ISBN = isb and tDateTime like newday+'%';
END //
#call view_by_isbn(1501145258);

#5 Xem tổng số sách tính theo mỗi ISBN được mua trong một ngày
# select 'ahi';
# SELECT 12;
# SELECT DATE('2020-20-20');
# SELECT CURRENT_TIMESTAMP();
# select DATE('2020-12-05 23:22:22');
# select * from transaction;
# select * from cardpayment;
# select * from transaction where DATE(ttime) = '2020-11-25';
drop procedure view_by_isbn_in_day;
DELIMITER //
CREATE PROCEDURE view_by_isbn_in_day(isb int(11),dte date)
BEGIN
	SELECT COUNT(*) FROM TRANSACTION WHERE tDateTime like dte+'%' AND ISBN = isb;
END //

#call view_by_isbn_in_day(1501145258,'2020-11-25');

#6 Xem tổng số sách truyền thống tính theo mỗi ISBN được mua trong một ngày.
DELIMITER //
CREATE PROCEDURE view_paperbook_by_isbn_in_day(dte date)
BEGIN
	SELECT COUNT(*)
	FROM TRANSACTION
	WHERE tDateTime like dte+'%' AND ISBN IN (SELECT ISBN FROM PAPERBOOK);
END //

#call view_paperbook_by_isbn_in_day(1501145258,'2020-11-25');

#7 Xem tổng số sách điện tử được mua trong một ngày.
DELIMITER //
CREATE PROCEDURE view_ebook_in_day(dte date)
BEGIN
	SELECT COUNT(*)
	FROM TRANSACTION
	WHERE tDateTime like dte+'%'
	  AND ISBN IN (SELECT ISBN FROM PAPERBOOK)
	and model='A';
END //
# select * from transaction;
# select * from ebook;
# select * from bookstorage;
# insert into transaction values (2, 1234567894, '2020-01-01 11:11:11', 1, CURRENT_TIMESTAMP());
# update transaction set isbn = 1234567894 where DATE(ttime) = '2020-11-25';
# #call view_ebook_in_day('2020-12-06');
# update transaction set model = 'Hire' where tDateTime is not null;

#8 Xem tổng số sách điện tử được thuê trong một ngày.
DELIMITER //
CREATE PROCEDURE view_ebook_hire_in_day(dte date)
BEGIN
	SELECT COUNT(*)
	FROM TRANSACTION
	WHERE tDateTime like dte+'%'
	  AND ISBN IN (SELECT ISBN FROM PAPERBOOK)
	and model='B';
END //
select * from transaction;
#call view_ebook_hire_in_day('2020-12-06');

#9 Xem danh sách tác giả có số sách được mua nhiều nhất trong một ngày.
# select * from author;
# SELECT * FROM BOOK;
# select * from writtenby;
# INSERT INTO WRITTENBY VALUES (490547460, 1524763169);
# SELECT * FROM TRANSACTION;
# DELETE FROM TRANSACTION WHERE ISBN = 1524763136;
# INSERT INTO TRANSACTION VALUES (2, 1524763169,CURRENT_DATE()-10,'Buy',4,CURRENT_DATE()-4);
DELIMITER //
CREATE PROCEDURE view_author_with_most_books_buy_in_day(dte date)
BEGIN
	SELECT AUTHORSSN ,ISBN,count(*)
	FROM TRANSACTION T JOIN WRITTENBY W ON T.ISBN = W.BOOKISBN
    WHERE tDateTime like dte+'%'
    GROUP BY AUTHORSSN
    HAVING COUNT(ISBN) = (SELECT MAX(MYCOUNT)
    FROM (
    SELECT AUTHORSSN, COUNT(AUTHORSSN) as MYCOUNT
    FROM TRANSACTION,WRITTENBY WHERE ISBN = BOOKISBN GROUP BY AUTHORSSN
    ) mc
    );
END //

select * from transaction;
#call view_author_with_most_books_buy_in_day(current_date());

#10 ). Xem danh sách tác giả có số sách được mua nhiều nhất trong một tháng
# select month(current_date());
# DELIMITER //
# CREATE PROCEDURE view_author_with_most_books_buy_in_month(moth int)
# BEGIN
# 	SELECT AUTHORSSN FROM TRANSACTION AS T JOIN WRITTENBY AS W ON T.ISBN = W.BOOKISBN
#     WHERE tDateTime like moth+'%'
#     GROUP BY AUTHORSSN
#     HAVING COUNT(ISBN) = (SELECT MAX(MYCOUNT)
#     FROM (
#     SELECT AUTHORSSN, COUNT(AUTHORSSN) MYCOUNT
#     FROM TRANSACTION,WRITTENBY WHERE ISBN = BOOKISBN GROUP BY AUTHORSSN
#     ) mc
#     );
# END //
# SELECT * FROM TRANSACTION;
# SELECT YEAR(CURRENT_DATE());
# INSERT INTO TRANSACTION VALUES (3, '1524763136', CURRENT_DATE(), 'BUY', 5,NULL);
#11 Xem danh sách sách được mua nhiều nhất trong một tháng



#DROP PROCEDURE view_most_buy_book_in_month;
#DELIMITER //
#CREATE PROCEDURE view_most_buy_book_in_month(moth varchar(6))
#BEGIN
#	SELECT * FROM BOOK
#    WHERE ISBN IN (SELECT ISBN FROM TRANSACTION
#    WHERE  tDateTime like moth+'%' AND
#    ISBN =
#    (SELECT ISBN FROM TRANSACTION
#    GROUP BY ISBN
#   HAVING COUNT(ISBN) = (SELECT MAX(MYCOUNT)
#    FROM (
#    SELECT ISBN, COUNT(ISBN) MYCOUNT
#    FROM TRANSACTION GROUP BY ISBN
#   )
#    )));
#END //
#call view_most_buy_book_in_month(12,2020);





#12 Xem danh sách mua hàng được thanh toán bằng thẻ trong một ngày
# select * from transaction;
# SELECT * FROM CARDPAYMENT;
# SELECT * FROM TRANSFER;
# select * from sstored;
DELIMITER //
CREATE PROCEDURE view_trans_by_card_in_day(dte date)
BEGIN
	SELECT * FROM TRANSACTION
    WHERE tDateTime like dte+'%'
    AND PAYMENTID IN (SELECT ID FROM CARDPAYMENT);
END //

#call view_trans_by_card_in_day(CURRENT_DATE);
DROP PROCEDURE if exists add_author;
delimiter |
create procedure add_author(
Assn varchar(10),
nfname varchar(20),
nName varchar(20),
nlname varchar(20),
naddress varchar(20),
mail varchar(100),
phone varchar(15),
nsex char(1))
begin
        insert into author
        value (Assn,nfname,nName,nlname,naddress,phone,nsex,mail);
end |
DELIMITER  ;
select * from staff;
select * from author;
-- ------------------------
# CREATE TABLE BookStorage(
# 	StorageID INT,
# 	Address VARCHAR(100) NOT NULL,
# 	Name VARCHAR(20) not null,
# 	Email VARCHAR(100),
# 	PhoneNumber VARCHAR(10),
# 	PRIMARY KEY (StorageID)
# );
# create table bookstorage
# (
#     StorageID   int          not null
#         primary key,
#     Address     varchar(100) not null,
#     Name        varchar(20)  not null,
#     Email       varchar(100) null,
#     PhoneNumber varchar(15)  null
# );
drop procedure if exists add_BookStorage;
delimiter |
create procedure add_BookStorage(sname varchar(20),sadd varchar(100),mail varchar(100),phone varchar(15))
begin
    declare max int default 0;
select max(StorageID) into  max from bookstorage;
    if max is null then
        insert into bookstorage
        value (1,sadd,sname,mail,phone);
    else
        insert into bookstorage
        value (max+1,sadd,sname,mail,phone);
    end if;
end |
delimiter ;

-- drop table staff;
drop procedure if exists add_staff;
delimiter |
create procedure add_staff(nid varchar(10),
nfname varchar(20),
nmname varchar(20),
nlname varchar(20),
nmail varchar(100),
phone varchar(15),
nstype int ,
nsid int,
pass varchar(500))
begin
insert into staff
    value (nid,nfname,nmname,nlname,phone,nsid,pass,nmail,nstype);
end |
delimiter ;
select * from bookstorage;
#call add_staff('2020251201','Hà','Thu','Nguyễn','a@gmail.com','0123445566',1,1,'123456')
select * from staff;
drop procedure if exists show_publish;
delimiter |
create procedure show_publish()
begin
    select StorageID,Name,Address from bookstorage;
end |
delimiter ;
drop procedure if exists add_publish;
# create table publisher
# (
#     Name        varchar(50)  not null
#         primary key,
#     Code        varchar(20)  not null,
#     Address     varchar(100) null,
#     Email       varchar(20)  null,
#     PhoneNumber varchar(15)  null,
#     constraint Code
#         unique (Code)
# );
delimiter |
create procedure add_publish(
nname varchar(50),ncode varchar (20),naddr varchar(100),nmail varchar(100),phone varchar(15)
)
begin
    insert into publisher
    value (nname,ncode,naddr,phone,nmail);
end |
delimiter ;
select * from bookstorage;
select * from publisher;