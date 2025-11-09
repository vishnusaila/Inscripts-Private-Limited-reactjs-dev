// services/trelloService.js - Trello API wrappers
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "https://api.trello.com/1";
const KEY = process.env.TRELLO_KEY;
const TOKEN = process.env.TRELLO_TOKEN;

// Helper to include auth params
function authParams() {
  if (!KEY || !TOKEN) {
    throw new Error("Trello KEY or TOKEN is missing in .env");
  }
  return { key: KEY, token: TOKEN };
}

// ==================== BOARD METHODS ====================

// Create a new board
export async function createBoard({ name, defaultLists = true }) {
  if (!name) throw new Error("Board name is required");
  const url = `${BASE_URL}/boards/`;
  const res = await axios.post(url, null, { params: { name, defaultLists, ...authParams() } });
  return res.data;
}

// Get all boards for the authenticated member
export async function getMyBoards() {
  const url = `${BASE_URL}/members/me/boards`;
  const res = await axios.get(url, { params: authParams() });
  return res.data;
}

// Get all lists for a specific board
export async function getListsForBoard(boardId) {
  if (!boardId) throw new Error("boardId is required");
  const url = `${BASE_URL}/boards/${boardId}/lists`;
  const res = await axios.get(url, { params: authParams() });
  return res.data;
}

// Get lists along with cards for a board
export async function getListsWithCards(boardId) {
  const lists = await getListsForBoard(boardId);

  const url = `${BASE_URL}/boards/${boardId}/cards`;
  const res = await axios.get(url, { params: authParams() });
  const cards = res.data;

  // Attach cards to their corresponding lists
  return lists.map((list) => ({
    ...list,
    cards: cards.filter((card) => card.idList === list.id),
  }));
}

// ==================== CARD METHODS ====================

// Create a new card
export async function createCard({ idList, name, desc = "" }) {
  if (!idList || !name) throw new Error("idList and name are required");
  const url = `${BASE_URL}/cards`;
  const res = await axios.post(url, null, { params: { idList, name, desc, ...authParams() } });
  return res.data;
}

// Update a card
export async function updateCard(cardId, updates = {}) {
  if (!cardId) throw new Error("cardId is required");
  const url = `${BASE_URL}/cards/${cardId}`;
  const res = await axios.put(url, null, { params: { ...updates, ...authParams() } });
  return res.data;
}

// Archive (close) a card
export async function closeCard(cardId) {
  if (!cardId) throw new Error("cardId is required");
  const url = `${BASE_URL}/cards/${cardId}`;
  const res = await axios.put(url, null, { params: { closed: true, ...authParams() } });
  return res.data;
}
