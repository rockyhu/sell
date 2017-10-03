/**
 * Created by rockyhu on 2017/8/5.
 */
var express = require('express');
var config = require('./config');

var port = process.env.PORT || config.build.port;

var app = express();

var router = express.Router();

router.get('/', function (req, res, next) {
	req.url = '/index.html';
	next();
});

app.use(router);

// 获取data.json数据
var appData = require('./data.json');

// 路由模块
var apiRoutes = express.Router();

// 定义路由
apiRoutes.get('/seller', function (req, res) {
	res.json({
		errno: 0,
		data: appData.seller
	});
});

apiRoutes.get('/goods', function (req, res) {
	res.json({
		errno: 0,
		data: appData.goods
	});
});

apiRoutes.get('/ratings', function (req, res) {
	res.json({
		errno: 0,
		data: appData.ratings
	})
});

// 将定义的路由挂载到应用的路径上，之后便可通过/api/seller和/api/goods和/api/ratings访问数据
app.use('/api', apiRoutes);

app.use(express.static('./dist'));

module.exports = app.listen(port, function (err) {
	if(err) {
		console.log(err);
		return;
	}
	console.log('> Listening at http://localhost:' + port + '\n');
});