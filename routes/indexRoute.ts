import express from "express";
import {
  ensureAuthenticated,
  forwardRole,
  ensureAdminAuthenticated,
} from "../middleware/checkAuth";
import { Session } from "../interfaces/index";
import { redisStore } from "../app";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/dashboard", ensureAuthenticated, forwardRole, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get(
  "/admin",
  ensureAuthenticated,
  ensureAdminAuthenticated,
  (req, res) => {
    const user = req.user;

    redisStore.all((error, sessions: Session[]) => {
      if (error) {
        return res.status(500).send("Error retrieving sessions");
      }
      const filteredSessions = Object.values(sessions || {}).reduce<Session[]>(
        (acc, sessionObj: Session) => {
          if (sessionObj.passport && sessionObj.passport.user) {
            acc.push(sessionObj);
          }
          return acc;
        },
        []
      );

      res.render("admin", {
        user: user,
        sessions: filteredSessions,
      });
    });
  }
);

router.post(
  "/admin/revoke-session",
  ensureAuthenticated,
  ensureAdminAuthenticated,
  (req, res) => {
    const sessionIdToRevoke = req.body.sessionId;
    if (!sessionIdToRevoke) {
      return res.status(400).send("No session ID provided.");
    }

    redisStore.destroy(sessionIdToRevoke, (err) => {
      if (err) {
        console.error("Failed to revoke session:", err);
        return res.status(500).send("Failed to revoke session.");
      }
      res.redirect("/admin");
    });
  }
);

export default router;
