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

sequelize.sync({force: true}).then(function () {
	console.log('Everything is synced');

	Todo.create({
		description: 'Take out trash'
	}).then(function(todo) {
		return Todo.create({
			description:'Clean the office'
		});
	}).then(function(){
		//return Todo.findById(1)
		// return Todo.findAll({
		// 	where:{
		// 		completed: false
		// 	}
		// });
		return Todo.findAll({
			where:{
				description:{
					$like: '%trash%'
				}
			}
		});
	}).then(function(todos){
		todos.forEach(function(todo){
			console.log(todo.toJSON());
		});
		//console.log(todo.toJSON());
	}).catch(function (e) {
		console.log(e);
	});
});

