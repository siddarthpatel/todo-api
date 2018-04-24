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

function deleteTodo(todoId){
	var todoToDelete = _.findWhere(todos, {id: todoId});
	todos = _.without(todos, todoToDelete)
	return todoToDelete;
}

app.get('/', function(req, res){
	res.send('Todo API root');
});

//GET /todos?completed=true
app.get('/todos', function(req, res){
	var queryParams = req.query;
	var filteredTodos = todos;

	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true')
		filteredTodos = _.where(todos, {completed: true});
	else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false')
		filteredTodos = _.where(todos, {completed: true});

	res.json(filteredTodos);
});

//GET /todos/id
app.get('/todos/:id', function(req, res){
	var todo = fetchTodo(parseInt(req.params.id, 10));

	if (todo)
		res.json(todo);
	else
		res.status(404).send();
});

//POST /todos
app.post('/todos', function(req, res){
	var body = _.pick(req.body, 'description', 'completed'); // parsed by bodyParser as JSON to read data in server, and then retured as an Object in req.body
	
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length == 0)
		return res.status(404).send();

	body.description = body.description.trim();
	var todo = addTodo(body)
	res.json(todo);
});

//DELETE /todos/:id
app.delete('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var todo = fetchTodo(todoId);

	if (todo){
		var deletedTodo = deleteTodo(todoId);
		res.json(deletedTodo);
		res.status(200).send();	
	} 
	else
		res.status(404).send();
});

//PUT /todos/:id
app.put('/todos/:id', function(req, res){
	var matchedTodo = fetchTodo(parseInt(req.params.id, 10))
	var body = _.pick(req.body, 'description', 'completed'); // parsed by bodyParse as JSON to read data in server, and then retured as an Object in req.body
	var validAttributes = {};

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed'))
		return res.status(400).send();
	

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')){
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes)
	res.json(matchedTodo);
});

app.listen(PORT, function(){
	console.log('express listening on port '+ PORT);
});