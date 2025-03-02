# Contributing

## Install

1. Install git
2. [Install nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
3. Clone and get into the repo
   ```
   git clone https://github.com/txvdv/hai-dx
   cd hai-dx
   ```
4. Install/use Node and package dependencies
   ```
   nvm use
   npm install
   ```

## Contribute

### Trunk Based Development

Helpful scripts to commit straight to the trunk.  
See below for references and the contributing docs for more links about TBD.

- `tools/env/check.sh` will make sure correct node version is used
- `tools/tbd/pull` will do a git pull --rebase running npm ci, calling `tools/env/check.sh`
- `tools/tbd/push` will do a git push, calling `tools/tbd/pull.sh` and `tools/env/check.sh`

These are not required, but helpful for commit cadence. To use them:
1. Make those scripts executable:
   ```shell
   chmod +x tools/env/check.sh
   chmod +x tools/tbd/pull.sh
   chmod +x tools/tbd/push.sh
   ```
2. Run them from the terminal depending on the situation
   ```shell
   tools/env/check.sh
   ```
   ```shell
   tools/tbd/pull.sh
   ```
   ```shell
   tools/tbd/push.sh
   ```

To make these feel more git-like, you can add them as git [alias] commands
1. Add a `.gitconfig` (ignored by `.gitignore`) file at the root folder and chose your aliases.  
   For example:
   ```txt
   [alias]
   shipit = "!sh tools/tbd/push"
   tbd-pull = "!sh tools/tbd/pull"
   ```
2. Configure your local repo copy to use the .gitconfig
   ```shell
   git config --local include.path ../.gitconfig
   ```

#### References
- [Beginners Intro to Trunk Based Development](https://dev.to/jonlauridsen/beginners-intro-to-trunk-based-development-3158)
- [Practical Guide to Trunk Based Development](https://dev.to/jonlauridsen/practical-guide-to-trunk-based-development-1hlj)
