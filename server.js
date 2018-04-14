var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var nextId = 1;
var todos = [/*{
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
}*/
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

function addTodo(todo){
	todo.id = nextId;
	todos.push(todo);
	nextId = nextId + 1;
	return todo;
}

app.get('/', function(req, res){
	res.send('Todo API root');
});

//GET/todos
app.get('/todos', function(req, res){
	res.json(todos);
});

//GET/todos/id
app.get('/todos/:id', function(req, res){
	var todo = fetchTodo(parseInt(req.params.id, 10));

	if (todo)
		res.json(todo);
	else
		res.status(404).send();
});

//POST/todos
app.post('/todos', function(req, res){
	var body = req.body; // parsed by bodyParse as JSON to read data in server, and then retured as an Object in req.body
	var todo = addTodo(body)
	res.json(body);
});

app.listen(PORT, function(){
	console.log('express listening on port '+ PORT);
});