let todos = JSON.parse(localStorage.getItem('todos')) || [];

const nameInput = document.querySelector('#name');
const username = localStorage.getItem('username') || '';
nameInput.value = username;

nameInput.addEventListener('change', (e) => {
    localStorage.setItem('username', e.target.value);
});


// Add todo
document.getElementById('new-todo-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const content = document.getElementById('content').value;
    const description = document.getElementById('description').value;
    const warning = document.getElementById('warning');

    if (content.trim() === '') {
        warning.style.display = 'block';
        return;
    } else {
        warning.style.display = 'none';
    }

    const category = document.querySelector('input[name="category"]:checked').value;

    const todo = {
        content: content,
        description: description,
        category: category,
        done: false,
        important: false,
    };
    todos.unshift(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
    DisplayTodos(); 
    this.reset();
});

// Clear All Button
document.getElementById('clear-all').addEventListener('click', () => {
    const isConfirmed = confirm('Are you sure you want to delete all tasks?');
    if (isConfirmed) {
        todos = [];
        localStorage.setItem('todos', JSON.stringify(todos));
        DisplayTodos();
    }
});

// Display
function DisplayTodos() {
    todos.sort((a, b) => b.important - a.important);

    const pendingList = document.querySelector('#pending-list');
    const completedList = document.querySelector('#completed-list');
    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const content = document.createElement('div');
        const actions = document.createElement('div');
        const deleteButton = document.createElement('button');
        const star = document.createElement('span');

        input.type = 'checkbox';
        input.checked = todo.done;
        span.classList.add('bubble');
        if (todo.category == 'personal') {
            span.classList.add('personal');
        } else if(todo.category == 'business'){
            span.classList.add('business');
        }
        else if(todo.category == 'social'){
            span.classList.add('social');
        }else{
            span.classList.add('other');
        }
        
        content.classList.add('todo-content');
        actions.classList.add('actions');
        deleteButton.classList.add('delete');
        star.classList.add('star');

        if (todo.important) {
            star.classList.add('filled', todo.category);
        }

        content.innerHTML = `<input type="text" value="${todo.content}">
        <p class="task-description">${todo.description}</p>`;
       
        deleteButton.innerHTML = 'Delete';
        star.innerHTML = '★';

        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(star);
        actions.appendChild(deleteButton);
        
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(actions);

        if (todo.done) {
            completedList.appendChild(todoItem);
            todoItem.classList.add('done');
        } else {
            pendingList.appendChild(todoItem);
        }

        // Star
        star.addEventListener('click', () => {
            todo.important = !todo.important;
            if (todo.important) {
                star.classList.add('filled', todo.category);
            } else {
                star.classList.remove('filled', todo.category);
            }
            localStorage.setItem('todos', JSON.stringify(todos));
            DisplayTodos();
        });

        // Checkbox
        input.addEventListener('change', (e) => {
            todo.done = e.target.checked;
            if (todo.done) {
                todoItem.classList.add('slide-right');
                todos = todos.filter(t => t !== todo);
                todos.unshift(todo);

            } else {
                todoItem.classList.add('slide-left');
            }

            setTimeout(() => {
                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos();
            }, 500);
        });

         
         const inputElement = content.querySelector('input');
         inputElement.addEventListener('blur', (e) => {
             todo.content = e.target.value;
             localStorage.setItem('todos', JSON.stringify(todos));
             DisplayTodos();
         });
 
         
         const descriptionElement = content.querySelector('.task-description');
         descriptionElement.setAttribute('contenteditable', 'true');
         descriptionElement.addEventListener('blur', (e) => {
             todo.description = e.target.innerText;
             localStorage.setItem('todos', JSON.stringify(todos));
             DisplayTodos();
         });

        // Delete click
        deleteButton.addEventListener('click', (e) => {
            todos = todos.filter(t => t != todo);
            localStorage.setItem('todos', JSON.stringify(todos));
            DisplayTodos();
        });
    });
}

DisplayTodos();

(function(){
    const list  = document.getElementById('pending-list')
    if(todos.length === 0){
          let div =  document.createElement('div');
          div.classList.add('no-tasks');
          div.innerHTML= `<h2 style="font-size: 1rem; font-weight:100; color: #888;">No Pending Tasks</h2>`;
          list.appendChild(div);
    }
    const list1  = document.getElementById('completed-list')
    if(todos.length === 0){
          let div =  document.createElement('div');
          div.classList.add('no-tasks');
          div.innerHTML= `<h2 style="font-size: 1rem; font-weight:100; color: #888;">No Completed Tasks</h2>`;
          list1.appendChild(div);
    }
})();