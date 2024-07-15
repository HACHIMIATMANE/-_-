document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expense-form');
    const expenseNameInput = document.getElementById('expense-name');
    const expenseQuantityInput = document.getElementById('expense-quantity');
    const expensePriceInput = document.getElementById('expense-price');
    const expenseDateInput = document.getElementById('expense-date');
    const expensesList = document.getElementById('expenses-list');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let isEditing = false;
    let editIndex = null;

    function renderExpenses() {
        expensesList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const expenseItem = document.createElement('div');
            expenseItem.classList.add('expense-item');
            const total = (expense.quantity * expense.price).toFixed(2);
            expenseItem.innerHTML = `
                <span>${expense.name} - ${expense.quantity} - $${expense.price} - $${total} - ${expense.date}</span>
                <div>
                    <button class="edit-button" onclick="editExpense(${index})">Edit</button>
                    <button onclick="deleteExpense(${index})">Delete</button>
                </div>
            `;
            expensesList.appendChild(expenseItem);
        });
    }

    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const expenseName = expenseNameInput.value;
        const expenseQuantity = parseInt(expenseQuantityInput.value);
        const expensePrice = parseFloat(expensePriceInput.value).toFixed(2);
        const expenseDate = expenseDateInput.value;

        if (expenseName && expenseQuantity && expensePrice && expenseDate) {
            const expense = {
                name: expenseName,
                quantity: expenseQuantity,
                price: expensePrice,
                date: expenseDate
            };

            if (isEditing) {
                expenses[editIndex] = expense;
                isEditing = false;
                editIndex = null;
                expenseForm.querySelector('button').innerText = 'Add Expense';
            } else {
                expenses.push(expense);
            }

            localStorage.setItem('expenses', JSON.stringify(expenses));
            expenseNameInput.value = '';
            expenseQuantityInput.value = '';
            expensePriceInput.value = '';
            expenseDateInput.value = '';
            renderExpenses();
        }
    });

    window.editExpense = function(index) {
        const expense = expenses[index];
        expenseNameInput.value = expense.name;
        expenseQuantityInput.value = expense.quantity;
        expensePriceInput.value = expense.price;
        expenseDateInput.value = expense.date;
        isEditing = true;
        editIndex = index;
        expenseForm.querySelector('button').innerText = 'Update Expense';
    }

    window.deleteExpense = function(index) {
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    }

    renderExpenses();
});
