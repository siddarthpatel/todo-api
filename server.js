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

function fetchTodo(todoId){
	var todo;
	for (var i=0; i<todos.length; i++){
		if(todos[i].id === todoId){
			todo = todos[i];
			return todo;
		}
	}
}

app.get('/', function(req, res){
	res.send('Todo API root');
});

app.get('/todos', function(req, res){
	res.json(todos);
});

app.get('/todos/:id', function(req, res){
	var todo = fetchTodo(parseInt(req.params.id, 10));

	if (todo)
		res.json(todo);
	else
		res.status(404).send();
});

app.listen(PORT, function(){
	console.log('express listening on port '+ PORT);
});