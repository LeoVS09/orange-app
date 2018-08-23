const express = require('express');
const path = require('path');
const config = require('./config.json');

const app = express();

app.use('/' + config.folders.static, express.static(path.join(__dirname,`../${config.folders.build}/${config.folders.static}`)));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, `../${config.folders.build}/index.html`));
});

console.log(`Start server at port: ${config.port}`);
app.listen(config.port, () => {
  console.log(`Server listening...`);
});
