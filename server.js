import path from "path";
import express, { application } from "express";
import session from "express-session";
import handlebars from "express-handlebars";
import routes from "./controllers";
import helpers from "./utils/helpers";
import sequelize from "./config/connection";
import SequelizeStore from "connect-session-sequelize";

const app = express();
const PORT = process.env.PORT || 3001;
const hbs = handlebars.create({ helpers });

const sessionObject = {
	secret: "",
	cookie: {},
	resave: false,
	saveUninitialized: true,
	store: new SequelizeStore({ db: sequelize }),
};

app.use(session.Cookie(sessionObject));

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("./public")));
app.use(routes);

const sync = await sequelize.sync({ force: false });
app.listen(PORT, () =>
	console.log(`\nNow listening at http://localhost:${PORT}\n`)
);
