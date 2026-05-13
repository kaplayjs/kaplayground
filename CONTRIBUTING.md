# Contributing to KAPLAYGROUND

Thanks for your interest in contributing with the KAPLAYGROUND repo. Through this document you will see important information
for contributing in the repository.

## Pre-requisites

- [Node.js](https://nodejs.org/en)
- [pnpm](https://pnpm.io/) package manager

## Conventions

- For commit messages follow the KAPLAY.js repository [conventional commits guidelines.](https://github.com/kaplayjs/kaplay/blob/master/CONTRIBUTING.md#conventional-commits-guide)

## Branches

- `dev`: The branch with non-released changes and features in development, it is **the branch you checkout to develop your features**. It is the default branch.
- `master`: The deployment branch, this branch reflects what you can see in https://play.kaplayjs.com.

So what branch should I use for developing features and then creating PR? **dev**.

## Setup environment

```sh
git clone https://github.com/kaplayjs/kaplayground.git
cd kaplayground
pnpm i # will install and setup stuff of submodules
pnpm dev # will start the development server
pnpm fmt # before commit
```

## Merge dev with master workflow

If you have access to deployments and you need to merge changes in dev to master, so deployment is updated, you must follow this special
workflow:

```sh
git checkout dev
git merge master
git checkout master
git merge --ff-only dev
```
