
BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend
$  ssh -T git@github.com
Hi vildashnetwork! You've successfully authenticated, but GitHub does not provide shell access.

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend
$ echo "# manfess-backend" >> README.md

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend
$ git init
Initialized empty Git repository in C:/Users/BLISSZ CONCEPT GROUP/Desktop/DATA/manfess-backend/.git/

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend (master)
$ git add README.md
warning: in the working copy of 'README.md', LF will be replaced by CRLF the next time Git touches it

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend (master)     
$ git commit -m "first commit"
[master (root-commit) c70b5b1] first commit
 1 file changed, 1 insertion(+)
 create mode 100644 README.md

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend (master)     
$ git branch -M main

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend (main)       
$ git remote add origin git@github.com:vildashnetwork/manfess-backend.git

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend (main)       
$ git push -u origin main
Enumerating objects: 3, done.
Counting objects: 100% (3/3), done.
Writing objects: 100% (3/3), 230 bytes | 23.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
To github.com:vildashnetwork/manfess-backend.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend (main)
$  rm -rf .git

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend
$ git init
Initialized empty Git repository in C:/Users/BLISSZ CONCEPT GROUP/Desktop/DATA/manfess-backend/.git/

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend (master)     
$ git initssh -T git@github.com
git: 'initssh' is not a git command. See 'git --help'.

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend (master)     
$ rm -rf .git

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend
$ git initssh -T git@github.com
git: 'initssh' is not a git command. See 'git --help'.

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend
$ ssh -T git@github.com
Hi vildashnetwork! You've successfully authenticated, but GitHub does not provide shell access.

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend
$ git init
Initialized empty Git repository in C:/Users/BLISSZ CONCEPT GROUP/Desktop/DATA/manfess-backend/.git/

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend (master)
$ git add .
warning: in the working copy of 'README.md', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'package-lock.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'package.json', LF will be replaced by CRLF the next time Git touches it

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend (master)     
$  git commit -m "first commit"
[master (root-commit) bd9b6b4] first commit
 6 files changed, 1809 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 README.md
 create mode 100644 db.js
 create mode 100644 index.js
 create mode 100644 package-lock.json
 create mode 100644 package.json

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend (master)     
$ git branch -M main

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend (main)       
$ git remote add origin git@github.com:vildashnetwork/manfess-backend.git

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend (main)       
$ git push -u origin main
To github.com:vildashnetwork/manfess-backend.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'github.com:vildashnetwork/manfess-backend.git'       
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend (main)       
$  git pull origin main --rebase
remote: Enumerating objects: 5, done.
remote: Counting objects: 100% (5/5), done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 5 (delta 0), reused 3 (delta 0), pack-reused 0 (from 0)
Unpacking objects: 100% (5/5), 1.01 KiB | 2.00 KiB/s, done.
From github.com:vildashnetwork/manfess-backend
 * branch            main       -> FETCH_HEAD
 * [new branch]      main       -> origin/main
Successfully rebased and updated refs/heads/main.

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend (main)
$ git push -u origin main
Enumerating objects: 9, done.
Counting objects: 100% (9/9), done.
Delta compression using up to 4 threads
Compressing objects: 100% (6/6), done.
Writing objects: 100% (8/8), 17.70 KiB | 283.00 KiB/s, done.
Total 8 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
To github.com:vildashnetwork/manfess-backend.git
   10d2713..3df846d  main -> main
branch 'main' set up to track 'origin/main'.

BLISSZ CONCEPT GROUP@DESKTOP-7ST1OG5 MINGW64 ~/Desktop/DATA/manfess-backend (main)       
$




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
