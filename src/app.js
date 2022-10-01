const express = require('express')
const app = express();
require('./db/conn')
const path = require('path')
const hbs = require('hbs')
const mongoose = require('mongoose')
const User = require('./modules/usermessage')
const bodyparser = require('body-parser');
const { getEventListeners } = require('events');
const { response } = require('express');
const { type } = require('os');
app.use(bodyparser.urlencoded({ extended: false }));
const port = process.env.PORT || 5000
var urlencodedParser = bodyparser.urlencoded({ extended: false })

const templatepath = path.join(__dirname, 'templates/views')

app.use('/images', express.static(path.join(__dirname, '/templates/images')))
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')))
app.use('/jq', express.static(path.join(__dirname, '../node_modules/jquery/dist')))
app.use('/partial', express.static(path.join(__dirname, '../styles/partials')))

app.set('view engine', 'hbs');
app.set('views', templatepath)
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index.ejs',{success:''})
})

app.post('/newcustomer', async (req, res) => {
    try {
        const userdata = new User(req.body);
        await userdata.save();
        res.render('index.ejs',{success:"You have successfully opened your account"})
        // res.redirect('/')
    }
    catch (error) {
        res.status(500).send(error);
    }
})

var schema = new mongoose.Schema({
    name: String,
    email: String,
    balance: Number,
})


var detailsmodel = mongoose.model("users", schema);
app.get('/allcustomers', function (req, res) {
    detailsmodel.find({}, function (err, allDetails) {
        if (err) {
            console.log(err)
        }
        else {
            res.render('data.ejs', { details: allDetails, success: '' })
        }
    })
})

app.post('/transfermoney', urlencodedParser, async function (req, res) {
    try {
        var sender1 = req.body.sender;
        var reciever1 = req.body.reciever;
        var money1 = req.body.money;
        const firstuser = await User.findOne({ name: sender1 })
        const seconduser = await User.findOne({ name: reciever1 })
        const firstbal = parseInt(firstuser.balance) - parseInt(money1);
        const secondbal = parseInt(seconduser.balance) + parseInt(money1);
        await User.findOneAndUpdate({ name: sender1 }, { balance: firstbal });
        await User.findOneAndUpdate({ name: reciever1 }, { balance: secondbal });
        detailsmodel.find({}, function (err, allDetails) {
            if (err) {
                console.log(err)
            }
            else {
                res.render('data.ejs', { details: allDetails, success: "Money transfered successfully" })
            }
        })
    }
    catch (err) {
        res.status(404).send(err);
    }
})

app.listen(port, (req, res) => {
    console.log("Server is running at 5000")
})
// <% if(check) { %>
//     <div class="alert success">
//         <span class="closebtn">&times;</span>
//         <strong><%= title %></strong><%= success %>
//     </div>
//     <button class="closebtn" style="padding: 10px 10px 10px 10px; border-radius:20px;"><a href="/" style="color: black;">Back To Home</a></button>
// <% } %>