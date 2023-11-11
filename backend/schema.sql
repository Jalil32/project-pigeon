CREATE TABLE user_login_detail(
	UserID					INT NOT NULL,
	PasswordHashed			VARCHAR(250) NOT NULL,
	PasswordSalt			VARCHAR(100) NOT NULL,
	EmailAddress			VARCHAR(100) NOT NULL,
	PRIMARY KEY (UserID, EmailAddress),
);

CREATE TABLE user_detail(
	UserID					INT NOT NULL,
	FirstName				VARCHAR(20) NOT NULL,
	LastName				VARCHAR(20) NOT NULL,
	EmailAddress			VARCHAR(100) NOT NULL,
	CONSTRAINT FK_UserDetail FOREIGN KEY (UserID, EmailAddress)
	REFERENCES user_login_detail(UserID, EmailAddress)
);