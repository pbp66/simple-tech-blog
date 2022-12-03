import path from "path";
import express, { application } from "express";
import session from "express-session";
import handlebars from "express-handlebars";
import routes from "./controllers";
import helpers from "./utils/helpers";
import sequelize from "./config/connection";
import SequelizeStore from "connect-session-sequelize";

const app = express();
// If the port is not specified in the .env file, use 3001.
const PORT = process.env.PORT || 3001;
const hbs = handlebars.create({ helpers });

// Have the server use a session
app.use(
	session.Cookie({
		secret: "",
		cookie: {
			// milliseconds 3,600,000 = 1 hour;
			maxAge: 1000 * 60 * 60;
		},
		resave: false,
		rolling: true,
		saveUninitialized: true,
		store: new SequelizeStore({ db: sequelize }),
	})
);

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("./public")));
app.use(routes);

await sequelize.sync({ force: false });

app.listen(PORT, () =>
	console.log(`\nNow listening at http://localhost:${PORT}\n`)
);
