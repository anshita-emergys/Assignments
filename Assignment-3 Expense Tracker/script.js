let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const typeRadio = document.querySelectorAll('.type-options input[name="type"]');
const row = document.getElementById("list-container");
const button = document.getElementById('add-transaction');
const close = document.getElementById('close');
const create = document.getElementById('create');
let categoryContainer = document.querySelector('.expensecat');
let incomeOptions = document.querySelector('.incomecat');
let totalBalance = 0;
let totalIncome = 0;
let totalExpense = 0;

button.addEventListener('click', function () {
    create.style.display = 'flex';
})
close.addEventListener('click', function () {
    create.style.display = 'none';
})

document.addEventListener("DOMContentLoaded", function () {
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    const oneYearAgoISOString = oneYearAgo.toISOString().substring(0, 10);

    document.getElementById("date").setAttribute("min", oneYearAgoISOString);
    document.getElementById("date").setAttribute("max", today.toISOString().substring(0, 10));


    typeRadio.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'income') {
                categoryContainer.style.display = 'none';
                incomeOptions.style.display = 'flex';
            } else {
                categoryContainer.style.display = 'flex';
                incomeOptions.style.display = 'none';
            }
        });
    });
    chartValues();
});

function isDuplicate(content) {
    return transactions.some(transaction => transaction.content.toLowerCase() === content.toLowerCase());
}

// click sort start 
let defaultTransaction = [...transactions];
let dateOrder = 0;
const iconDate = document.getElementById('icon-span');
let amountOrder = 0;
const icon = document.getElementById('icon-amount');

function sortByDate() {
    amountOrder =0;
    icon.innerHTML = '<i class="fa-solid fa-sort"></i>';
    transactions = [...defaultTransaction];
    if (dateOrder === 0) {
        transactions.sort((a, b) => {
            if (a.date < b.date) return 1;
            if (a.date > b.date) return -1;
        });
        dateOrder = 1;
        iconDate.innerHTML = '<i class="fa-solid fa-sort-up"></i>';
        console.log('high-sorted');
    }
    else if (dateOrder === 1) {
        transactions.sort((a, b) => {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
        });
        dateOrder = 2;
        console.log('low-sorted');
        iconDate.innerHTML = '<i class="fa-solid fa-sort-down"></i>';
    } else {
        transactions = [...defaultTransaction];
        dateOrder = 0;
        iconDate.innerHTML = '<i class="fa-solid fa-sort"></i>';
    }
    render();
}

function sortByAmount() {
    dateOrder =0;
    iconDate.innerHTML = '<i class="fa-solid fa-sort"></i>';
    transactions = [...defaultTransaction];
    if (amountOrder === 0) {
        transactions.sort((a, b) => {
            a = parseFloat(a.amount);
            b = parseFloat(b.amount);
            console.log(a);
            console.log(b);

            if (a < b) return 1;
            if (a > b) return -1;
            return 0;
        });
        amountOrder = 1;
        icon.innerHTML = '<i class="fa-solid fa-sort-up"></i>';
    }
    else if (amountOrder === 1) {
        transactions.sort((a, b) => {
            a = parseFloat(a.amount);
            b = parseFloat(b.amount);
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        });
        amountOrder =2;
        icon.innerHTML = '<i class="fa-solid fa-sort-down"></i>';
    }else
    {
        transactions = [...defaultTransaction];
        amountOrder = 0;
        icon.innerHTML = '<i class="fa-solid fa-sort"></i>';
    }
    render();
}
document.getElementById('icon-span').addEventListener('click', sortByDate);
document.getElementById('icon-amount').addEventListener('click', sortByAmount);
// click sort end 

// function sortT() {
//     const sortByAmount = document.getElementById('amount-dropdown').value;
//     const sortByDate = document.getElementById('date-dropdown').value;
//     const icon = document.getElementById('icon-span');

//     document.getElementById('date-dropdown').value = 'default';
//     document.getElementById('amount-dropdown').value = 'default';

//     if (sortByAmount !== 'default') {
//         if (sortByAmount === 'highest') {
//             transactions.sort((a, b) => {
//                 a = parseFloat(a.amount);
//                 b = parseFloat(b.amount);
//                 console.log(a);
//                 console.log(b);

//                 if (a < b) return 1;
//                 if (a > b) return -1;
//                 return 0;
//             });
//         } else if (sortByAmount === 'lowest') {
//             transactions.sort((a, b) => {
//                 a = parseFloat(a.amount);
//                 b = parseFloat(b.amount);
//                 if (a < b) return -1;
//                 if (a > b) return 1;
//                 return 0;
//             });
//         }
//     }

//     if (sortByDate !== 'default') {
//         if (sortByDate === 'newest') {
//             transactions.sort((a, b) => {
//                 if (a.date < b.date) return 1;
//                 if (a.date > b.date) return -1;
//                 return 0;
//             });
//         } else if (sortByDate === 'oldest') {
//             transactions.sort((a, b) => {
//                 if (a.date < b.date) return -1;
//                 if (a.date > b.date) return 1;
//                 return 0;
//             });
//         }
//     }

//     render();
// }
// document.getElementById('amount-dropdown').addEventListener('change', sortT);
// document.getElementById('date-dropdown').addEventListener('change', sortT);

document.getElementById('search-input').addEventListener('input', () => {
    iconDate.removeEventListener('click',sortByDate);
    icon.removeEventListener('click',sortByAmount);

    const search = document.getElementById('search-input').value.toLowerCase();
    const filteredTransactions = transactions.filter((transaction) => {
        return transaction.content.toLowerCase().includes(search) || transaction.category.toLowerCase().includes(search) || transaction.date.toLowerCase().includes(search) || transaction.amount.toLowerCase().includes(search);
    });
    render(filteredTransactions);
});

document.getElementById('search-input').addEventListener('blur',()=>{
    const search = document.getElementById('search-input').value.toLowerCase();
    if(search === ""){
        iconDate.addEventListener('click',sortByDate);
        icon.addEventListener('click',sortByAmount);
    }
});

document.getElementById("create-transaction").addEventListener('submit', function (e) {
    e.preventDefault();
    let content = document.getElementById('content').value;
    content = content.trim();
    const date = document.getElementById('date').value;
    const type = document.querySelector('input[name="type"]:checked').value;
    const amount = document.getElementById('amount').value;
    let category = document.querySelector('.options input[name="category"]:checked');

    const nameError = document.querySelector(".name-error");
    const categoryError = document.querySelector(".category-error");

    const nameRegex = /^[a-zA-Z]+[- ']{0,1}[a-zA-Z]+[- ']{0,1}[a-zA-Z]+$/;

    if (content.trim() === "") {
        nameError.textContent = "Name is required*";
        return;
    }
    if (isDuplicate(content)) {
        nameError.textContent = 'This transaction already exists!';
        return;
    }
    if (!nameRegex.test(content)) {
        nameError.textContent = "Invalid name";
        return;
    }

    if (category === null) {
        nameError.textContent = "";
        categoryError.textContent = "Category is required*";
        return;
    }
    // console.log(typeRadio[0]);
    const check = totalBalance-amount;
    if ((totalIncome <= amount || check <= 0) && typeRadio[0].checked == true) {
        nameError.textContent = "Please enter income first";
        typeRadio[1].checked = true;
        categoryContainer.style.display = 'none';
        incomeOptions.style.display = 'flex';
        return;
    }
    category = category.value;
    nameError.textContent = "";
    categoryError.textContent = "";
    const transaction = {
        content: content,
        category: category,
        date: date,
        type: type,
        amount: amount,
    };
    transactions.unshift(transaction);

    localStorage.setItem('transactions', JSON.stringify(transactions));
    create.style.display = 'none';
    incomeOptions.style.display = 'none';
    categoryContainer.style.display = 'flex';
    render();
    chartValues();
    this.reset();
});

function render(transactionsToRender = transactions) {
    row.innerHTML = '';
    if (transactionsToRender.length === 0) {
        const div = document.createElement('div');
        div.style.display = "flex";
        div.style.justifyContent = "center";
        div.style.alignItems = "center";
        div.style.height = "10vh";
        div.textContent = "No transactions!";
        row.appendChild(div);
        return;
    }
    transactionsToRender.forEach((transaction) => {
        const li = createTransaction(transaction);
        row.appendChild(li);
    });
    cardValues();
}

function createTransaction(transaction) {
    let tr = document.createElement('div');
    tr.classList.add('list')
    tr.innerHTML = `
    <div class="list-item">
    <i class="fas fa-solid ${getCategoryIcon(transaction.category)}"></i>
    <div class="transaction-content">
    <textarea cols="20" maxlength="30">${transaction.content}</textarea>
    <p>${transaction.category}</p>
    </div>
    </div>
    <div class="transaction-date">${transaction.date}</div>
    <div class="transaction-amount">₹${transaction.amount}</div>
    <button id="delete">&times;</button>`;

    if (transaction.type === 'income') {
        tr.querySelector('.transaction-amount').classList.add('income')
    }

    tr.querySelector('#delete').addEventListener('click', () => {
        const transactionIndex = transactions.findIndex(t => t === transaction);
        transactions.splice(transactionIndex, 1);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        cardValues();
        render();
        chartValues();
    })
    const inputElement = tr.querySelector('textarea');
    inputElement.addEventListener('blur', (e) => {
        transaction.content = e.target.value;
        localStorage.setItem('transactions', JSON.stringify(transactions));
        render();
    });
    return tr;
}

function getCategoryIcon(category) {
    switch (category) {
        case 'Living':
            return 'fa-house living';
        case 'Lifestyle':
            return 'fa-plane-up lifestyle';
        case 'Finance':
            return 'fa-piggy-bank finance';
        case 'Health':
            return 'fa-heart-pulse health';
        case 'Career':
            return 'fa-book career';
        case 'Earned':
            return 'fa-briefcase living';
        case 'Passive':
            return 'fa-coins lifestyle';
        case 'Other':
            return 'fa-clipboard other';
        default:
            return '';
    }
}

function cardValues() {
    const balanceElement = document.getElementById('balance');
    const incomeElement = document.getElementById('income');
    const expenseElement = document.getElementById('expense');

    totalBalance = 0;
    totalIncome = 0;
    totalExpense = 0;

    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalBalance += parseFloat(transaction.amount);
            totalIncome += parseFloat(transaction.amount);
        } else {
            totalBalance -= parseFloat(transaction.amount);
            totalExpense += parseFloat(transaction.amount);
        }
    });

    balanceElement.textContent = `₹${totalBalance.toFixed(2)}`;
    incomeElement.textContent = `₹${totalIncome.toFixed(2)}`;
    expenseElement.textContent = `₹${totalExpense.toFixed(2)}`;
}


cardValues();
render();

function chartValues() {
    const chartData = {
        labels: ['Earned', 'Passive'],
        datasets: [{
            label: ['Amount'],
            data: [0, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                '#f77d91',
                '#ea8e4d'
            ],
            borderWidth: 1
        }]
    };
    const doughnutData = {
        labels: ['Living', 'Lifestyle', 'Finance', 'Health', 'Career', 'Other'],
        datasets: [{
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: [
                'rgba(153, 102, 255, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                '#a986da',
                '#2bc3a9',
                '#57b7d2',
                '#f77d91',
                '#ffce56',
                '#ea8e4d'
            ],
            borderWidth: 1
        }]
    };

    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            if (transaction.category === 'Earned') {
                chartData.datasets[0].data[0] += parseFloat(transaction.amount);
            } else if (transaction.category === 'Passive') {
                chartData.datasets[0].data[1] += parseFloat(transaction.amount);
            }
        } else {
            switch (transaction.category) {
                case 'Living':
                    doughnutData.datasets[0].data[0] += parseFloat(transaction.amount);
                    break;
                case 'Lifestyle':
                    doughnutData.datasets[0].data[1] += parseFloat(transaction.amount);
                    break;
                case 'Finance':
                    doughnutData.datasets[0].data[2] += parseFloat(transaction.amount);
                    break;
                case 'Health':
                    doughnutData.datasets[0].data[3] += parseFloat(transaction.amount);
                    break;
                case 'Career':
                    doughnutData.datasets[0].data[4] += parseFloat(transaction.amount);
                    break;
                case 'Other':
                    doughnutData.datasets[0].data[5] += parseFloat(transaction.amount);
                    break;
            }
        }
    });
    new Chart('bar-chart', {
        type: 'horizontalBar',
        data: chartData,
        options: {
            title: {
                display: true,
                text: 'Income by Category',
                fontColor: "#261d57"
            },
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: "#261d57"
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontColor: '#261d57'
                    }
                }]
            },
            legend: {
                display: false
            }
        }
    });

    new Chart('dough-chart', {
        type: 'doughnut',
        data: doughnutData,
        options: {
            title: {
                display: true,
                text: 'Expense by Category',
                fontColor: "#261d57"
            },
            cutoutPercentage: 60,
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 30,
                    fontSize: 12,
                    fontColor: '#261d57'
                }
            }
        }
    });
}
chartValues()