# My Expense Tracker (Beginner Version)

A simple expense tracker for a Web Technology assignment, made using the topics from the supplied class practice files: HTML forms, CSS, Grid, Flexbox, JavaScript variables, arrays, objects, functions, loops, DOM selection, `createElement()`, event listeners and JSON/localStorage.

## Files

- `index.html` — page and form structure.
- `style.css` — styling, responsive layout and dark mode.
- `script.js` — expense data and all app behaviour.

## Features

- Add, edit and delete expenses.
- **Undo last delete**: after deleting an expense, click “Undo last delete” to restore it.
- Expense name, amount, category and date.
- Search, filter by category/month, and sort.
- Total expense and number of expenses.
- Category breakdown bars.
- Monthly budget and over-budget warning.
- Save expenses, budget and theme in localStorage.
- Export expenses as CSV.
- Responsive layout and remembered dark/light theme.

## Run locally

Download/extract the folder, then open `index.html` in a browser. No installation or build command is required.

## GitHub and regular commits

Create an empty GitHub repository named `my-expense-tracker`. In a terminal opened inside this folder, run:

```bash
git init
git add index.html
git commit -m "Create expense tracker HTML structure"

git add style.css
git commit -m "Style responsive expense tracker layout"

git add script.js
git commit -m "Add expense form and list rendering"

git add script.js
git commit -m "Add edit delete and undo delete features"

git add README.md
git commit -m "Document features and setup"

git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/my-expense-tracker.git
git push -u origin main
```

These are suggested commit stages. Make each commit when you have actually completed and tested that part. Keep making small meaningful commits at least once every two days, rather than uploading all work at the end.

## Deploy with Netlify

1. Push the repository to GitHub.
2. Log in at https://app.netlify.com/.
3. Choose Add new site / Import an existing project.
4. Connect GitHub and choose this repository.
5. Leave the build command blank and set the publish directory to `.` (the repository root).
6. Deploy and test the generated website link.

Vercel also supports this static project: import the GitHub repository at https://vercel.com/new and leave the build command blank.

## How it works (viva notes)

- **Array:** `expenses` stores all expense objects.
- **Object:** each expense has an `id`, `title`, `amount`, `category`, and `date`.
- **DOM:** `getElementById()` selects HTML elements; `createElement()` creates table rows and buttons.
- **Event listener:** listens for form submission, button clicks, and filter changes.
- **CRUD:** add (Create), show (Read), edit (Update), and delete (Delete).
- **localStorage:** `JSON.stringify()` turns the array into text before saving; `JSON.parse()` turns the saved text back into an array when the page opens.
- **Undo delete:** the app keeps the last deleted object and its array position. Undo inserts that object back into the array and saves the updated list.
- **Responsive CSS:** Grid arranges summary cards and form fields; media queries stack them on narrow screens.
- **Budget:** the app adds expenses for the current month and compares the sum with the saved budget.

## Testing checklist

- [ ] Add an expense and refresh the page.
- [ ] Edit an expense.
- [ ] Delete an expense, then click Undo last delete.
- [ ] Delete an expense and refresh: deleted item should remain deleted.
- [ ] Search and use category/month filters.
- [ ] Try each sorting option.
- [ ] Set a low budget to test the warning.
- [ ] Switch theme and refresh.
- [ ] Export a CSV.
- [ ] Test phone and laptop screen widths.

## Note

Expenses and settings are saved in the current browser only. Clearing browser data can remove them. This is a student project, not a bank-connected app.
## GitHub Upload

Project successfully maintained using Git and GitHub.