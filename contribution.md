# Contributing to SkillsBridge

Thanks for contributing! Keep changes focused, easy to review, and isolated to the screen or feature you are working on.

Project and agent conventions live in [AGENTS.md](AGENTS.md). Read it before changing Expo or React Native code.

## Fork the repository

For external contributions, create your own fork on GitHub first. Do not push feature branches directly to the upstream repository.

```bash
git clone https://github.com/<your-username>/<repository>.git
cd SkillsBridge-Android
git remote add upstream https://github.com/<owner>/<repository>.git
git remote -v
npm install
```

Keep `origin` pointed at your fork and `upstream` pointed at the main repository. Sync your local `main` from upstream before starting work:

```bash
git switch main
git fetch upstream
git pull --ff-only upstream main
git push origin main
git switch -c feature/short-description
```

If you already have a local checkout, add the remotes instead of cloning into another nested directory.

## Clone the repository

Clone the repository once, then work from the project directory:

```bash
git clone <repository-url>
cd SkillsBridge-Android
npm install
git status
```

Use the repository URL provided by the team. HTTPS and SSH are both valid:

```bash
git clone https://github.com/<owner>/<repository>.git
# or
git clone git@github.com:<owner>/<repository>.git
```

If the project has already been cloned, do not clone it again into a nested directory. Update the existing checkout instead:

```bash
cd SkillsBridge-Android
git switch main
git pull origin main
```

## Before you start

1. Fork the repository and sync your local `main` from `upstream`.
2. Create a new branch for the task. Never make task changes directly on `main`.
3. Run `npm install` from the project root.
4. Read `AGENTS.md` for the Expo and React Native project conventions.

## Branch workflow

Start every change from an up-to-date `main` branch:

```bash
git switch main
git fetch upstream
git pull --ff-only upstream main
git switch -c feature/short-description
```

Use a descriptive branch name, such as:

- `feature/explore-screen`
- `fix/profile-spacing`
- `chore/update-contribution-guide`

Keep the branch focused on one task. Do not push directly to `main`, force-push shared branches, or include unrelated formatting changes.

## Keep changes scoped

- Edit only the files required for your task.
- Do not reformat or reorganize unrelated screens.
- Avoid changing shared components when a route-local change is enough.
- Preserve existing routes and navigation behavior unless the task explicitly changes them.
- Do not create or edit generated `android/` or `ios/` folders.

## Development checks

Run these commands before handing off your changes:

```bash
npm run lint
npm run typecheck
npx expo-doctor
```

For Android testing, start the development server with:

```bash
npm start
```

Then open the app in Expo Go or an Android development build.

## Handoff notes

In your handoff or pull request, include:

- What changed and which files were edited.
- How the change was tested.
- Any known limitations or follow-up work.

## Open a pull request

After the checks pass, review the diff and commit only the intended files:

```bash
git status
git diff
git add path/to/changed-file another-file
git commit -m "Describe the focused change"
git push -u origin feature/short-description
```

Open a pull request from `your-username:feature/short-description` into `owner:main` in the repository host. The PR description should include:

1. A short summary of the change.
2. The files or routes changed.
3. How the change was tested.
4. Screenshots or a short recording for visual changes.
5. Any known limitations or follow-up work.

Before requesting review, confirm that the PR contains only the intended task changes and that CI is passing. Resolve review comments on the branch, push the updates, and merge only through the approved PR process.
