// generate a random user id (used for directline calls)
module.exports.generateRandomUserId = function () {
    const crypto = require('crypto');
    const buffer = crypto.randomBytes(16);
    return `dl_${buffer.toString('hex')}`;  // direct line users must begin with dl_
};


// returns the direct line secret associated with the app service
module.exports.getDirectLineSecret = function () {
    const retSecret = 'dYf6vPBpcDM.1olRosOeT4uX1miRovyLKAXpa2aMszkWFnjWOM55NWs'

    return retSecret;
};


// returns the direct line token asynchronously
module.exports.fetchDirectLineTokenAsync = async function (secret, userId) {
    const response = await fetch('https://directline.botframework.com/v3/directline/tokens/generate', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${secret}`,
        },
        method: 'post',
        body: JSON.stringify({ user: { id: userId } })
      });
  
        if (!response.ok) {
          throw new Error(`Direct Line token API call failed with status ${response.status}`);
      }
  
      const responseJson = await response.json();
  
      const { conversationId, token, expires_in: expiresIn } = responseJson;
  
      return { conversationId, token, expiresIn };
};
