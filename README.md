## How to run
```bash
git clone git@github.com:acyanbird/pillbug.git
cd pillbug
npm install
npx vite # or npm run dev
```
Then you should automatically open the browser and see the demo.
Or visit http://localhost:4000 in your browser.

## How to deploy
```bash
npm run build # or npx vite build
```
Output files will be in `dist` folder. Check https://vitejs.dev/guide/static-deploy.html for more information.
This online demo is deployed on github pages. You can use workflow config file as a reference.

## Online Demo
https://acyanbird.github.io/pillbug/

## TODO
- [ ] Reduce duplicated code in single file
- [ ] Reduce by create common.js
- [ ] Loading page
- [ ] CSS overflow problem
- [ ] Animation using tween(?) or other library
