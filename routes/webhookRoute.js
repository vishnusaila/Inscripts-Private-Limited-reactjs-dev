// routes/webhookRoute.js
import express from "express";
const router = express.Router();

// Trello will POST webhook events here.
// Trello also does a verification HEAD/GET sometimes - respond 200.
// We normalize and broadcast to sockets.
router.post("/", (req, res) => {
  try {
    const body = req.body || {};
    // quick ack
    res.status(200).send("ok");

    const io = req.app.get("socketio");
    const event = {
      type: body?.action?.type || "unknown",
      action: body.action || null,
      model: body.model || null,
      raw: body,
    };

    // broadcast to all connected clients
    io.emit("trello:webhook", event);
  } catch (err) {
    console.error("webhook handler error:", err);
    res.status(500).send("error");
  }
});

export default router;
