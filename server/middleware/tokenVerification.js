const jwt = require("jsonwebtoken");

function tokenVerification(req, res, next) {
  // Pobranie tokenu z nagłówka
  let token = req.headers["x-access-token"];
  
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  // Weryfikacja poprawności tokenu
  jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decodedUser) => {
    if (err) {
      console.log("Unauthorized!");
      return res.status(401).send({ message: "Unauthorized!" });
    }
    
    console.log("Token poprawny, użytkownik: " + decodedUser._id);
    req.user = decodedUser;
    next();
  });
}

module.exports = tokenVerification;

