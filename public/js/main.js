'use strict';

var QuestionList = (function(){
	var $instance = {};
	$instance.event = {};

	$instance.all = [];
	$instance.save = function(input){
		return m.request({
			method: 'POST',
			url: './questions',
			data: input
		});
	};
	$instance.loadAll = function(){
		m.request('./questions').then(function(input){
			var i, l = input.questions.length;
			for(i = 0; i < l; i++){
				QuestionList.push(input.questions[i]);
			}
		});
		return QuestionList;
	};
	$instance.push = function(question){
		QuestionList.all.push(Question.create(question));
	}
	$instance.mountTo = function(element){
		m.mount(element, {
			view: QuestionList.view
		});
		return QuestionList;
	}

	$instance.event.save = function(event){
		var input = event.target;
		var isReturn = (event.keyCode == 13);
		if(isReturn && input.value){
			QuestionList.save({
				question: {
					text: input.value
				}
			});
			input.value = '';
		}
	};
	$instance.view = function(){
		return [
			QuestionList.all.map(function(question){
				return m('li', question.view());
			}),
			m('li', [
				m('input', {onkeyup: QuestionList.event.save})
			])
		];
	};

	return $instance;
})();

var Question = (function(){
	var $Class = {};
	var $instance = {};

	$Class.create = function(){
		var instance = Object.create($instance);
		instance.$Class = $Class;
		instance.construct.apply(instance, arguments);
		return instance;
	}

	$instance.construct = function(db){
		var instance = this;
		instance.db = db;
	}
	$instance.view = function(){
		var instance = this;
		return [
			m('h2', instance.db.text)
		];
	};

	return $Class;
})();


document.addEventListener('DOMContentLoaded', function(){
	var socket = io('http://localhost:3000');

	QuestionList
		.loadAll()
		.mountTo(document.getElementById('questions'));

	socket.on('newQuestion', function(data){
		QuestionList.push(data.question);
		m.redraw();
	});
});
