const express = require("express");
const URL = require("../models/url");
const { restrictTo } = require("../middleware/auth");
const router = express.Router();

router.get('/admin/urls', restrictTo(['ADMIN']), async(req, res)=> {

    try{ 

        if(!req.user) return res.redirect('/login');
        const allUrls = await URL.find({});
        return res.render('home', {
           urls: allUrls
        });
    } catch (e){
        console.log(e);
        return res.status(500).send('Error fetching URLs');
    
    }

});

router.get('/', restrictTo(["NORMAL", "ADMIN"]),async(req, res)=> {

    try{ 

        if(!req.user) return res.redirect('/login');
        const allUrls = await URL.find({ createdBy: req.user._id });
        return res.render('home', {
           urls: allUrls
        });
    } catch (e){
        console.log(e);
        return res.status(500).send('Error fetching URLs');
    
    }

});

router.get('/singup',   (req, res) =>{
    try{ 
        return res.render('singup');
    } catch (e){
        console.log(e);
        return res.status(500).send('Error in singup');
    
    }
});

router.get('/login',   (req, res) =>{
    try{ 
        return res.render('login');
    } catch (e){
        console.log(e);
        return res.status(500).send('Error in login');
    
    }
});

module.exports = router;