var connect = require('connect'), serveStatic = require('serve-static');

var app = connect();

app.use(serveStatic("QnA"));
app.listen(5000, function(){
	console.log('listening on 5000 port');
    console.log(__dirname+'/QnA');
});
