var express = require('express');
var router = express.Router();


var customFunctions = require('./customfunctions'); // put this in the same directory (i.e. 'routes')

// generate a random userId for direct line authorization
const userId = customFunctions.generateRandomUserId();

// retrieves the direct line secret
const directLineSecret = customFunctions.getDirectLineSecret();
// console.log('directLineSecret: ', directLineSecret);


/* GET home page. */
router.get('/', function(req, res, next) {
  const data = {
    title: 'Home',
    message: 'Welcome to my website',
    userId: userId
 }

  res.render('index', { data });  // pass server site variables to be rendered as HTML in 'data'
});


/* GET direct line secret */
/*
router.get('/api/secret', (req, res) => {
  secret = directLineSecret;
  res.send( { secret } );
});
*/


// Get user-specific DirectLine token and return it
router.post('/api/direct-line-token', async (req, res) => {
  let directLineTokenResponse;
  try {
      secret = directLineSecret;
      directLineTokenResponse = await customFunctions.fetchDirectLineTokenAsync(secret, userId);
  } catch (e) {
      if (e instanceof Error) {
          res.status(400).send({ message: e.message });
          return;
      }

      throw e;
  }

  const response = { ...directLineTokenResponse, userId: userId };
  // console.log ('userId: ' + response.userId);
  // console.log ('token: ' + response.token);
  res.send(response);
});


module.exports = router;
