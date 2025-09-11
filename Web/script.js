class ToDoListApp {
    constructor() {
        this.tasks = []; 
        this.getElements(); 
        this.addEvents(); 
        this.drawList(); 
    }

    getElements() {
        this.input = document.getElementById('newTaskInput');
        this.addTaskButton = document.getElementById('addTaskButton');
        this.showListButton = document.getElementById('showListButton');
        this.arrow = this.showListButton.querySelector('.arrowIcon');
        this.listContainer = document.getElementById('listContainer');
        this.emptyMessage = document.getElementById('emptyMessage');
        this.tasksTable = document.getElementById('tasksTable');
        this.tasksItems = document.getElementById('tasksItems');
        this.saveButton = document.getElementById('saveButton');
        this.loadButton = document.getElementById('loadButton');
        this.fileInput = document.getElementById('fileInput');
    }

    addEvents() {
        this.addTaskButton.addEventListener('click', () => this.addTask());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.showListButton.addEventListener('click', () => this.showList());
        this.saveButton.addEventListener('click', () => this.saveToFile());
        this.loadButton.addEventListener('click', () => this.loadFromFile());
        this.fileInput.addEventListener('change', (e) => this.selectFile(e));
        

        this.tasksItems.addEventListener('click', (e) => {
            let taskItem = e.target.closest('.taskItem');
            if (!taskItem) return;
            
            let index = parseInt(taskItem.dataset.index);

            if (e.target.closest('.statusButton')) {
                this.changeStatus(index);
            } else if (e.target.closest('.editButton')) {
                this.editTask(index);
            } else if (e.target.closest('.deleteButton')) {
                this.deleteTask(index);
            }
        });
    }

    addTask() {
        let text = this.input.value.trim();
        
        if (!text) {
            alert('Сначала введите описание нового дела');
            this.input.focus();
            return;
        }

        let task = {
            text: text,
            completed: false
        };
        
        this.tasks.push(task); 
        this.input.value = ''; 
        this.drawList(); 
    }

    showList() {
        this.listContainer.classList.toggle('hidden'); 
        this.arrow.classList.toggle('rotated');
    }

    changeStatus(index) {
        this.tasks[index].completed = !this.tasks[index].completed;
        this.drawList();
    }

    editTask(index) {
        let newText = prompt('Редактировать дело:', this.tasks[index].text);
        if (newText !== null && newText.trim() !== '') {
            this.tasks[index].text = newText.trim();
            this.drawList();
        }
    }

    deleteTask(index) {
        if (!confirm('Удалить это дело?')) return;
        this.tasks.splice(index, 1);
        this.drawList();
    }

    drawList() {
        if (this.tasks.length === 0) {
            this.emptyMessage.classList.remove('hidden');
            this.tasksTable.classList.add('hidden');
        } else {
            this.emptyMessage.classList.add('hidden');
            this.tasksTable.classList.remove('hidden');
            this.drawTasks();
        }
    }

    drawTasks() {
        let activeTasks = this.tasks.filter(task => !task.completed);
        let completedTasks = this.tasks.filter(task => task.completed);
        let sortedTasks = [...activeTasks, ...completedTasks];

        this.tasksItems.innerHTML = sortedTasks.map((task, index) => `
        <div class="taskItem ${task.completed ? 'completed' : ''}" data-index="${index}">
            <div class="taskText">${task.text}</div>
            <div class="taskStatus ${task.completed ? 'statusCompleted' : 'statusActive'}">
                ${task.completed ? 'Выполнено' : 'Не выполнено'}
            </div>
            <div class="taskActions">
                <button class="actionButton statusButton ${task.completed ? 'completed' : 'active'}" data-tooltip="${task.completed ? 'Дело не выполнено' : 'Дело выполнено'}">
                    ${task.completed ? '❌' : '✅'}
                </button>
                <button class="actionButton editButton" data-tooltip="Редактировать дело">✏️</button>
                <button class="actionButton deleteButton" data-tooltip="Удалить дело">🗑️</button>
            </div>
        </div>
        `).join('');
    }

    createUnicFileName() {
        let now = new Date();
        let date = now.toISOString().slice(0, 10).replace(/-/g, ''); 
        let time = now.toTimeString().slice(0, 8).replace(/:/g, '');
        return `ToDoList_${date}_${time}.json`;
    }

    saveToFile() {
        if (this.tasks.length === 0) {
            alert('Нет дел для сохранения!');
            return;
        }

        let jsonData = JSON.stringify(this.tasks);
        
        let fileName = this.createUnicFileName();
        
        let blob = new Blob([jsonData], {type: 'application/json;charset=utf-8'});

        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        
        alert(`Файл "${fileName}" сохранён`);
    }

    loadFromFile() {
        this.fileInput.click();
    }

    selectFile(event) {
        let file = event.target.files[0];
        let reader = new FileReader();

        reader.onload = (e) => {
            let data  = JSON.parse(e.target.result);
            if (Array.isArray(data)) {
                this.tasks = data;
                this.drawList();
                alert(`Файл ${file.name} загружен`);
            } else {
                alert('Неверный формат данных в файле');
            }
        }
        
        reader.readAsText(file);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ToDoListApp();
});