const express= require ('express')
const app = express()
var exphbs  = require('express-handlebars');
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
var bodyParser = require('body-parser')
const port2= process.env.PORT || 2222


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
 
// parse application/json
app.use(bodyParser.json())

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const db=`mongodb+srv://ghsourav:ghsourav@cluster0.p8a4q.azure.mongodb.net/testurl?retryWrites=true&w=majority`

mongoose.connect(
    db,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err) =>{
        if (err) throw err;
        console.log(`Db Connect `);
    }
);
app.get('/', async (req, res) => {
    await ShortUrl.find({})
    .lean()
    .then((body)=>{
      res.render('home', { body , title:`Home` })
    })
    
   // console.log(shortUrls)
  })
  

  app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
  
    res.redirect('/')
  })
  
  app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)
  
    shortUrl.clicks++
    shortUrl.save()
  
    res.redirect(shortUrl.full)
  })
  



app.listen(port2)

console.log(`Server runs on ` + port2)