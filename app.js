const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');
const bodyParser = require('body-parser');
require('./db/mongoose')

app.use(cors());
app.use(bodyParser.json());

require('./routes/index')(app);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});