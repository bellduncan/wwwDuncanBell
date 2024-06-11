var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  const data = {
    title: 'Home',
    message: 'Hello from the server'  
 }

  res.render('index', { data });  // pass server site variables to be rendered as HTML in 'data'
});


router.get('/secret', (req, res) => {
  secret = 'dYf6vPBpcDM.1olRosOeT4uX1miRovyLKAXpa2aMszkWFnjWOM55NWs'  // direct line secret
  res.send( { secret } );
});

module.exports = router;
