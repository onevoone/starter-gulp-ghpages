## Starter

Simple starter with `GulpJS`, `SCSS`, `es6`, `eslint` and `gh-pages`.

### Structure

    ├── .eslintrc.json
    ├── .gitignore
    ├── Readme.md
    ├── gulpfile.js
    ├── package.json
    └── src
        ├── css
        │   ├── sass
        │   │   ├── colors.scss
        │   │   ├── main.scss
        │   │   ├── reset.scss
        │   │   └── style.scss
        │   └── style.css
        ├── index.html
        └── js
            ├── script.js
            └── scripts
                ├── filst.js
                ├── last.js
                └── main.js

### SetUp

#### Install

    git https://github.com/skparallax/starter-gulp-ghpages.git new-idea
    cd new-idea
    npm install
    npm start

#### Build

    npm run build

`html`, `css` and `js` files will be concatenated, minified and copied to `/public` directory.

#### Deploy

    npm run deploy

`gh-pages` branch will be created after running `npm build` and `/public` directory will be automatically copied to the repository.

> `/public` directory shouldn't be in `.gitignore`

### License

[MIT](https://opensource.org/licenses/MIT)