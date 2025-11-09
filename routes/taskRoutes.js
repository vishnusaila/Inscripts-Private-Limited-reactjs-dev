// routes/taskRoutes.js
import express from "express";
import { createCard, updateCard, closeCard } from "../services/trelloService.js";

const router = express.Router();

// POST /api/tasks  -> create card
// payload: { listId, name, desc }
router.post("/", async (req, res) => {
  try {
    const { listId, name, desc } = req.body;
    if (!listId || !name)
      return res.status(400).json({ error: "listId and name required" });

    // Create card via Trello API
    const card = await createCard({ idList: listId, name, desc });

    // Broadcast to all clients with listId for frontend updates
    const io = req.app.get("socketio");
    io.emit("trello:event", {
      type: "cardCreated",
      card,
      listId: listId,
    });

    res.status(201).json(card);
  } catch (err) {
    console.error("create card error:", err?.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to create card", details: err?.message });
  }
});

// PUT /api/tasks/:cardId -> update card
// payload: { name, desc, idList }
router.put("/:cardId", async (req, res) => {
  try {
    const { cardId } = req.params;
    const updates = req.body;

    const card = await updateCard(cardId, updates);

    // Broadcast update
    const io = req.app.get("socketio");
    io.emit("trello:event", {
      type: "cardUpdated",
      card,
      listId: updates.idList || card.idList,
    });

    res.json(card);
  } catch (err) {
    console.error("update card error:", err?.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to update card" });
  }
});

// DELETE /api/tasks/:cardId -> archive (closed=true)
router.delete("/:cardId", async (req, res) => {
  try {
    const { cardId } = req.params;

    const card = await closeCard(cardId);

    // Broadcast deletion
    const io = req.app.get("socketio");
    io.emit("trello:event", {
      type: "cardDeleted",
      cardId,
      listId: card.idList, // so frontend knows which list to remove from
    });

    res.json({ ok: true, card });
  } catch (err) {
    console.error("delete card error:", err?.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to delete/close card" });
  }
});

export default router;
