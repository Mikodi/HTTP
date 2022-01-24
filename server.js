const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express()
const port = 8000

const fullPath = path.join(__dirname, "files");
const HTML = path.join(__dirname, 'index.html');


app.route('/get').get((req, res) => {
    try {
        const DirectoryFiles = fs.readdirSync(fullPath);
        const resultHTML = fs.readFileSync(HTML, 'utf-8').replace('Links', DirectoryFiles);
        return res.status(200).send(resultHTML);
    } catch {
        return res.status(500).send("Internal server error");
    }   

}).all((req, res) => {
	return res.status(405).send("HTTP method not allowed");
});

app.route('/post').post((req, res) => {
    return res.status(200).send('success');
}).all((req, res) => {
	return res.status(405).send("HTTP method not allowed");
});

app.route('/delete').delete((req, res) => {
    return res.status(200).send('success');
}).all((req, res) => {
	return res.status(405).send("HTTP method not allowed");
});

app.route('/redirect').get((req, res) => {
    res.redirect('/redirected');
    
});

app.get('/redirected', (req, res) => {
    return res.status(200).send('the resource is available at the new address /redirected');
});


app.use((req, res) => {
  return res.status(404).send('Not found');
});


app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})



