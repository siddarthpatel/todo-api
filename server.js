var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var _ = require('underscore');
var nextId = 1;
var todos = [];

function fetchTodo(todoId){
	var matchedTodo = _.findWhere(todos, {id: todoId});
	return matchedTodo;
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
	var body = _.pick(req.body, 'description', 'completed'); // parsed by bodyParse as JSON to read data in server, and then retured as an Object in req.body
	
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length == 0)
		return res.status(404).send();

	body.description = body.description.trim();
	var todo = addTodo(body)
	res.json(body);
});

app.listen(PORT, function(){
	console.log('express listening on port '+ PORT);
});