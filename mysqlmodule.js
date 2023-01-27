const mysql = require('mysql');

exports.connection = function () {
	con = mysql.createConnection({
		host: '',
		user: '',
		password: ''
	});
	return con;
};