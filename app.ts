import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import passportMiddleware from "./middleware/passportMiddleware";
import flash from "connect-flash";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.relative(process.cwd(), path.join(__dirname, ".env")),
});

const port = process.env.port || 8000;

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

import authRoute from "./routes/authRoute";
import indexRoute from "./routes/indexRoute";

app.use(express.json());
app.use(expressLayouts);
app.use(flash());
app.use(express.urlencoded({ extended: true }));
passportMiddleware(app);

app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.user);

  console.log("Entire session object:");
  console.log(req.session);

  console.log(`Session details are: `);
  console.log((req.session as any).passport);
  next();
});

app.use("/", indexRoute);
app.use("/auth", authRoute);

declare global {
  namespace Express {
    interface User {
      id: number;
      name: string;
      role: string;
      email?: string;
      password?: string;
      emails?: Array<{ primary: boolean; value: string }>;
    }
  }
}

app.listen(port, () => {
  console.log(`🚀 Server has started on port ${port}`);
});
