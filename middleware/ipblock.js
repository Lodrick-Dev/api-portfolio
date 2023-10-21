// middleware function to block IP addresses after 3 failed login attempts
const IpModel = require("../models/ip.model");
module.exports.blockIpMiddleware = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  //   console.log(ip);

  // check if the IP address is already blocked
  //   const isBlocked = await blockedIps.findOne({ ip });
  const ipData = await IpModel.findOne({ ipblocks: ip });
  const expireDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

  // get the number of failed login attempts for this IP address
  //   const loginAttempt = await loginAttempts.findOne({ ip });

  //   return;
  if (ipData) {
    //existe déjà
    const nbTentative = await ipData.loginattempts; // nombre de tentativ
    const expire = await ipData.expire; // timestamp
    // console.log(ipData);
    // console.log("l'expire :" + expire);
    if (nbTentative >= 3) {
      // console.log("ici mon frère");
      //si y a déjà 3 tentative
      if (expire > new Date(Date.now())) {
        return res.status(403).send("Vous êtes bloqué");
        // next();
      }
    } else {
      //pas 3 tentative alors on incrémente
      const ipCatch = await IpModel.findOneAndUpdate(
        { ipblocks: ip },
        { $inc: { loginattempts: 1 } },
        { new: true }
      );
      if (ipCatch.loginattempts === 3) {
        const ipCatch = await IpModel.findOneAndUpdate(
          { ipblocks: ip },
          { expire: expireDate },
          { new: true }
        );
      }
    }
  } else {
    //n'existe pas
    // const expiryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
    await IpModel.create({
      ipblocks: ip,
    });
  }

  // IP address is not blocked, continue to the next middleware
  // next();
};

module.exports.checkIP = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  //   console.log(ip);

  // check if the IP address is already blocked
  //   const isBlocked = await blockedIps.findOne({ ip });
  const ipData = await IpModel.findOne({ ipblocks: ip });
  if (ipData) {
    //existe déjà
    const nbTentative = await ipData.loginattempts; // nombre de tentativ
    const expire = await ipData.expire; // timestamp
    // console.log(nbTentative);
    // console.log(expire);
    if (nbTentative >= 3) {
      // console.log("ici mon frère");
      //si y a déjà 3 tentative
      if (expire > new Date(Date.now())) {
        return res.status(200).json({ redirection: "ok" });
        // res.redirect("https://www.google.com");
      }
    }
  }
  next();
};
