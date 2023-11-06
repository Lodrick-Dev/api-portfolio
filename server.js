const express = require("express"); //on export le packet express
const connectDB = require("./config/db");
const helmet = require("helmet"); //biblio pour ajouté des en-tete HTTP sécurisé
const csrf = require("csurf"); //contre les attuques CSRF

//on appellel la fonction qui fait jouer notre middleware
const { checkUser, requireAuth } = require("./middleware/auth.middleware");
const cookieParser = require("cookie-parser"); //pour lire cookies il nous faut ce package
require("dotenv").config({ path: "./config/.env" });
const cors = require("cors");
const { checkIP } = require("./middleware/ipblock");
//connection a la base donnée
connectDB();
const scriptSrcUrls = ["'self'", "http://localhost:3000"];
const styleSrcUrls = ["'self'", "http://localhost:3000"];

const app = express();
// const csrfProtection = csrf({ cookie: true });
//a voir lors du déploiement
//👇
// cookie: {
//   key: "csrf_token", // le nom de votre cookie CSRF
//   httpOnly: true, // pour empêcher la modification côté client
//   sameSite: "strict", // définissez ceci en fonction de vos besoins de sécurité
// },
//👆

// app.use(csrfProtection);//peut-être inutil
//cors
// origin: process.env.CLIENT_URL,
// const corsOption = {
//   origin: "http://localhost:3000",
//   credentials: true,
//   allowedHeaders: ["sessionId", "Content-Type"],
//   exposedHeaders: ["sessionId"],
//   methods: "GET,HEAD,PUT,POST,DELETE",
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
// };
// const allowedOrigins = [process.env.CLIENT_URLWWW, process.env.CLIENT_URL];
const allowedOrigins = ["http://localhost:3000"];
const corsOption = {
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No, not allowed by Cors"));
    }
  },
};
app.use(cors(corsOption));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: scriptSrcUrls,
        styleSrc: styleSrcUrls,
      },
    },
  })
);

//les middleware, sont des fonction qui peuvent accéder a l'objet Request(req)
//
//qui permet de traiter les donner de la req
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); //permet de traiter les cookie

//middleware jwt
//app.get("*", checkUser); //un ckeck pour vérifier si le token du user est bon
//appeller une seule fois quand l'utilisateur arrive sur l'appli
//comme ça si il a un token on le connect directement
//on le fera en front dans react dans useEffect peut-être dans le composant
//le plus haut
// app.get("/jwtid", requireAuth, (req, res) => {
// res.status(200).send(res.locals.user._id);
//   res.status(200).send(res.locals.user);
// });
// app.use("/jwtid", (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

//contre CSRF
// app.get("/", csrfProtection, (req, res) => {
//   const csrfToken = req.csrfToken();
//   res.status(200).json({ token: csrfToken });
// });
app.get("/jwtid", checkIP, requireAuth);

//les routes pour le user
app.use("/contact", require("./routes/contact.routes"));
app.use("/user", require("./routes/user.routes"));
app.use("/profil", require("./routes/image.profil.routes"));
//les routes pour les publications
app.use("/contents", require("./routes/post.routes"));
app.use("/post", require("./routes/image.post.routes"));
//route skills
app.use("/skill", require("./routes/skill.routes"));

//toujours le dernier(le serveur);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
