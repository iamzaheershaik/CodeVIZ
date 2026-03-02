export const gitConcepts = [
    {
        id: "git-branching",
        title: "Git Branching Model",
        description: "How Git branches work internally and the Git Flow branching strategy",
        category: "git",
        icon: "🌿",
        difficulty: "beginner",
        mermaid: `graph TD
    A["🏠 main branch<br/>production code"] --> B["🌿 Create feature branch<br/>git checkout -b feature"]
    B --> C["💻 Develop feature<br/>commit changes"]
    C --> D["📤 Push branch<br/>git push origin feature"]
    D --> E["🔍 Pull Request<br/>code review"]
    E --> F{"Approved?"}
    F -->|No| G["🔧 Make changes<br/>push updates"]
    G --> E
    F -->|Yes| H["🔀 Merge to main<br/>git merge feature"]
    H --> I["🏷️ Tag release<br/>git tag v1.0"]
    I --> J["🗑️ Delete branch<br/>git branch -d feature"]

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style B fill:#1f3b2f,stroke:#34d399,color:#fff
    style E fill:#3b1f5e,stroke:#a855f7,color:#fff
    style H fill:#3b2f1f,stroke:#fb923c,color:#fff`,
        steps: [
            {
                node: "A",
                title: "Main Branch",
                explanation: "The main (or master) branch represents the production-ready state of your code. In Git, a branch is just a lightweight pointer to a commit. Creating branches is nearly instantaneous and costs no extra storage.",
                code: `# Main branch points to latest commit
main → commit C3 → C2 → C1

# A branch is just a pointer (40-byte file)
# .git/refs/heads/main contains the commit hash
cat .git/refs/heads/main
# a1b2c3d4e5f6...`,
                language: "bash"
            },
            {
                node: "B",
                title: "Create Feature Branch",
                explanation: "Creating a branch creates a new pointer to the current commit. HEAD moves to the new branch. Now your work is isolated — changes on the feature branch don't affect main until merged.",
                code: `# Create and switch to new branch
git checkout -b feature/user-auth
# or modern way:
git switch -c feature/user-auth

# What happens internally:
# 1. New file: .git/refs/heads/feature/user-auth
# 2. HEAD now points to feature/user-auth
# 3. Both branches point to same commit`,
                language: "bash"
            },
            {
                node: "E",
                title: "Pull Request & Review",
                explanation: "Pull Requests (GitHub) or Merge Requests (GitLab) are a workflow feature for code review. They show the diff between branches, allow inline comments, and often trigger CI/CD pipelines for automated testing.",
                code: `# Push your branch to remote
git push origin feature/user-auth

# Create PR via GitHub/GitLab UI or CLI
# PR includes:
# - Diff of all changes
# - Commit history
# - CI/CD status checks
# - Reviewer assignments`,
                language: "bash"
            },
            {
                node: "H",
                title: "Merge Strategies",
                explanation: "Git offers several merge strategies: (1) Merge commit creates a new commit joining both branches, (2) Fast-forward moves the pointer if no divergence, (3) Squash combines all commits into one. Each has trade-offs for history readability.",
                code: `# Regular merge (creates merge commit)
git merge feature/user-auth

# Squash merge (single commit, clean history)
git merge --squash feature/user-auth

# Fast-forward (only if no divergence)
git merge --ff-only feature/user-auth

# After merge, clean up
git branch -d feature/user-auth
git push origin --delete feature/user-auth`,
                language: "bash"
            }
        ]
    },
    {
        id: "merge-vs-rebase",
        title: "Merge vs Rebase",
        description: "Understanding the difference between git merge and git rebase, and when to use each",
        category: "git",
        icon: "🔀",
        difficulty: "intermediate",
        mermaid: `graph TD
    A["📍 Both start<br/>from same point"] --> B["🔀 git merge"]
    A --> C["📐 git rebase"]
    B --> D["Creates merge commit<br/>preserves all history"]
    D --> E["✅ Non-destructive<br/>safe for shared branches"]
    D --> F["❌ Messy history<br/>many merge commits"]
    C --> G["Replays commits<br/>on top of target"]
    G --> H["✅ Linear history<br/>clean and readable"]
    G --> I["❌ Rewrites history<br/>dangerous for shared"]

    style B fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style C fill:#3b1f5e,stroke:#a855f7,color:#fff
    style E fill:#1f3b2f,stroke:#34d399,color:#fff
    style I fill:#3b1f1f,stroke:#f87171,color:#fff`,
        steps: [
            {
                node: "B",
                title: "Git Merge",
                explanation: "Merge creates a new 'merge commit' that combines two branches. It preserves the complete history and branch structure. The merge commit has two parents, showing where branches diverged and joined.",
                code: `# On main branch:
git merge feature

# History looks like:
#   * Merge commit (M)
#   |\\
#   | * Feature commit 3
#   | * Feature commit 2
#   * | Main commit B
#   * | Main commit A
#   |/
#   * Common ancestor`,
                language: "bash"
            },
            {
                node: "C",
                title: "Git Rebase",
                explanation: "Rebase 'replays' your commits on top of the target branch, as if you started your work from the current tip. It creates NEW commits (different hashes) with the same changes. The result is a linear, clean history.",
                code: `# On feature branch:
git rebase main

# Before rebase:
# main:    A---B---C
#              \\
# feature:  D---E---F

# After rebase:
# main:    A---B---C
#                   \\
# feature:          D'---E'---F'
# (D', E', F' are NEW commits)`,
                language: "bash"
            },
            {
                node: "E",
                title: "When to Use Merge",
                explanation: "Use merge for shared/public branches (main, develop) where preserving history is important. Merge is safe because it never changes existing commits. It's the standard for Pull Requests.",
                code: `# Safe workflow with merge:
git checkout main
git pull origin main
git merge feature/login
git push origin main

# Golden Rule: Never rebase shared branches!
# If others have the same commits,
# rebase creates duplicate/conflicting history`,
                language: "bash"
            },
            {
                node: "H",
                title: "When to Use Rebase",
                explanation: "Use rebase for LOCAL feature branches before merging to main. Interactive rebase (rebase -i) lets you squash, edit, reorder, or drop commits. This creates a polished, readable history.",
                code: `# Clean up before PR:
git rebase -i main

# Interactive rebase options:
pick   abc1234 Add login form
squash def5678 Fix typo in login
squash ghi9012 Add error handling
reword jkl3456 Implement auth flow

# Result: clean, logical commits
# ready for code review`,
                language: "bash"
            }
        ]
    },
    {
        id: "git-internals",
        title: "Git Internals — How Git Stores Data",
        description: "Understanding blobs, trees, commits, and refs — the building blocks of Git",
        category: "git",
        icon: "🗃️",
        difficulty: "advanced",
        mermaid: `graph TD
    A["📁 Working Directory<br/>your files"] --> B["📋 Staging Area<br/>git add"]
    B --> C["📦 Repository<br/>git commit"]
    C --> D["🔹 Blob Object<br/>file contents"]
    C --> E["🌳 Tree Object<br/>directory listing"]
    C --> F["📝 Commit Object<br/>snapshot + metadata"]
    F --> G["👆 Points to parent<br/>commit (history)"]
    F --> E
    E --> D
    H["🏷️ refs/heads/main<br/>branch pointer"] --> F
    I["🏷️ HEAD<br/>current branch"] --> H

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style D fill:#3b1f5e,stroke:#a855f7,color:#fff
    style F fill:#1f3b2f,stroke:#34d399,color:#fff
    style I fill:#3b2f1f,stroke:#fb923c,color:#fff`,
        steps: [
            {
                node: "A",
                title: "Three Areas of Git",
                explanation: "Git has three main areas: (1) Working Directory — your actual files, (2) Staging Area (Index) — prepared changes for next commit, (3) Repository (.git) — the commit history. Understanding this flow is key to mastering Git.",
                code: `# Working Directory → Staging → Repository
git add file.js      # Working → Staging
git commit -m "msg"  # Staging → Repository
git checkout -- file.js  # Repository → Working

# Check status of all three:
git status`,
                language: "bash"
            },
            {
                node: "D",
                title: "Blob Objects",
                explanation: "Git stores file CONTENTS as blob objects. Each blob is identified by a SHA-1 hash of its content. Two files with identical content share the same blob — this is content-addressable storage. Blobs don't store filenames.",
                code: `# Every file is stored as a blob
# Hash is based on content:
echo "Hello" | git hash-object --stdin
# ce013625030ba8dba906f756967f9e9ca394464a

# Same content = same hash (deduplication!)
# Blob only stores content, not filename`,
                language: "bash"
            },
            {
                node: "E",
                title: "Tree Objects",
                explanation: "Trees represent directories. A tree maps filenames to blob hashes (for files) or other tree hashes (for subdirectories). This is how Git tracks the directory structure of your project.",
                code: `# Tree object looks like:
100644 blob abc123 index.js
100644 blob def456 package.json
040000 tree ghi789 src/
#  │     │     │     └── filename
#  │     │     └── SHA-1 hash
#  │     └── type (blob or tree)
#  └── file mode`,
                language: "bash"
            },
            {
                node: "F",
                title: "Commit Objects",
                explanation: "A commit points to a tree (the snapshot), zero or more parent commits (history), and includes metadata (author, date, message). The commit hash includes ALL of this, making Git's history tamper-proof.",
                code: `# Commit object contains:
git cat-file -p HEAD
# tree abc123def...
# parent 456789abc...
# author Zaheer <z@email.com> 1709300000 +0530
# committer Zaheer <z@email.com> 1709300000 +0530
#
# Add authentication feature

# Changing ANY byte = different hash
# = tamper-proof history`,
                language: "bash"
            }
        ]
    },
    {
        id: "git-reset-revert",
        title: "Git Reset vs Revert vs Checkout",
        description: "Understanding the three ways to undo changes in Git and when to use each",
        category: "git",
        icon: "↩️",
        difficulty: "intermediate",
        mermaid: `graph TD
    A["🔄 Need to undo<br/>changes"] --> B{"Which<br/>approach?"}
    B --> C["git reset<br/>move branch pointer"]
    B --> D["git revert<br/>create undo commit"]
    B --> E["git checkout<br/>switch context"]
    C --> F["--soft: keep staged"]
    C --> G["--mixed: keep working"]
    C --> H["--hard: discard all"]
    D --> I["✅ Safe for shared<br/>new commit undoes old"]
    H --> J["⚠️ Destructive!<br/>loses uncommitted work"]

    style C fill:#3b2f1f,stroke:#fb923c,color:#fff
    style D fill:#1f3b2f,stroke:#34d399,color:#fff
    style E fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style J fill:#3b1f1f,stroke:#f87171,color:#fff`,
        steps: [
            {
                node: "C",
                title: "Git Reset",
                explanation: "Reset moves the branch pointer backward to a previous commit. It REWRITES history. Three modes control what happens to your changes: --soft keeps them staged, --mixed (default) keeps them in working directory, --hard discards everything.",
                code: `# Soft: undo commit, keep changes staged
git reset --soft HEAD~1

# Mixed (default): undo commit, unstage changes
git reset HEAD~1

# Hard: undo commit AND discard all changes
git reset --hard HEAD~1  # ⚠️ DESTRUCTIVE

# Reset to specific commit:
git reset --hard abc1234`,
                language: "bash"
            },
            {
                node: "D",
                title: "Git Revert",
                explanation: "Revert creates a NEW commit that undoes the changes of a previous commit. It PRESERVES history. This is safe for shared branches because it doesn't rewrite existing commits.",
                code: `# Revert the last commit
git revert HEAD
# Creates: "Revert 'Add feature X'"

# Revert a specific commit
git revert abc1234

# Revert without auto-commit
git revert --no-commit HEAD~3..HEAD
# Reverts last 3 commits as one`,
                language: "bash"
            },
            {
                node: "F",
                title: "Reset Modes Compared",
                explanation: "Think of the three reset modes as levels of 'undo': --soft only undoes the commit, --mixed undoes commit + staging, --hard undoes everything. The --hard flag is the only dangerous one.",
                code: `# Starting state: committed change "X"
git reset --soft HEAD~1
# Commit: undone | Staged: YES | Working: YES

git reset --mixed HEAD~1  # or just git reset
# Commit: undone | Staged: NO  | Working: YES

git reset --hard HEAD~1
# Commit: undone | Staged: NO  | Working: NO
# ⚠️ Changes are GONE (unless reflog)`,
                language: "bash"
            },
            {
                node: "I",
                title: "When to Use Which",
                explanation: "Rule of thumb: Use reset for LOCAL commits you haven't shared. Use revert for commits that are already pushed/shared. Never reset --hard on shared branches. Use reflog as a safety net.",
                code: `# SHARED branch (main, develop):
git revert abc1234  # Safe! Creates new commit

# LOCAL branch (your feature):
git reset --soft HEAD~1  # Redo the commit
git reset --hard HEAD~1  # Discard completely

# Accidentally reset --hard?
git reflog  # Shows all HEAD movements
git reset --hard HEAD@{2}  # Recover!`,
                language: "bash"
            }
        ]
    }
];
