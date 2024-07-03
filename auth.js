const jwt = require('jsonwebtoken');

const ensureAuthorization = (req, _) => {
    try {
        const receivedJwt = req.header("Authorization");
        const decodedJwt = jwt.verify(receivedJwt, 'kkkk');
        console.log(decodedJwt);
        return decodedJwt;
    } catch (err) {
        console.log(err);
        return err;
    }
};

module.exports = ensureAuthorization;