var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
	id:1,
	description: "Meet mom for lunch",
	completed: false
},{
	id:2,
	description: "Write a one page paper",
	completed: false
},
{
	id:3,
	description: "Walk the dog",
	completed: true
}
];

app.get('/todos', function(req, res){
	res.json(todos);
});

app.get('/', function(req, res){
	res.send('Todo API root');
});

app.listen(PORT, function(){
	console.log('express listening on port '+ PORT);
});