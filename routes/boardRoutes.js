// routes/boardRoutes.js
import express from "express";
import {
  createBoard,
  getListsForBoard,
  getMyBoards,
  getListsWithCards,
} from "../services/trelloService.js";

const router = express.Router();

// POST /api/boards -> create board
router.post("/", async (req, res) => {
  try {
    const { name, defaultLists = true } = req.body;
    if (!name) return res.status(400).json({ error: "name required" });

    const board = await createBoard({ name, defaultLists });
    const io = req.app.get("socketio");
    io.emit("trello:event", { type: "boardCreated", board });

    res.status(201).json(board);
  } catch (err) {
    console.error("create board error:", err?.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to create board" });
  }
});

// GET /api/boards -> list my boards
router.get("/", async (req, res) => {
  try {
    const boards = await getMyBoards();
    res.json(boards);
  } catch (err) {
    console.error("get boards error:", err?.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to get boards" });
  }
});

// GET /api/boards/:boardId/lists-with-cards
router.get("/:boardId/lists-with-cards", async (req, res) => {
  try {
    const data = await getListsWithCards(req.params.boardId);
    res.json(data);
  } catch (err) {
    console.error("get lists-with-cards error:", err?.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to get lists with cards" });
  }
});

// GET /api/boards/:boardId/lists
router.get("/:boardId/lists", async (req, res) => {
  try {
    const lists = await getListsForBoard(req.params.boardId);
    res.json(lists);
  } catch (err) {
    console.error("get lists error:", err?.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to get lists" });
  }
});

export default router;
