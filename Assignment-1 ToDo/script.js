let todos = JSON.parse(localStorage.getItem('todos')) || [];

const nameInput = document.querySelector('#name');
const username = localStorage.getItem('username') || '';
nameInput.value = username;

nameInput.addEventListener('change', (e) => {
    localStorage.setItem('username', e.target.value);
});

document.addEventListener("DOMContentLoaded", function () {
    var today = new Date().toISOString().substring(0, 10);
    document.getElementById("date").setAttribute("min", today);
});

function isDuplicate(content) {
    return todos.some(todo => todo.content.toLowerCase() === content.toLowerCase());
}
// Add todo
document.getElementById('new-todo-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const content = document.getElementById('content').value;
    const description = document.getElementById('description').value;
    const warning = document.getElementById('warning');
    const date = document.getElementById('date').value;

    if (content.trim() === '') {
        warning.style.display = 'block';
        return;
    } else if (isDuplicate(content)) {
        warning.style.display = 'block';
        warning.textContent = 'This task already exists!';
        return;
    } else {
        warning.style.display = 'none';
    }

    const category = document.querySelector('input[name="category"]:checked').value;

    const todo = {
        content: content,
        description: description,
        category: category,
        date: date,
        done: false,
        important: false,
    };
    todos.unshift(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
    DisplayTodos();
    this.reset();
});

// search function
function searchTodos() {
    const searchInput = document.getElementById('search-input');
    const searchWord = searchInput.value.toLowerCase();
    const searchedTodos = todos.filter(
        todo => {
            const titleMatch = todo.content.toLowerCase().includes(searchWord);
            const descriptionMatch = todo.description.toLowerCase().includes(searchWord);
            return titleMatch || descriptionMatch;
        })
    return searchedTodos;
}
document.getElementById('search-input').addEventListener('input', function (e) {
    DisplayTodos();
});

// sort function
function sortTodos() {
    const sortBy = document.getElementById('sort-dropdown').value;
    if (sortBy === 'a-z') {
        todos.sort((a, b) => {
            if (a.content < b.content) return -1;
            if (a.content > b.content) return 1;
            return 0;
        });
    } else if (sortBy === 'z-a') {
        todos.sort((a, b) => {
            if (a.content < b.content) return 1;
            if (a.content > b.content) return -1;
            return 0;
        });
    } else if (sortBy === 'date') {
        todos.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });
    }
    else {
        todos.sort((a, b) => b.important - a.important);
    }
}
document.getElementById('sort-dropdown').addEventListener('change', function (e) {
    sortTodos();
    DisplayTodos();
})

// Clear All Button
document.getElementById('clear-all').addEventListener('click', () => {
    if (todos.length === 0) {
        alert('No tasks to clear!');
        return;
    }
    const confirmPopup = document.getElementById('confirm-popup');
    confirmPopup.style.display = 'flex';
});

document.getElementById('confirm-ok').addEventListener('click', () => {
    todos = [];
    localStorage.setItem('todos', JSON.stringify(todos));
    DisplayTodos();
    document.getElementById('confirm-popup').style.display = 'none';
});

document.getElementById('confirm-cancel').addEventListener('click', () => {
    document.getElementById('confirm-popup').style.display = 'none';
});


// Display
function DisplayTodos() {
    const searchedTodos = searchTodos();
    if (document.getElementById('sort-dropdown').value === 'default') {
        searchedTodos.sort((a, b) => b.important - a.important);
    }

    const pendingList = document.querySelector('#pending-list');
    const completedList = document.querySelector('#completed-list');
    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    searchedTodos.forEach(todo => {
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
        } else if (todo.category == 'business') {
            span.classList.add('business');
        }
        else if (todo.category == 'social') {
            span.classList.add('social');
        } else {
            span.classList.add('other');
        }

        content.classList.add('todo-content');
        actions.classList.add('actions');
        deleteButton.classList.add('delete');
        star.classList.add('star');

        if (todo.important) {
            star.classList.add('filled', todo.category);
        }

        // content.innerHTML = `<input type="text" value="${todo.content}">
        // <p class="task-description">${todo.description}</p>`;
        content.innerHTML = `<input type="text" value="${todo.content}">`;
        const descriptionElement = document.createElement('textarea');
        descriptionElement.value = todo.description;
        descriptionElement.classList.add('task-description');

        deleteButton.innerHTML = 'Delete';
        star.innerHTML = '★';

        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(star);
        actions.appendChild(deleteButton);
        content.appendChild(descriptionElement);

        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(actions);

        if (todo.done) {
            completedList.appendChild(todoItem);
            todoItem.classList.add('done');
        } else {
            pendingList.appendChild(todoItem);
        }

        todoItem.addEventListener('click', (e) => {
            if (!e.target.classList.contains('todo-item')) {
                return;
            }
            const popup = document.getElementById('task-popup');
            const popupContent = document.getElementById('pop-title');
            const popupDescription = document.getElementById('pop-des');
            const popupCategory = document.getElementById('pop-category');
            const popupDate = document.getElementById('pop-date');
            const popupStatus = document.getElementById('pop-status');



            popupContent.textContent = todo.content;
            popupDescription.textContent = todo.description;
            popupCategory.textContent = todo.category;
            popupDate.textContent = todo.date;
            popupStatus.textContent = todo.done ? 'Completed' : 'Pending';

            popup.style.display = 'flex';
        });
        document.getElementById('close-pop').addEventListener('click', () => {
            document.getElementById('task-popup').style.display = 'none';
        });

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


        // const descriptionElement = content.querySelector('.task-description');
        // descriptionElement.setAttribute('contenteditable', 'true');
        descriptionElement.addEventListener('blur', (e) => {
            todo.description = e.target.value;
            localStorage.setItem('todos', JSON.stringify(todos));
            DisplayTodos();
        });

        deleteButton.addEventListener('click', (e) => {
            todos = todos.filter(t => t != todo);
            localStorage.setItem('todos', JSON.stringify(todos));

            DisplayTodos();
        });
    });

    if (todos.filter(todo => !todo.done).length === 0) {
        let div = document.createElement('div');
        div.classList.add('no-tasks');
        div.innerHTML = `<h2 style="font-size: 1rem; font-weight:100; color: #888;">No Pending Tasks</h2>`;
        pendingList.appendChild(div);
    }


    if (todos.filter(todo => todo.done).length === 0) {
        let div = document.createElement('div');
        div.classList.add('no-tasks');
        div.innerHTML = `<h2 style="font-size: 1rem; font-weight:100; color: #888;">No Completed Tasks</h2>`;
        completedList.appendChild(div);
    }
}

DisplayTodos();
