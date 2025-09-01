## 🚀 Contributing & Pushing Changes

Follow these steps to contribute and push changes safely:

### 1. Clone the Repository (first time only)
```bash
git clone git@github.com:vildashnetwork/manfess-web.git
cd manfess-web
2. Create a New Branch (before making changes)
Always work on a new branch (never commit directly to main):

bash
Copy code
git checkout -b your-branch-name
Example:
git checkout -b feature-login
git checkout -b bugfix-navbar

3. Make Your Changes
Edit the code

Test locally

Make sure nothing is broken

4. Stage & Commit Changes
bash
Copy code
git add .
git commit -m "clear message about what you changed"
Example commit message:
"Added login API connection"
"Fixed navbar responsive issue"

5. Push Your Branch
bash
Copy code
git push origin your-branch-name
6. Create a Pull Request (PR)
Go to GitHub: manfess-web repo

You’ll see a banner: “Compare & Pull Request” → click it.

Add a description of your changes.

Assign reviewers (if needed).

Submit the PR.

7. Code Review & Merge
A teammate (or admin) will review your PR.

Once approved, it will be merged into main.

⚠️ Never push directly to main — always use a branch + PR to keep things clean.

pgsql
Copy code
