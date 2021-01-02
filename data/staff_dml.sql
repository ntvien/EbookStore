use ebookstore_01;
# INSERT INTO Publisher VALUE ('Oxford University Press', '5555', 'JP', 'ph@gmail.com', '(203) 455155');
# INSERT INTO Publisher VALUE ('HarperFlamingo Canada', '5556', 'US', 'crown@gmail.com', '(212) 785470');
# INSERT INTO Publisher VALUE ('HarperPerennial', '5557', 'EN', 'chuster@gmail.com', '(020) 7355210');
# INSERT INTO Publisher VALUE ('Farrar Straus Giroux', '5558', 'VN', 'ph@gmail.com', '(203) 5532535');
# INSERT INTO Publisher VALUE ('W. W. Norton &amp; Company', '5559', 'China', 'crown@gmail.com', '(212) 782 9000');
# INSERT INTO Publisher VALUE ('Putnam Pub Group', '5551', 'Korea', 'chuster@gmail.com', '(020) 2332500');
# INSERT INTO Publisher VALUE ('Berkley Publishing Group', '2353', 'Qatar', 'ph@gmail.com', '(203) 4535653');
# INSERT INTO Publisher VALUE ('Audioworks', '1543', 'Canada', 'crown@gmail.com', '(212) 7822200');
# INSERT INTO Publisher VALUE ('Random House', '1145', 'Germany', 'chuster@gmail.com', '(020) 7316 1550');
# INSERT INTO Publisher VALUE ('Scribner', '9000', 'ThaiLan', 'ph@gmail.com', '(203) 454223');
# INSERT INTO BookStorage VALUE (201, 'Gia Lai', 'Phuong Nam', 'pn@gmail.com', '0956632156');
# INSERT INTO BookStorage VALUE (202, 'Ha Noi', 'Hoan Kiem', 'hk@gmail.com', '026623431');
# INSERT INTO BookStorage VALUE (203, 'Ho Chi Minh', 'Phuong Nam', 'wde@gmail.com', '095661156');
# INSERT INTO BookStorage VALUE (204, 'Vung Tau', 'Hoan Kiem', 'werw@gmail.com', '0266234656');
# INSERT INTO BookStorage VALUE (205, 'Binh Phuoc', 'Phuong Nam', 'asb@gmail.com', '095663256');
# INSERT INTO BookStorage VALUE (206, 'Quang Binh', 'Hoan Kiem', 'qq@gmail.com', '0266232342');
# INSERT INTO BookStorage VALUE (207, 'Quang Ngai', 'Phuong Nam', 'wteqt@gmail.com', '0956632156');
# INSERT INTO BookStorage VALUE (208, 'Da Lat', 'Hoan Kiem', 'qrqt@gmail.com', '0266234656');
# INSERT INTO BookStorage VALUE (209, 'KomTum', 'Phuong Nam', 'qwtq@gmail.com', '0956632156');
# INSERT INTO BookStorage VALUE (210, 'Quy Nhon', 'Hoan Kiem', 'ngjt@gmail.com', '0266234656');
# INSERT INTO Staff VALUE (1,'Nguyen', 'Khanh', 'A', 'nva@gmail.com', 0956132645, 201);
# INSERT INTO Staff VALUE (2, 'Tran', 'Thi', 'B', 'ntbc@gmail.com', 032653656, 202);
# INSERT INTO Staff VALUE (3, 'Le', 'Van', 'C', 'nvae@gmail.com', 0956132645, 203);
# INSERT INTO Staff VALUE (4, 'Dao', 'Thanh', 'D', 'ttb@gmail.com', 0326542364, 204);
# INSERT INTO Staff VALUE (5, 'Pham', 'Quynh', 'E', 'dva@gmail.com', 0956132645, 205);
# INSERT INTO Staff VALUE (6, 'Nguyen', 'Thi', 'F', 'htb@gmail.com', 0323333656, 206);
# INSERT INTO Staff VALUE (7, 'Tran', 'Van', 'G', 'ava@gmail.com', 0956133334, 207);
# INSERT INTO Staff VALUE (8, 'Dao', 'Thi', 'H', 'stb@gmail.com', 032121111, 208);
# INSERT INTO Staff VALUE (9, 'Nguyen', 'Van', 'I', 'sdga@gmail.com', 0956136665, 209);


INSERT INTO BookStorage VALUE (0, 'Center', 'USA', 'pn@gmail.com', '0956632156');
INSERT INTO Staff VALUE ("1223456789", 'Le', 'Thi', 'J','sdfb@gmail.com', 0325325252, 0,2333,0);

select * from staff;
# select * from author;
# select * from writtenby;
# select * from author;
select * from book;
select * from inbook;
select * from sstored;
select * from author;
-- Insert ten tac gia
select * from staff;
#######################################################
# Kiểm tra mật khẩu cho nhân viên

drop procedure if exists check_pass_staff;
delimiter |
create procedure check_pass_staff(s_ssn varchar(10),spass varchar(500))
begin
    declare checkid varchar(500) default null;
    select spassword into checkid from staff where s_ssn=ID;
    if (checkid!=spass)or checkid is null then
        SIGNAL SQLSTATE '45001'
			SET MESSAGE_TEXT = 'Mat khau khong hop le';
    else select FName,MName,LName,stype,SID,PhoneNumber,Email from staff where s_ssn=ID;
    end if ;

end |
delimiter ;
# call check_pass_staff('0123456789','2333')
# call check_pass_staff('123','2333')

select * from author;
select * from writtenby;
select * from book;
select * from paperbook;
select * from ebook;
select * from sstored;
select amount+1 from inbook;
select * from staff;

# select * from publisher;

#insert into book values (2146563245, NULL, NULL, 16.47, 'Herry Potta'

###########################################################
# kiểm tra xem sách đã tồn tại hay chưa


#insert into book values (2146563245, NULL, NULL, 16.47, 'Herry Potta'

use ebookstore_01;
drop procedure if exists check_book_exit;
delimiter |
create procedure check_book_exit(
nISBN    decimal(15)
)
begin
    select Name,PubName,Year,Cost from book where ISBN=nISBN;
end |
delimiter ;
drop procedure if exists import_book;
#1 Cập nhật thông tin về sách khi sách được nhập kho.
# create table book
# (
#     ISBN    decimal(15)    not null
#         primary key,
#     Image   varchar(100)   null,
#     Summary varchar(500)   null,
#     Cost    decimal(10, 2) null,
#     Name    varchar(100)   not null,
#     PubName varchar(100)   not null,
#     Year    year           null,
#     Time    int            null,
#     constraint FK_PubName
#         foreign key (PubName) references publisher (Name)
#             on update cascade on delete cascade
# );
#####################################################################
# Thêm sách vào hệ thống


DELIMITER //
CREATE PROCEDURE import_book(isb decimal(15,0),sum varchar(500),
ccost decimal(10,2),
cname varchar(100),
pub varchar(50),
yr int,
tme int(11),
caddress varchar(100),
snid char(10),
countb int
)
BEGIN
declare ids int default 0;
select  sid into ids from staff where ID=snid;
	insert into book values (isb, sum, ccost, cname, pub, yr, tme);
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
END //
DELIMITER ;

#  SELECT NAME FROM PUBLISHER;
#  INSERT INTO BOOK VALUES (1234567891,NULL,NULL,15.15,'Eat, love and pray','Crown',2016,1);
# call import_book(1234567892,NULL,NULL,15.15,'Come','Crown',2016,1, NULL);
# call import_book(1234567894,NULL,NULL,15.15,'Get out','Crown',2019,10, 'google.com');
# delete from book where isbn =1234567892;
# select * from paperbook;
#2 Cập nhật thông tin về sách khi sách được xuất kho

##########################################################################
# thên tác giả cho sách
drop procedure if exists writeby;
delimiter |
create procedure writeby(nisbn decimal(15,0),nssn varchar(20))
begin
    insert into writtenby
    value (nssn, nisbn );
end |
delimiter ;
select * from writtenby;
select * from field;

#########################################
# cập nhật thông tin bảng nhập xuất kho
use ebookstore_01;
drop procedure if exists update_in;
delimiter |
create procedure update_in(nsid int,namount int,nisbn decimal(15),nstaffID char(10))
begin
    if (nsid in (select StorageID from sstored)) then
    update sstored
        set amount=amount+namount
    where ISBN=nisbn and StorageID=nsid;
    else
        insert into sstored value(nisbn,nsid,nstaffID,namount);
        end if;
     insert into Inbook
#     ISBN      decimal(15) not null,
#     StorageID int         not null,
#     import    datetime    not null,
#     amount    int         not null,
        value(nisbn,nsid,CURRENT_TIMESTAMP(),namount);

end |
delimiter ;
select * from sstored;
select * from inbook;
select * from book;
select * from publisher;
select * from bookstorage;
select * from staff;
#     Summary varchar(500)   null,
#     Cost    decimal(10, 2) null,
#     Name    varchar(100)   not null,
#     PubName varchar(100)   not null,
#     Year    int            null,
#     Time    int            null,
#############################################################
# cập nhật thông tin sách
drop procedure if exists update_info;
delimiter |
create procedure update_info(
oisbn decimal(15,0),
sum varchar(500),
ncost decimal(10,2),
nname varchar (100),
pub varchar(100),
yr int,
ntime int)
begin
update book
    set Summary=sum,
        Cost=ncost,
        Name=nname,
        PubName=pub,
        Year=yr,
        Time=ntime
    where oisbn=ISBN;
end|
delimiter ;
select * from book;
#
#
#
#
# DELIMITER //
# CREATE PROCEDURE export_book(isb decimal(15),oamount int,sid char(10))
# BEGIN
# 	#DELETE FROM paperbook where isbn = isb;
# 	declare ids int default  0;
# 	select SID into ids from staff where ID =sid;
#     insert  into Outbook
# #     ISBN      decimal(15) not null,
# #     StorageID int         not null,
# #     Otime     datetime    not null,
# #     amount    int         not null,
#     value (isb,sid,curdate()+current_time(),oamount);
# 	update sstored
# 	    set amount=amount-oamount
#     where ISBN=isb;
# END //
# call export_book(1234567892);

#3 Cập nhật thông tin giao dịch khi giao dịch trực tuyến gặp sự cố.
# select * from transaction;
# DELIMITER //
# CREATE PROCEDURE upd_trans(cus int(11), isb int(11), dt datetime, pid int(11), tt datetime)
# BEGIN
# 	update transaction set tDateTime = dt, paymentid = pid, ttime = tt
#     where customerid = cus and isbn = isb;
# END//
# call upd_trans(3,1501145258,'2020-01-01 11:12:43',2,'2020-11-25 22:19:34');

#4 ). Xem tất cả các sách tính theo ISBN được mua trong một ngày.
# DELIMITER //
# CREATE PROCEDURE view_by_isbn(isb int(11),newday date)
# BEGIN
# 	SELECT COUNT(*) FROM TRANSACTION WHERE ISBN = isb and tDateTime like newday+'%';
# END //
# call view_by_isbn(1501145258);

#5 Xem tổng số sách tính theo mỗi ISBN được mua trong một ngày
# select 'ahi';
# SELECT 12;
# SELECT DATE('2020-20-20');
# SELECT CURRENT_TIMESTAMP();
# select DATE('2020-12-05 23:22:22');
# select * from transaction;
# select * from cardpayment;
# select * from transaction where DATE(ttime) = '2020-11-25';
# drop procedure view_by_isbn_in_day;
# DELIMITER //
# CREATE PROCEDURE view_by_isbn_in_day(isb int(11),dte date)
# BEGIN
# 	SELECT COUNT(*) FROM TRANSACTION WHERE tDateTime like dte+'%' AND ISBN = isb;
# END //
#
# call view_by_isbn_in_day(1501145258,'2020-11-25');
#
# #6 Xem tổng số sách truyền thống tính theo mỗi ISBN được mua trong một ngày.
# DELIMITER //
# CREATE PROCEDURE view_paperbook_by_isbn_in_day(dte date)
# BEGIN
# 	SELECT COUNT(*)
# 	FROM TRANSACTION
# 	WHERE tDateTime like dte+'%' AND ISBN IN (SELECT ISBN FROM PAPERBOOK);
# END //
#
# CALL view_paperbook_by_isbn_in_day(1501145258,'2020-11-25');
#
# #7 Xem tổng số sách điện tử được mua trong một ngày.
# DELIMITER //
# CREATE PROCEDURE view_ebook_in_day(dte date)
# BEGIN
# 	SELECT COUNT(*)
# 	FROM TRANSACTION
# 	WHERE tDateTime like dte+'%'
# 	  AND ISBN IN (SELECT ISBN FROM PAPERBOOK)
# 	and model='A';
# END //
# # select * from transaction;
# # select * from ebook;
# # select * from bookstorage;
# # insert into transaction values (2, 1234567894, '2020-01-01 11:11:11', 1, CURRENT_TIMESTAMP());
# # update transaction set isbn = 1234567894 where DATE(ttime) = '2020-11-25';
# # call view_ebook_in_day('2020-12-06');
# # update transaction set model = 'Hire' where tDateTime is not null;
#
# #8 Xem tổng số sách điện tử được thuê trong một ngày.
# DELIMITER //
# CREATE PROCEDURE view_ebook_hire_in_day(dte date)
# BEGIN
# 	SELECT COUNT(*)
# 	FROM TRANSACTION
# 	WHERE tDateTime like dte+'%'
# 	  AND ISBN IN (SELECT ISBN FROM PAPERBOOK)
# 	and model='B';
# END //
# select * from transaction;
# call view_ebook_hire_in_day('2020-12-06');
#
# #9 Xem danh sách tác giả có số sách được mua nhiều nhất trong một ngày.
# # select * from author;
# # SELECT * FROM BOOK;
# # select * from writtenby;
# # INSERT INTO WRITTENBY VALUES (490547460, 1524763169);
# # SELECT * FROM TRANSACTION;
# # DELETE FROM TRANSACTION WHERE ISBN = 1524763136;
# # INSERT INTO TRANSACTION VALUES (2, 1524763169,CURRENT_DATE()-10,'Buy',4,CURRENT_DATE()-4);
# DELIMITER //
# CREATE PROCEDURE view_author_with_most_books_buy_in_day(dte date)
# BEGIN
# 	SELECT AUTHORSSN ,ISBN,count(*)
# 	FROM TRANSACTION T JOIN WRITTENBY W ON T.ISBN = W.BOOKISBN
#     WHERE tDateTime like dte+'%'
#     GROUP BY AUTHORSSN
#     HAVING COUNT(ISBN) = (SELECT MAX(MYCOUNT)
#     FROM (
#     SELECT AUTHORSSN, COUNT(AUTHORSSN) as MYCOUNT
#     FROM TRANSACTION,WRITTENBY WHERE ISBN = BOOKISBN GROUP BY AUTHORSSN
#     ) mc
#     );
# END //
#
# select * from transaction;
-- call view_author_with_most_books_buy_in_day(current_date());

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
# DROP PROCEDURE view_most_buy_book_in_month;
# DELIMITER //
# CREATE PROCEDURE view_most_buy_book_in_month(moth varchar(6))
# BEGIN
# 	SELECT * FROM BOOK
#     WHERE ISBN IN (SELECT ISBN FROM TRANSACTION
#     WHERE  tDateTime like moth+'%' AND
#     ISBN =
#     (SELECT ISBN FROM TRANSACTION
#     GROUP BY ISBN
#     HAVING COUNT(ISBN) = (SELECT MAX(MYCOUNT)
#     FROM (
#     SELECT ISBN, COUNT(ISBN) MYCOUNT
#     FROM TRANSACTION GROUP BY ISBN
#     )
#     )));
# END //
-- CALL view_most_buy_book_in_month(12,2020);

#12 Xem danh sách mua hàng được thanh toán bằng thẻ trong một ngày
# select * from transaction;
# SELECT * FROM CARDPAYMENT;
# SELECT * FROM TRANSFER;
# select * from sstored;
# DELIMITER //
# CREATE PROCEDURE view_trans_by_card_in_day(dte date)
# BEGIN
# 	SELECT * FROM TRANSACTION
#     WHERE tDateTime like dte+'%'
#     AND PAYMENTID IN (SELECT ID FROM CARDPAYMENT);
# END //

-- call view_trans_by_card_in_day(CURRENT_DATE);

#########################################################
# Thêm tác giả vào hệ thống
DROP PROCEDURE if exists add_author;
delimiter |
create procedure add_author(
Assn varchar(10),
nfname varchar(20),
nName varchar(20),
nlname varchar(20),
naddress varchar(100),
mail varchar(100),
phone varchar(15),
nsex char(1))
begin
        insert into author
        value (Assn,nfname,nName,nlname,naddress,mail, phone,nsex);
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

################################################
# Thêm kho vào hệ thống


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
# drop table if exists Staff;
# CREATE TABLE Staff(
# ID          char(10)     not null
#         primary key,
#     FName       varchar(20)  not null,
#     MName       varchar(20)  not null,
#     LName       varchar(20)  not null,
#     PhoneNumber varchar(15)  null,
#     SID         int          not null,
#     spassword   varchar(500) not null,
#     Email       varchar(100) null,# );
-- drop table staff;
###########################
# Thêm nhân viên cho sách

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
    value (nid,nfname,nmname,nlname,nmail,phone,nsid,pass,nstype);
end |
delimiter ;

select * from bookstorage;
-- call add_staff('2020251201','Hà','Thu','Nguyễn','a@gmail.com','0123445566',1,1,'123456')
select * from staff;
drop procedure if exists show_publish;
delimiter |
create procedure show_publish()
begin
    select StorageID,Name,Address from bookstorage;
end |
delimiter ;

####################################################
# cập nhật nhà xuất bản

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
    value (nname,ncode,naddr,nmail,phone);
end |
delimiter ;
use ebookstore_01;
select * from bookstorage;
select * from publisher;
select bookstorage.StorageID,Address,Name,Email,PhoneNumber,sum(amount) as total
from bookstorage left join  sstored s on bookstorage.StorageID = s.StorageID
group by (bookstorage.StorageID);
select * from staff;
select * from inbook;
select * from inbook where '2020-12-27' like date (import);
select * from transaction join customer c on c.ID = transaction.CustomerID Where FLAG=0;

########################################################
# Cập nhật trạng thái giao dịch


drop procedure if exists update_trangthai;
delimiter |
create procedure update_trangthai(
idcus int, nisbn decimal(15),ndate datetime,nsid int)
begin
    declare fl int default 0;
    declare sl int default 0;
    declare slstore int default 0;
    select FLAG into fl from transaction where tDateTime=ndate and CustomerID=idcus and nisbn=ISBN;
    select amount into sl from transaction where tDateTime=ndate and CustomerID=idcus and nisbn=ISBN;
    if (fl=0) then
        update transaction set FLAG=1,sid=nsid where tDateTime=ndate and CustomerID=idcus and nisbn=ISBN;
    else
        if (fl=1) then
            select amount into slstore from sstored where nisbn=ISBN and nsid=StorageID;
            if (slstore<sl) then
                SIGNAL SQLSTATE '45003'
			    SET MESSAGE_TEXT = 'Kho không đủ số lượng để xuất hóa đơn này';
            else
                insert into outbook value(nisbn,nsid,CURRENT_TIME(),sl);
                update sstored set amount=amount-sl  where nisbn=ISBN and nsid=StorageID;
                update transaction set FLAG=2 where tDateTime=ndate and CustomerID=idcus and nisbn=ISBN;
            end if ;

            end if ;

        end if ;
end |
delimiter ;
select * from sstored;
select * from transaction;