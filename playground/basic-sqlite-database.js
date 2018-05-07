var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate:{
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
})

var User = sequelize.define('user', {
	email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
//	force: true
}).then(function () {
	console.log('Everything is synced');

	User.findById(1).then(function(user){
		user.getTodos({ where:{completed: false}}).then(function (todos){
			todos.forEach(function (todo){
				console.log(todo.toJSON());
			});
		});
	});

	// User.create({
	// 	email:'abc123@gmail.com'
	// }).then(function(){
	// 	return Todo.create({
	// 		description:'clean yard'
	// 	});
	// }).then(function(todo){
	// 	User.findById(1).then(function(user){
	// 		user.addTodo(todo); //add multiple todos to a user with id 1
	// 	});
	// });

});


	// Todo.create({
	// 	description: 'Take out trash'
	// }).then(function(todo) {
	// 	return Todo.create({
	// 		description:'Clean the office'
	// 	});
	// }).then(function(){
	// 	//return Todo.findById(1)
	// 	// return Todo.findAll({
	// 	// 	where:{
	// 	// 		completed: false
	// 	// 	}
	// 	// });
	// 	return Todo.findAll({
	// 		where:{
	// 			description:{
	// 				$like: '%trash%'
	// 			}
	// 		}
	// 	});
	// }).then(function(todos){
	// 	todos.forEach(function(todo){
	// 		console.log(todo.toJSON());
	// 	});
	// 	//console.log(todo.toJSON());
	// }).catch(function (e) {
	// 	console.log(e);
	// });

