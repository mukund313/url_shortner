const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const {cheakForAuthentication, restrictTo} = require('./middleware/auth');

const {connectToMongoDB} = require("./connect");

const urlRouter = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRouter = require('./routes/user');


const URL =  require('./models/url');

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://127.0.0.1:27017/url-shortner')
.then(() => console.log('Mongodb connected'));

app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cheakForAuthentication);


app.use("/url", restrictTo(['NORMAL', "ADMIN"]), urlRouter);
app.use("/user", userRouter);
app.use("/", staticRoute);



// app.get("/singup", async (req, res)=> {
// try{ 
//     return res.render('singup');
// } catch (e){
//     console.log(e);
//     return res.status(500).send('Error fetching URLs');

// }
// });

// app.get("/singup", async (req, res)=> {
//     try{ 
//         return res.render('singup');
//     } catch (e){
//         console.log(e);
//         return res.status(500).send('Error fetching URLs');
    
//     }
//     });



app.get('/id/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
   const entry =  await URL.findOneAndUpdate(
    { shortId}, 
    {
        $push: {
                  visitHistorry: {timestamp: Date.now()}
    }}, );

    if(!entry){
        return res.status(404).send('Short URL not found');
    }
    res.redirect(entry.redirectURL);
});



app.listen(PORT, ()=> console.log(`Server Started at PORT: ${PORT}`))