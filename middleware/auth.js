const { getUser } = require("../service/auth") // for stateful auth

function cheakForAuthentication(req, res, next){
    const authenticationHeaderValue = req.cookies?.token;  // use for cookies
    // const authenticationHeaderValue = req.headers['authorization']; // use for header

    if(!authenticationHeaderValue)
    return next();

    const user = getUser(authenticationHeaderValue);
    
    req.user = user;
    return next();

}

// Admin, normal
function restrictTo(roles){

    
    return function(req, res, next){
        if(!req.user )return res.redirect("/login");

        if(!roles.includes(req.user.role)) return res.end("UnAuthorized");

        return next();
    };

}



// async function restrictToLoggedinUserOnly(req, res, next) {
//     // const userUid = req.cookies?.uid;  // use for cookies
//     const userUid = req.headers['authorization']; // use for header

//     if(!userUid) return res.redirect('/login');

//     const token = userUid.split('Bearer ')[1]; // use for header // for get exact token
//     const user = getUser(token); // use for header

//     // const user = getUser(userUid); // use for cookies

//     if(!user) return res.redirect('/login');

//     req.user = user;
//     next();

// }

// async function cheakAuth(req, res, next) {
//     // const userUid = req.cookies?.uid; // for cookies
//     const userUid = req.headers['authorization']; // use for header
//     const token = userUid.split('Bearer ')[1]; // use for header // for get exact token

//     const user = getUser(token);
//     req.user = user;
//     next();
// }

module.exports={
    cheakForAuthentication,
    restrictTo
}