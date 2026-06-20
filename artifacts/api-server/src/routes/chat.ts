import { Router } from "express";

const router = Router();

type Conversation = {
  id: number;
  buyerId: number;
  sellerId: number;
  createdAt: Date;
};

type Message = {
  id: number;
  conversationId: number;
  senderId: number;
  type: string;
  content: string;
  createdAt: Date;
};

let conversations: Conversation[] = [
  {
    id: 1,
    buyerId: 1,
    sellerId: 2,
    createdAt: new Date(),
  },
];

let messages: Message[] = [
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
 */
router.get("/conversations", (_req, res) => {
  return res.json(conversations);
});

/**
 * POST /api/chat/conversations
 */
router.post("/conversations", (req, res) => {
  const { buyerId, sellerId } = req.body;

  if (!buyerId || !sellerId) {
    return res.status(400).json({
      error: "buyerId and sellerId required",
    });
  }

  const conversation: Conversation = {
    id: Date.now(),
    buyerId: Number(buyerId),
    sellerId: Number(sellerId),
    createdAt: new Date(),
  };

  conversations.unshift(conversation);

  return res.status(201).json(conversation);
});

/**
 * GET /api/chat/conversations/:id
 */
router.get("/conversations/:id", (req, res) => {
  const conversation = conversations.find(
    (c) => c.id === Number(req.params.id),
  );

  if (!conversation) {
    return res.status(404).json({
      error: "Conversation not found",
    });
  }

  return res.json(conversation);
});

/**
 * GET /api/chat/conversations/:id/messages
 */
router.get(
  "/conversations/:id/messages",
  (req, res) => {
    const conversationMessages =
      messages.filter(
        (m) =>
          m.conversationId ===
          Number(req.params.id),
      );

    return res.json(
      conversationMessages,
    );
  },
);

/**
 * POST /api/chat/conversations/:id/messages
 */
router.post(
  "/conversations/:id/messages",
  (req, res) => {
    const {
      senderId,
      content,
      type = "text",
    } = req.body;

    if (!senderId || !content) {
      return res.status(400).json({
        error:
          "senderId and content required",
      });
    }

    const message: Message = {
      id: Date.now(),
      conversationId: Number(
        req.params.id,
      ),
      senderId: Number(senderId),
      type: String(type),
      content: String(content),
      createdAt: new Date(),
    };

    messages.push(message);

    return res.status(201).json(
      message,
    );
  },
);

export default router;