# Contributing to SkillsBridge

Thanks for contributing! Keep changes focused, easy to review, and isolated to the screen or feature you are working on.

## Before you start

1. Pull the latest changes from the branch you are working on.
2. Run `npm install` from the project root.
3. Read `AGENTS.md` for the Expo and React Native project conventions.

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
