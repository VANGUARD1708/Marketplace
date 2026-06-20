import { Router } from "express";

const router = Router();

let conversations = [
  {
    id: 1,
    buyerId: 1,
    sellerId: 2,
    createdAt: new Date(),
  },
];

let messages = [
  {
    id: 1,
    conversationId: 1,
    senderId: 1,
    type: "text",
    content: "Hello, is this still available?",
    createdAt: new Date(),
  },
];

/**
 * GET /api/chat/conversations
 /
router.get("/conversations", (_req, res) => {
  res.json(conversations);
});

/*
 * POST /api/chat/conversations
 /
router.post("/conversations", (req, res) => {
  const { buyerId, sellerId } = req.body;

  if (!buyerId || !sellerId) {
    return res.status(400).json({
      error: "buyerId and sellerId required",
    });
  }

  const conversation = {
    id: Date.now(),
    buyerId,
    sellerId,
    createdAt: new Date(),
  };

  conversations.unshift(conversation);

  res.status(201).json(conversation);
});

/*
 * GET /api/chat/conversations/:id
 /
router.get("/conversations/:id", (req, res) => {
  const conversation = conversations.find(
    (c) => c.id === Number(req.params.id)
  );

  if (!conversation) {
    return res.status(404).json({
      error: "Conversation not found",
    });
  }

  res.json(conversation);
});

/*
 * GET /api/chat/conversations/:id/messages
 /
router.get("/conversations/:id/messages", (req, res) => {
  const conversationMessages = messages.filter(
    (m) => m.conversationId === Number(req.params.id)
  );

  res.json(conversationMessages);
});

/*
 * POST /api/chat/conversations/:id/messages
 */
router.post("/conversations/:id/messages", (req, res) => {
  const {
    senderId,
    content,
    type = "text",
  } = req.body;

  if (!senderId || !content) {
    return res.status(400).json({
      error: "senderId and content required",
    });
  }

  const message = {
    id: Date.now(),
    conversationId: Number(req.params.id),
    senderId,
    type,
    content,
    createdAt: new Date(),
  };

  messages.push(message);

  res.status(201).json(message);
});

export default router;