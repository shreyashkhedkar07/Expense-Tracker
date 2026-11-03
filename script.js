// My Expense Tracker
// An expense is an object with a name, amount, category and date.

var expenses = [];
var editId = -1;
var lastDeletedExpense = null;
var lastDeletedPosition = -1;

var totalAmount = document.getElementById("totalAmount");
var totalCount = document.getElementById("totalCount");
var expenseList = document.getElementById("expenseList");
var emptyMessage = document.getElementById("emptyMessage");

// Load saved data when the page opens.
function loadData() {
    var savedExpenses = localStorage.getItem("myExpenses");
    if (savedExpenses != null) {
        try {
            expenses = JSON.parse(savedExpenses);
            if (!Array.isArray(expenses)) {
                expenses = [];
            }
        } catch (error) {
            expenses = [];
        }
    }

    var savedBudget = localStorage.getItem("myBudget");
    if (savedBudget != null && Number(savedBudget) > 0) {
        document.getElementById("budgetInput").value = savedBudget;
    } else {
        document.getElementById("budgetInput").value = 10000;
    }

    var savedTheme = localStorage.getItem("myTheme");
    if (savedTheme == "dark") {
        document.body.classList.add("dark");
        document.getElementById("themeButton").textContent = "Light mode";
    }

    document.getElementById("expenseDate").value = getToday();
    updatePage();
    updateUndoButton();
}

function saveData() {
    localStorage.setItem("myExpenses", JSON.stringify(expenses));
}

function getToday() {
    var date = new Date();
    var month = String(date.getMonth() + 1);
    var day = String(date.getDate());

    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }

    return date.getFullYear() + "-" + month + "-" + day;
}

function money(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function updatePage() {
    showExpenses();
    showTotals();
    showCategorySummary();
    showBudget();
}

// Draw the list using the current array.
function showExpenses() {
    expenseList.innerHTML = "";

    var searchText = document.getElementById("searchInput").value.toLowerCase();
    var selectedCategory = document.getElementById("categoryFilter").value;
    var selectedMonth = document.getElementById("monthFilter").value;
    var sortBy = document.getElementById("sortSelect").value;
    var shownCount = 0;

    // Make a separate list so sorting does not change the original array.
    var shownExpenses = [];
    for (var i = 0; i < expenses.length; i++) {
        var expense = expenses[i];
        var matchesSearch = expense.title.toLowerCase().includes(searchText);
        var matchesCategory = selectedCategory == "All" || expense.category == selectedCategory;
        var matchesMonth = selectedMonth == "" || expense.date.slice(0, 7) == selectedMonth;

        if (matchesSearch && matchesCategory && matchesMonth) {
            shownExpenses.push(expense);
        }
    }

    // Simple sorting with loops, instead of advanced array methods.
    for (var a = 0; a < shownExpenses.length; a++) {
        for (var b = a + 1; b < shownExpenses.length; b++) {
            var swap = false;
            if (sortBy == "newest" && shownExpenses[a].date < shownExpenses[b].date) swap = true;
            if (sortBy == "oldest" && shownExpenses[a].date > shownExpenses[b].date) swap = true;
            if (sortBy == "high" && Number(shownExpenses[a].amount) < Number(shownExpenses[b].amount)) swap = true;
            if (sortBy == "low" && Number(shownExpenses[a].amount) > Number(shownExpenses[b].amount)) swap = true;

            if (swap) {
                var temp = shownExpenses[a];
                shownExpenses[a] = shownExpenses[b];
                shownExpenses[b] = temp;
            }
        }
    }

    for (var j = 0; j < shownExpenses.length; j++) {
        var item = shownExpenses[j];
        var row = document.createElement("tr");

        var titleCell = document.createElement("td");
        titleCell.textContent = item.title;

        var categoryCell = document.createElement("td");
        categoryCell.textContent = item.category;

        var dateCell = document.createElement("td");
        dateCell.textContent = item.date;

        var amountCell = document.createElement("td");
        amountCell.textContent = money(item.amount);

        var actionsCell = document.createElement("td");

        var editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "action-button";
        editButton.setAttribute("data-id", item.id);
        editButton.setAttribute("data-action", "edit");

        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "action-button delete-button";
        deleteButton.setAttribute("data-id", item.id);
        deleteButton.setAttribute("data-action", "delete");

        actionsCell.append(editButton);
        actionsCell.append(deleteButton);

        row.append(titleCell);
        row.append(categoryCell);
        row.append(dateCell);
        row.append(amountCell);
        row.append(actionsCell);

        expenseList.append(row);
        shownCount++;
    }

    document.getElementById("listCount").textContent = shownCount + " expense(s)";
    if (shownCount == 0) {
        emptyMessage.style.display = "block";
        if (expenses.length > 0) {
            emptyMessage.textContent = "No expenses match your search or filters.";
        } else {
            emptyMessage.textContent = "No expenses yet. Add your first expense above.";
        }
    } else {
        emptyMessage.style.display = "none";
    }
}

function showTotals() {
    var total = 0;
    for (var i = 0; i < expenses.length; i++) {
        total = total + Number(expenses[i].amount);
    }

    totalAmount.textContent = money(total);
    totalCount.textContent = expenses.length;
}

function showCategorySummary() {
    var categoryNames = ["Food", "Transport", "Shopping", "Bills", "Health", "Education", "Entertainment", "Other"];
    var categoryTotals = {};
    var grandTotal = 0;

    for (var i = 0; i < categoryNames.length; i++) {
        categoryTotals[categoryNames[i]] = 0;
    }

    for (var j = 0; j < expenses.length; j++) {
        var category = expenses[j].category;
        if (categoryTotals[category] == undefined) {
            categoryTotals[category] = 0;
        }
        categoryTotals[category] = categoryTotals[category] + Number(expenses[j].amount);
        grandTotal = grandTotal + Number(expenses[j].amount);
    }

    var summary = document.getElementById("categorySummary");
    summary.innerHTML = "";

    var hasExpenses = false;
    for (var k = 0; k < categoryNames.length; k++) {
        var name = categoryNames[k];
        var amount = categoryTotals[name];

        if (amount > 0) {
            hasExpenses = true;
            var percentage = (amount / grandTotal) * 100;

            var row = document.createElement("div");
            row.className = "category-row";

            var nameText = document.createElement("span");
            nameText.textContent = name;

            var barBackground = document.createElement("div");
            barBackground.className = "bar-background";

            var bar = document.createElement("div");
            bar.className = "bar";
            bar.style.width = percentage + "%";
            barBackground.append(bar);

            var amountText = document.createElement("span");
            amountText.className = "category-amount";
            amountText.textContent = money(amount);

            row.append(nameText);
            row.append(barBackground);
            row.append(amountText);
            summary.append(row);
        }
    }

    if (!hasExpenses) {
        summary.textContent = "Your category breakdown will appear here after you add expenses.";
        summary.className = "muted";
    } else {
        summary.className = "";
    }
}

function showBudget() {
    var budget = Number(document.getElementById("budgetInput").value);
    if (budget <= 0) {
        budget = 10000;
    }

    document.getElementById("budgetDisplay").textContent = money(budget);

    var thisMonth = getToday().slice(0, 7);
    var monthTotal = 0;

    for (var i = 0; i < expenses.length; i++) {
        if (expenses[i].date.slice(0, 7) == thisMonth) {
            monthTotal = monthTotal + Number(expenses[i].amount);
        }
    }

    var message = document.getElementById("budgetMessage");
    if (monthTotal > budget) {
        message.textContent = "Budget exceeded by " + money(monthTotal - budget);
        message.style.color = "#c52d43";
    } else {
        message.textContent = money(budget - monthTotal) + " left this month";
        message.style.color = "#21865e";
    }
}

// Add a new expense or update the one being edited.
document.getElementById("expenseForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var title = document.getElementById("expenseTitle").value.trim();
    var amount = Number(document.getElementById("expenseAmount").value);
    var category = document.getElementById("expenseCategory").value;
    var date = document.getElementById("expenseDate").value;
    var error = document.getElementById("formError");

    if (title.length < 2) {
        error.textContent = "Please enter a name with at least 2 characters.";
        return;
    }
    if (amount <= 0 || !Number.isFinite(amount)) {
        error.textContent = "Please enter an amount greater than zero.";
        return;
    }
    if (category == "" || date == "") {
        error.textContent = "Please choose a category and date.";
        return;
    }

    error.textContent = "";
    var newExpense = {
        id: editId == -1 ? Date.now() : editId,
        title: title,
        amount: amount,
        category: category,
        date: date
    };

    if (editId == -1) {
        expenses.push(newExpense);
    } else {
        for (var i = 0; i < expenses.length; i++) {
            if (expenses[i].id == editId) {
                expenses[i] = newExpense;
            }
        }
    }

    saveData();
    updatePage();
    resetForm();
});

function resetForm() {
    document.getElementById("expenseForm").reset();
    document.getElementById("expenseDate").value = getToday();
    document.getElementById("formHeading").textContent = "Add an expense";
    document.getElementById("saveButton").textContent = "Add expense";
    document.getElementById("cancelEditButton").classList.add("hidden");
    document.getElementById("formError").textContent = "";
    editId = -1;
}

document.getElementById("cancelEditButton").addEventListener("click", resetForm);

// One click listener handles Edit and Delete buttons made by JavaScript.
expenseList.addEventListener("click", function(event) {
    var clickedButton = event.target;
    var id = Number(clickedButton.getAttribute("data-id"));
    var action = clickedButton.getAttribute("data-action");

    if (action == "edit") {
        for (var i = 0; i < expenses.length; i++) {
            if (expenses[i].id == id) {
                document.getElementById("expenseTitle").value = expenses[i].title;
                document.getElementById("expenseAmount").value = expenses[i].amount;
                document.getElementById("expenseCategory").value = expenses[i].category;
                document.getElementById("expenseDate").value = expenses[i].date;
                document.getElementById("formHeading").textContent = "Edit an expense";
                document.getElementById("saveButton").textContent = "Update expense";
                document.getElementById("cancelEditButton").classList.remove("hidden");
                editId = id;
                document.getElementById("expenseTitle").focus();
            }
        }
    }

    if (action == "delete") {
        var answer = confirm("Are you sure you want to delete this expense?");
        if (answer) {
            for (var j = 0; j < expenses.length; j++) {
                if (expenses[j].id == id) {
                    lastDeletedExpense = expenses[j];
                    lastDeletedPosition = j;
                    expenses.splice(j, 1);
                    break;
                }
            }

            saveData();
            updatePage();
            updateUndoButton();
            document.getElementById("undoButton").textContent = "Undo last delete";
        }
    }
});

// Restore the most recently deleted expense.
document.getElementById("undoButton").addEventListener("click", function() {
    if (lastDeletedExpense != null) {
        expenses.splice(lastDeletedPosition, 0, lastDeletedExpense);
        lastDeletedExpense = null;
        lastDeletedPosition = -1;
        saveData();
        updatePage();
        updateUndoButton();
        document.getElementById("undoButton").textContent = "Undo last delete";
    }
});

function updateUndoButton() {
    document.getElementById("undoButton").disabled = (lastDeletedExpense == null);
}

// Search, filter and sort update the visible list.
document.getElementById("searchInput").addEventListener("input", showExpenses);
document.getElementById("categoryFilter").addEventListener("change", showExpenses);
document.getElementById("monthFilter").addEventListener("change", showExpenses);
document.getElementById("sortSelect").addEventListener("change", showExpenses);

// Save a monthly budget.
document.getElementById("budgetForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var budget = Number(document.getElementById("budgetInput").value);

    if (budget <= 0 || !Number.isFinite(budget)) {
        document.getElementById("budgetFeedback").textContent = "Enter a budget greater than zero.";
        return;
    }

    localStorage.setItem("myBudget", budget);
    document.getElementById("budgetFeedback").textContent = "Budget saved!";
    showBudget();
});

// Remember the selected colour theme.
document.getElementById("themeButton").addEventListener("click", function() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("myTheme", "dark");
        document.getElementById("themeButton").textContent = "Light mode";
    } else {
        localStorage.setItem("myTheme", "light");
        document.getElementById("themeButton").textContent = "Dark mode";
    }
});

// Download all expenses as a CSV spreadsheet.
document.getElementById("exportButton").addEventListener("click", function() {
    if (expenses.length == 0) {
        alert("There are no expenses to export yet.");
        return;
    }

    var csv = "Expense,Amount,Category,Date\n";
    for (var i = 0; i < expenses.length; i++) {
        var safeTitle = expenses[i].title.replace(/"/g, '""');
        csv += '"' + safeTitle + '",' + expenses[i].amount + ',"' +
            expenses[i].category + '",' + expenses[i].date + "\n";
    }

    var file = new Blob([csv], { type: "text/csv" });
    var fileUrl = URL.createObjectURL(file);
    var link = document.createElement("a");
    link.href = fileUrl;
    link.download = "my-expenses.csv";
    link.click();
    URL.revokeObjectURL(fileUrl);
});

// Start the application.
loadData();
// Updated script.js