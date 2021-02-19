# detect-package-changes

_TLDR: run `npx detect-package-changes install` in the root folder of the project_

---------------------------------------------------------

Requires npm, git and a bash-compatible shell, including WSL.

Checks if your `package-lock.json` dependencies versions match the actual files in you `node_module` folder after you checkout or pull (merge) branches.

For performance reasons only top-level dependencies in `package.json` are checked. Versions between `package.json` and `package-lock.json` files are also not checked as `npm install` should take care of this consistency.

## Install

Run `npx detect-package-changes install` in the root folder of the project. To remove, run `npx detect-package-changes uninstall`.

## Usage

After installation you should get a warning message when checking out branches and a version mismatch is detected. This package does not update or modify any project-related files. Note, however, that this project does modify git hooks.

## CLI reference

```
npx detect-package-changes <command> <args>

command:
  install (default): insert the checks into git hooks
  uninstall: remove the inserted checks from git hooks
  check: manually run the check (you probably don't need to use this)
  help: see this message

args:
  --verbose: enables debug messages that might help in error investigations
  --hooks=<comma-separated list of git hooks>: add the checks to these specific hooks. Default is --hooks=post-checkout,post-merge,post-rebase
  --folder=<folder>: the root folder of the project to add the checks to (this is generally auto-detected correctly but you may override it here)
  ```

## Roadmap

- Make it compatible with monorepos
