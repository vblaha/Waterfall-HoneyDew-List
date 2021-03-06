$(function () {

  const render = function () {

    // Empty our output divs
    $('#todos').empty();

    // Turn off any click listeners from our update items
    $('add-new-todo').off('click');

    // Run Queries!
    // ==========================================
    getTodos();
  }
  /**
   * TODO schema = { text: 'my todo text', completed: false }
   */
  const renderTodo = function (outputElement, todo) {
    const output = $(outputElement);

    const todoEl = $('<div>').addClass('todo')
      .attr('data-id', todo.id)
      .addClass(todo.complete ? 'completed' : 'incomplete');

    todoEl.append(
      $('<button>')
      .addClass('delete')
      .append('<i>').addClass(todo.complete ? 'far fa-dot-circle' : 'far fa-circle'),
      $('<span>').text(todo.text).addClass('list-text')
    );

    output.append(todoEl);
  }

  const renderTodos = function (outputElement, todos) {
    const output = $(outputElement);
    output.empty();
    todos.forEach((todo) => renderTodo(outputElement, todo));
  }

  const getTodos = function () {

    // The AJAX function uses the URL of our API to GET the data associated with it (initially set to localhost)
    $.ajax({
        url: '/api/todos',
        method: 'GET'
      })
      .then(function (todos) {
        renderTodos('#todos', todos);
      });
  }

  // ADD NEW TODO
  // Click listener for the submit button
  $('form').on('submit', function (event) {
    event.preventDefault();

    // Here we grab the form elements
    const newTodo = {
      text: $('#new-todo-text').val().trim(),
      completed: false,
    };

    for (let key in newTodo) {
      if (newTodo[key] === '') {
        alert('Please add text for new todo');
        return;
      }
    }
    $.ajax({
      url: '/api/todos',
      method: 'POST',
      data: newTodo
    }).then(
      function (data) {
        console.log('app.js103: ' + JSON.stringify(data));
        if (data) {

          console.log('data', data)

          // Clear the form when submitting
          $('#new-todo-text').val('');

          // Set the users focus (cursor) to input
          $('#new-todo-text').focus();

          render();
        } else {

          alert('There was a problem with your submission. Please check your entry and try again.');
        }
      });
  });

  // UPDATE TODO COMPLETED STATUS
  $('body').on('click', '.incomplete', function (event) {
    const todoId = $(this).attr('data-id');
    // $('<span>').text(todo.text).addClass('')


    // Make the PUT request
    $.ajax({
        url: `/api/todos/${todoId}`,
        method: 'PUT',
        data: {
          complete: true
        },
      })
      .then(function (data) {

        // If our PUT request was successfully processed, proceed on
        if (data.success) {
          render();
        } else {

          alert('There was a problem with your submission. Please check your entry and try again.');
        }


      });
  })

  // DELETE TODO
  $('body').on('click', '.completed', function (event) {
    const todoId = $(this).attr('data-id');

    // Make the DELETE request
    $.ajax({
        url: `/api/todos/${todoId}`,
        method: 'DELETE'
      })
      .then(function (data) {

        // If our DELETE request was successfully processed, proceed on
        if (data.success) {
          render();
        } else {

          alert('There was a problem with your submission. Please check your entry and try again.');
        }

      });
  });

  $("#new-todo-text").keypress(function(event) {
      if (event.which == 13) {
          event.preventDefault();
          $("form").submit();
      }
  });

  // fetch all todos and render them 
  render();

  const socket = io();
  socket.on('new todo', function(todo){
    console.log(todo);
    getTodos();
  });

  socket.on('delete todo', function(todo){
    console.log(todo);
    getTodos();
  });

  socket.on('update todo', function(todo){
    console.log(todo);
    getTodos();
  });
});