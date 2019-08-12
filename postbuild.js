const fs = require('fs');
const indexPath = 'dist/todo-app-electron/index.html';

fs.readFile(indexPath, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  const result = data.replace(/type="module"/g, 'type="text/javascript"')

  fs.writeFile(indexPath, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});