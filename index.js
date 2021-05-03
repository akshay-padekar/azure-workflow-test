const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('./db/mongoose')

app.use(cors());
app.use(bodyParser.json());

require('./routes/index')(app);

app.listen(() => {
  console.log(`Server is running`);
});