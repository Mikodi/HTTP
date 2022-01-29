const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const app = express()
const port = 8000

const fullPath = path.join(__dirname, "files");
const HTML = path.join(__dirname, 'index.html');
const auth = path.join(__dirname, 'auth.html');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


const user = {
    id: 123,
    username: "testuser",
    password: "qwerty"
    };

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
    if (req.cookies.user === undefined) {
        return res.status(400).send("Вы не авторизованы.")
    }

    if (req.cookies.user.authorized === true && req.cookies.user.userId == user.id) {
        const content = JSON.stringify(req.cookies.user);
        fs.writeFile(`${fullPath}/filename.txt`, content, (err) => {
            if (err) {
                return console.log(err);
            }
            return res.status(200).send('success');
        })
    } else {
        return res.status(403).send("У вас недостаточно прав на это действие");
    }
}).all((req, res) => {
	return res.status(405).send("HTTP method not allowed");
});

app.route('/delete').delete((req, res) => {
    if (req.cookies.user === undefined) {
        return res.status(400).send("Вы не авторизованы.")
    }

    if (req.cookies.user.authorized === true && req.cookies.user.userId == user.id) {
        fs.unlink(`${fullPath}/filename.txt`, (err) => {
            if (err) {
                return console.log(err);
            }
            return res.status(200).send('success');
        })
    } else {
        return res.status(403).send("У вас недостаточно прав на это действие");
    }
}).all((req, res) => {
	return res.status(405).send("HTTP method not allowed");
});

app.route('/redirect').get((req, res) => {
    res.redirect('/redirected');
    
});

app.route('/auth').get((req, res) => {
    const resultHTML = fs.readFileSync(auth, 'utf-8');
    return res.status(200).send(resultHTML)
}).post((req, res) => {
    if (req.body.username === user.username && req.body.password === user.password) {
        res.cookie('user', {userId: user.id, authorized: true, path: '/', max_age: 172800});
        return res.status(200).send('Вы вошли в систему');
    } else {
        res.status(400).send("Неверный логин или пароль.");
    }
}).all((req, res) => {
	return res.status(405).send("HTTP method not allowed");
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



