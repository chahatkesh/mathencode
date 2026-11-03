# Git hooks

Hooks are installed by Husky (`pnpm prepare`).

## pre-commit

Formats and lints staged files, then type-checks when TypeScript files are staged.

## commit-msg

Requires a conventional commit message: `type(optional-scope): description`.

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

## pre-push

Runs the type check, ESLint, and Prettier check for the whole project.
