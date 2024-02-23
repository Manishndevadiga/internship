const path = require('path');
module.exports = {
    get: (req, res) => {
        // Serve the login.html file
       res.render('homepage');
    }
};