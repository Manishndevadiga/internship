const path = require('path');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const your_secret_key= "manish";


module.exports = {
    logout: (req, res) => {
        if (req.cookies.tokenname) {

            const token = req.cookies.tokenname;
            console.log("The token is " + token);

            jwt.verify(token, your_secret_key, (err, decoded) => {
                if (err) {
                    console.error('Error decoding token:', err);
                } else {

                    const  name  = decoded.name;
                    console.log('Decoded token:', decoded);
                    console.log(name);

                    res.clearCookie("tokenname", { path: '/' });

                    const alertMessage = `${name} You logged out successfully`;
                    const redirectTo = "/";

                    res.send(`
                        <div id="custom-alert" class="custom-alert">
                            <div class="alert-content">
                                <p>${alertMessage}</p>
                                <button onclick="redirectToHomepage()">OK</button>
                            </div>
                        </div>

                        <style>
                            .custom-alert {
                                position: fixed;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                background: url('https://res.cloudinary.com/dphaltxki/image/upload/v1708228553/qhkcp08qnqglmohzaz6o.jpg') center/cover no-repeat fixed;
                                padding: 20px;
                                border: 1px solid #ccc;
                                border-radius: 5px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                z-index: 1000;
                            }
                            
                            .alert-content {
                                text-align: center;
                            }
                            
                            .alert-content button {
                                padding: 10px 20px;
                                background-color: #007bff;
                                color: #fff;
                                border: none;
                                border-radius: 3px;
                                cursor: pointer;
                            }
                        </style>

                        <script>
                            function redirectToHomepage() {
                                window.location.href = '${redirectTo}';
                            }
                        </script>
                    `);
                }
            });
        } else {
            res.redirect('/');
        }
    }
};
