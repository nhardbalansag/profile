
# Getting Started

### Developer
1. Bernard Balansag

### Technology
# React + Vite

### Page Link
- [`Bernard Balansag Dev Portfolio`](https://nhardbalansag.github.io/profile/)


### Design Inspiration
1. https://img.daisyui.com/images/store/screenshots/agency-landingpage-react.webp
2. https://github.com/merakiuilabs/hero-header-template

## Running the application

```bash
# install packages
npm install

# compile the tailwind
npx tailwindcss -i ./src/App.css -o ./src/output.css --watch

# run the project
npm run dev

```
### Versioning

1. Specify type of commit
- build: build related changes
- chore: a code change that external users wont see
- feat: a new feature
- fix: bug fix
- refactor: bug fix that adds new feature
- docs: documentation related
- style: UI related
- test: related to testings

### Versioning Tools
- [`Git Flow`](https://danielkummer.github.io/git-flow-cheatsheet/)

### Versioning Categories
1. MAJOR - when creating new phases of a project
2. MINOR/RELEASE - functionality in a backward compatible manner such as requests.
3. PATCH/HOTFIX - bug fix related

### For Code Maintenance

```bash
# using git flow
git clone https://github.com/nhardbalansag/IOWO-AREA7-APP.git

git flow init

# accept all default configurations by clicking enter then it will redirect you to the develop branch

# Before checking out to a new branch for a release version, execute this first to know the current tag in the master branch
git describe --tags --abbrev=0 master

# for features update
git flow feature start 1.0.0

# for hotfix update
git flow hotfix start 1.0.0

git add . / your specific update

git commit -m "commit message"

git push origin HEAD / current branch name

git flow feature finish or git flow hotfix finish

git push origin develop

# After pushing to the develop branch, go to the repository and create a pull request from the develop branch to master master branch

git checkout master

git pull origin master

# Add release tag version
git tag -a v1.1.0

# bash will show then remove the comment by pressing x on your keyboard

# to add the tag in the master branch
git push origin master --tags

```

### Generating a release

```bash
# generate a build for local deployment
npm install
npx tailwindcss -i ./src/App.css -o ./src/output.css --watch
npm run build

```

### Debugging
- none

### Github Update Deployment
1. install dependecies
    -   npm install npm install gh-pages --save-dev
2. go to package.json and add "homepage": "https://nhardbalansag.github.io/profile",
    format: https://<github username>.github.io/<repository name>
3. add also this under scripts "deploy": "gh-pages -d dist"
4. check gh-pages branch if index.html imported header files for css and js has the repository name on it
    example: 
            <script type="module" crossorigin src="/<repository name>/assets/index-sCSJl_wq.js"></script>
            <link rel="stylesheet" crossorigin href="/<repository name>/assets/index-n_ryQ3BS.css">
