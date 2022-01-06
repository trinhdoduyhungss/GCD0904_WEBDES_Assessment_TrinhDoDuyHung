let fs = require('fs')
let data_login = fs.readFileSync('form.json', 'utf8')
data_login = JSON.parse(data_login);
let data_users = fs.readFileSync('co.json', 'utf8')
data_users = JSON.parse(data_users);
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
app.use(function (req, res, next) { //allow cross origin requests
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
	res.header("Access-Control-Max-Age", "3600");
	res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
	next();
});
app.use(bodyParser.json());

app.get('/', function (req, res) {
	// res.sendfile('./index.html')
    res.send('Hello World!')
})

// login api
app.post('/login', function (req, res) {
    let username = req.body.name;
    let password = req.body.id;
    let result = data_login.find(function (element) {
        return element.name == username && element.id_student == password;
    });
    if (result) {
        res.send({'status': 'success'});
    } else {
        res.send({'status': 'failed'});
    }
});

// login checked api
app.post('/login_checked', function (req, res) {
    let password = req.body.id;
    let result = data_login.find(function (element) {
        return element.id_student === password;
    });
    if (result) {
        res.send({'status': 'success', 'name': result.name});
    } else {
        res.send({'status': 'failed'});
    }
})

// update password api
app.post('/update_password', function (req, res) {
    let user_name = req.body.name;
    let new_password = req.body.id;
    let result = data_login.find(function (element) {
        return element.name == user_name;
    });
    if (result) {
        result.id_student = new_password;
        res.send({'status': 'success'});
    } else {
        res.send({'status': 'failed'});
    }
    let new_data_login = data_login
    for(let i = 0; i < new_data_login.length; i++){
        if(new_data_login[i].name == user_name){
            new_data_login[i].id_student = new_password;
            break
        }
    }
    fs.writeFileSync('form.json', JSON.stringify(new_data_login));
})

// update information api
app.post('/update_information', function (req, res) {
    let user_name = req.body.name;
    let new_information = req.body.data;
    let result = data_users.find(function (element) {
        return element.name == user_name;
    });
    if (result) {
        let key_new_information = Object.keys(new_information);
        for(let i = 0; i < key_new_information.length; i++){
            result[key_new_information[i]] = new_information[key_new_information[i]];
        }
        res.send({'status': 'success'});
    } else {
        res.send({'status': 'failed'});
    }
    let new_data_users = data_users
    for(let i = 0; i < new_data_users.length; i++){
        if(new_data_users[i].name == user_name){
            let key_result = Object.keys(result);
            for(let j = 0; j < Object.keys(key_result).length; j++){
                console.log(key_result[j])
                new_data_users[i][key_result[j]] = result[key_result[j]];
            }
            break
        }
    }
    let new_data_login = data_login
    for(let i = 0; i < new_data_login.length; i++){
        if(new_data_login[i].name == user_name){
            new_data_login[i].name = result.name;
            break
        }
    }
    fs.writeFileSync('co.json', JSON.stringify(new_data_users));
    fs.writeFileSync('form.json', JSON.stringify(new_data_login));
})

// get information api
app.post('/get_information', function (req, res) {
    let user_name = req.body.name;
    let result = data_users.find(function (element, index) {
        return element.name == user_name || index+1 == user_name;
    });
    if (result) {
        res.send({'status': 'success', 'data': result});
    } else {
        res.send({'status': 'failed'});
    }
})

app.listen(5000, function () {
    console.log('Example app listening on port 5000!')
})