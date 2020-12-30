Drop database  if exists EBookStore_01;
CREATE DATABASE EBookStore_01;
use EBookStore_01;

drop table if exists Customer;
CREATE TABLE Customer(
	ID INT default 0,
	FName VARCHAR(20) NOT NULL,
	MName VARCHAR(20) NOT NULL,
	LName VARCHAR(20) NOT NULL,
	NickName VARCHAR(20) UNIQUE NOT NULL,
	Password VARCHAR(500) NOT NULL,
	DOB DATE,
	Sex CHAR(1),
	PhoneNumber VARCHAR(15) NOT NULL,
	Address VARCHAR(20) NOT NULL,
	Mail VARCHAR(100) NOT NULL,
	PRIMARY KEY (ID)
);

drop table if exists Payment;
CREATE TABLE Payment(
	ID INT,
	PRIMARY KEY(ID)
);

drop table if exists CardPayment;
CREATE TABLE CardPayment(
	ID INT,
	PRIMARY KEY (ID),
	FOREIGN KEY (ID) REFERENCES Payment(ID) ON DELETE CASCADE  ON UPDATE CASCADE
);

drop table if exists transfer;
CREATE TABLE Transfer(
	ID INT,
	Number INT UNIQUE NOT NULL,
	BankName VARCHAR(20),
	BranchName VARCHAR(20),
	PRIMARY KEY (ID),
	FOREIGN KEY (ID) REFERENCES Payment(ID) ON DELETE CASCADE  ON UPDATE CASCADE
);

drop table if exists book;
CREATE TABLE Book(
	ISBN decimal(15,0),
	Summary VARCHAR(500),
	Cost DECIMAL(10,2),
	Name VARCHAR(100) NOT NULL,
	PRIMARY KEY (ISBN)
);

drop table if exists ebook;
CREATE TABLE EBook(
	ISBN decimal(15,0),
	Address VARCHAR(100) UNIQUE NOT NULL,
	PRIMARY KEY (ISBN),
	FOREIGN KEY (ISBN) REFERENCES Book(ISBN) ON DELETE CASCADE  ON UPDATE CASCADE
);

drop table if exists paperbook;
CREATE TABLE PaperBook(
	ISBN decimal(15,0),
	PRIMARY KEY (ISBN)
);

drop table if exists Author;
CREATE TABLE Author(
	SSN VARCHAR(20),
	FName VARCHAR(20) NOT NULL,
	MName VARCHAR(20) NOT NULL,
	LName VARCHAR(20) NOT NULL,
	Address VARCHAR(100),
	Email VARCHAR(100),
	PhoneNumber VARCHAR(15),
	PRIMARY KEY (SSN)
);

drop table if exists Publisher;
CREATE TABLE Publisher(
	Name VARCHAR(50),
	Code VARCHAR(20) UNIQUE NOT NULL,
	Address VARCHAR(100),
	Email VARCHAR(100),
	PhoneNumber VARCHAR(15),
	PRIMARY KEY (Name)
);

drop table if exists Staff;
CREATE TABLE Staff(
	ID char(10),
	FName VARCHAR(20) NOT NULL,
	MName VARCHAR(20) NOT NULL,
	LName VARCHAR(20) NOT NULL,
	Email VARCHAR(20),
	PhoneNumber VARCHAR(15),
	PRIMARY KEY (ID)
);

drop table if exists BookStorage;
CREATE TABLE BookStorage(
	StorageID INT,
	Address VARCHAR(100) NOT NULL,
	Name VARCHAR(20) not null,
	Email VARCHAR(100),
	PhoneNumber VARCHAR(15),
	PRIMARY KEY (StorageID)
);

drop table if exists CreditCard;
CREATE TABLE CreditCard(
	CustomerID INT NOT NULL,
	Code VARCHAR(20) NOT NULL,
	FName VARCHAR(20) NOT NULL,
	MName VARCHAR(20) NOT NULL,
	LName VARCHAR(20) NOT NULL,
	BankName VARCHAR(20) NOT NULL,
	BranchName VARCHAR(20) NOT NULL,
	EndDate DATE NOT NULL,
	PRIMARY KEY (CustomerID, Code),
	FOREIGN KEY (CustomerID) REFERENCES Customer(ID)ON DELETE CASCADE  ON UPDATE CASCADE
);

USE EBookStore_01;
drop table if exists Transaction;
CREATE TABLE Transaction(
	CustomerID INT,
	ISBN DECIMAL(15,0),
	tDateTime DATETIME,
	FLAG DECIMAL(1,0) not null, -- thuốc tính xét trang thai tranh toán thành cong
	amount int not null, -- số mỗi quyển sách trong mỗi giao dịch
	PRIMARY KEY (CustomerID, ISBN, tDateTime),
	FOREIGN KEY (CustomerID) REFERENCES Customer(ID)ON DELETE CASCADE  ON UPDATE CASCADE,
	FOREIGN KEY (ISBN) REFERENCES Book(ISBN)ON DELETE CASCADE  ON UPDATE CASCADE
);

drop table if exists WrittenBy;
CREATE TABLE WrittenBy(
	AuthorSSN VARCHAR(20),
	BookISBN DECIMAL(15,0),
	PRIMARY KEY (AuthorSSN, BookISBN),
	FOREIGN KEY (AuthorSSN) REFERENCES Author(SSN)ON DELETE CASCADE  ON UPDATE CASCADE,
	FOREIGN KEY (BookISBN) REFERENCES Book(ISBN)ON DELETE CASCADE  ON UPDATE CASCADE
);

drop table if exists Contact;
CREATE TABLE Contact(
	StaffID char(10),
	AuthorSSN VARCHAR(20),
	PRIMARY KEY (StaffID, AuthorSSN),
	FOREIGN KEY (AuthorSSN) REFERENCES Author(SSN)ON DELETE CASCADE  ON UPDATE CASCADE,
	FOREIGN KEY (StaffID) REFERENCES Staff(ID)ON DELETE CASCADE  ON UPDATE CASCADE
);

drop table if exists  OrderBook;
CREATE TABLE OrderBook(
	StaffID char(10),
	Publisher VARCHAR(100),
	OrderTime DateTIME NOT NULL, -- thời gian nhân viện liên lạc với nhà xuất bản
	PRIMARY KEY (StaffID, Publisher),
	FOREIGN KEY (StaffID) REFERENCES Staff(ID) ON DELETE CASCADE  ON UPDATE CASCADE,
	FOREIGN KEY (Publisher) REFERENCES Publisher(Name)ON DELETE CASCADE  ON UPDATE CASCADE
);

drop table if exists Commented;
CREATE TABLE Commented(
	BookID DECIMAL(15,0),
	CustomerID INT,
	PRIMARY KEY (BookID, CustomerID),
	FOREIGN KEY (BookID) REFERENCES Book(ISBN)ON DELETE CASCADE  ON UPDATE CASCADE,
	FOREIGN KEY (CustomerID) REFERENCES Customer(ID)ON DELETE CASCADE  ON UPDATE CASCADE
);

drop table if exists sStored;
CREATE TABLE sStored (
	ISBN DECIMAL(15,0),
	StorageID INT,
	StaffID Char(10) NOT NULL,
	PRIMARY KEY (ISBN,StorageID),
	unique (ISBN,StaffID),
	amount int not null ,
	FOREIGN KEY (ISBN) REFERENCES Book(ISBN),
	FOREIGN KEY (StaffID) REFERENCES Staff(ID),
	FOREIGN KEY (StorageID) REFERENCES BookStorage(StorageID) ON DELETE CASCADE  ON UPDATE CASCADE
);

drop table if exists Inbook;
CREATE TABLE Inbook
(
    ISBN      DECIMAL(15,0),
    StorageID INT,
    import  DATETIME, -- thơi gian nhập sách vào kho
    amount int,
    primary key (ISBN,StorageID,import,amount),
    foreign key (ISBN,StorageID) references sStored(ISBN,StorageID) on delete cascade on update cascade
);

drop table if exists outbook;
CREATE TABLE outbook
(
    ISBN      DECIMAL(15,0),
    StorageID INT,
    Otime  DATETIME, -- thơi gian xuat khoa cua sách
    amount int, -- so luong môi quyen sach xuat kho
    primary key (ISBN,StorageID,Otime,amount),
    foreign key (ISBN,StorageID) references sStored(ISBN,StorageID) on delete cascade on update cascade
);

drop table if exists Field;
CREATE TABLE Field(
	BookID DECIMAL(15,0),
	AField VARCHAR(20),
	PRIMARY KEY(BookID, AField),
	FOREIGN KEY (BookID) REFERENCES Book(ISBN)ON DELETE CASCADE  ON UPDATE CASCADE
);

drop table if exists Keyword;
CREATE TABLE Keyword(
	BookID DECIMAL(15,0),
	AKeyword VARCHAR(20),
	PRIMARY KEY(BookID, AKeyword),
	FOREIGN KEY(BookID) REFERENCES Book(ISBN)ON DELETE CASCADE  ON UPDATE CASCADE
);

drop table if exists  Response;
CREATE TABLE Response(
	BookID DECIMAL(15,0),
	CustomerID INT,
	Time DATETIME,
	Text VARCHAR(200),
	PRIMARY KEY (BookID, CustomerID, Time, Text),
	FOREIGN KEY(BookID, CustomerID) REFERENCES Commented(BookID, CustomerID)ON DELETE CASCADE  ON UPDATE CASCADE
);

drop table if exists Cart;
CREATE table Cart(
    customerID INT,
    BookID DECIMAL(15,0),
    amoutBook INT,
    PRIMARY KEY (customerID, BookID),
    FOREIGN KEY(CustomerID) REFERENCES Customer(ID)ON DELETE CASCADE  ON UPDATE CASCADE,
    FOREIGN KEY(BookID) REFERENCES Book(ISBN)ON DELETE CASCADE  ON UPDATE CASCADE
);

ALTER TABLE Book ADD PubName VARCHAR(100) NOT NULL;
ALTER TABLE Book ADD CONSTRAINT FK_PubName FOREIGN KEY (PubName) REFERENCES Publisher(Name)ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE Book ADD Year int;
ALTER TABLE Book ADD Time INT;

ALTER TABLE Transaction ADD PaymentID INT NOT NULL;
ALTER TABLE Transaction ADD FOREIGN KEY (PaymentID) REFERENCES Payment(ID)ON DELETE CASCADE  ON UPDATE CASCADE;
alter table transaction add model int; #=0 mua =1 thuê
alter table transaction add sid int; #kho nhận xuất sách

ALTER TABLE CreditCard ADD CPaymentID INT NOT NULL;
ALTER TABLE CreditCard ADD FOREIGN KEY (CPaymentID) REFERENCES CardPayment(ID) ON DELETE CASCADE  ON UPDATE CASCADE;

ALTER TABLE Staff ADD SID INT NOT NULL;
ALTER TABLE Staff ADD FOREIGN KEY (SID) REFERENCES BookStorage(StorageID) ON DELETE CASCADE  ON UPDATE CASCADE;
alter table staff add spassword varchar(500);
alter table staff add stype int;

ALTER TABLE author ADD SEX CHAR(1);




