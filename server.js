var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');
var middleware = require('./middleware.js')(db);

app.get('/', function(req, res){
	res.send('Todo API root');
});

//GET /todos?completed=true&q=work
app.get('/todos', middleware.requiredAuthentication, function(req, res){
	var userId = req.user.get('id');
	var queryParams = req.query;
	var where = {userId:userId};
	var filteredTodos = [];

	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true')
		where.completed = true;
	else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false')
		where.completed = false;
	if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0)
		where.description = { $like: '%' + queryParams.q + '%' };

	db.todo.findAll({where: where}).then(function(todos){
		res.json(todos);
	}, function(e){
		res.status(500).send();
	});

});

//GET /todos/id
app.get('/todos/:id', middleware.requiredAuthentication, function(req, res){
	var userId = req.user.get('id');
	var todoId = parseInt(req.params.id, 10)
	db.todo.findOne({where: {id:todoId, userId:userId}}).then(function (todo){
		if (todo){
			res.json(todo.toJSON());	
		} else {
			res.status(404).send();
		}
	}, function(e){
		res.status(500).json(e);
	});

});

//POST /todos
app.post('/todos', middleware.requiredAuthentication, function(req, res){
	var body = _.pick(req.body, 'description', 'completed'); // parsed by bodyParser as JSON to read data in server, and then retured as an Object in req.body
	
	db.todo.create(body).then(function(todo){
		//res.json(todo.toJSON());
		req.user.addTodo(todo).then(function(){
			return todo.reload();
		}).then(function (todo){
			res.json(todo.toJSON());
		});
	}).catch(function (e){
		res.status(400).json(e);
	});
});

//DELETE /todos/:id
app.delete('/todos/:id', middleware.requiredAuthentication, function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var userId = req.user.get('id');

	db.todo.destroy({
	   	where: {
	      id: todoId,
	      userId:userId //this will be your id that you want to delete
	   	}
	}).then(function(rowsDeleted){ // rowDeleted will return number of rows deleted
		if (rowsDeleted === 0){
			res.status(400).json({ error: 'no todo item'});
		} else {
			res.status(204).send();
		}
	}, function(){
	    res.status(500).send(); 
	});

});

//PUT /todos/:id
app.put('/todos/:id', middleware.requiredAuthentication, function(req, res){
	var userId = req.user.get('id');
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed'); // parsed by bodyParse as JSON to read data in server, and then retured as an Object in req.body
	var attributes = {};

	if (body.hasOwnProperty('completed')){
		attributes.completed = body.completed;
	}
	
	if (body.hasOwnProperty('description')){
		attributes.description = body.description;
	} 

	db.todo.findOne({where:{id:todoId, userId:userId}}).then(function(todo){
			if(todo){
				todo.update(attributes).then(function (todo){
					res.json(todo.toJSON());
				}, function(e){
						res.status(400).json(e);
				});
			} else {
				res.status(404).send();
			}
		}, function(){
			res.status(500).send();
	});

});

//POST /users
app.post('/users', function(req, res){
	var body = _.pick(req.body, 'email', 'password');
	db.user.create(body).then(function(user){
		res.json(user.toPublicJSON());
	}, function(e){
		res.status(400).json(e);
	});
});

//POST /users/login
app.post('/users/login', function(req, res){
	var body = _.pick(req.body, 'email', 'password');
	var userInstance;
	
	db.user.authenticate(body).then(function(user){
		var token = user.generateToken('authentication');
		userInstance = user;

		return db.token.create({
			token:token
		});

	}).then(function(tokenInstance){
		res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
	}).catch(function(){
		res.status(401).send();	
	});	
});

//DELETE /users/login
app.delete('/users/login', middleware.requiredAuthentication, function(req, res){
	req.token.destroy().then(function(){
		res.status(204).send();
	}).catch(function (){
		res.status(500).send();
	})
});

db.sequelize.sync({force:true}).then(function(){
	app.listen(PORT, function(){
		console.log('express listening on port '+ PORT);
	});
});

