const express = require('express');
const app = express();
const port = 3000;

app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/Attractor.html");
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});