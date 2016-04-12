var connect = require('connect'), serveStatic = require('serve-static');

var app = connect();

app.use(serveStatic("QnA"));
app.listen(5001, function(){
	console.log('TEST SERVER >>>>>>>> listening on 5001 port');
    console.log(__dirname+'/QnA');
});
