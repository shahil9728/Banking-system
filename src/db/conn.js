const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Shahil:Shahil123@cluster0.fedo0nq.mongodb.net/SahuBank?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("Connection is Successful")
}).catch((error)=>{
    console.log(error);
})