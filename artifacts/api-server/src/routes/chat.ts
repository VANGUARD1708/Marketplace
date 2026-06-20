import { Router } from "express";
import { db } from "@workspace/db";
import {
  conversationsTable,
  conversationParticipantsTable,
  messagesTable,
} from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/conversations", async (req, res) => {
  try {
    const userId = Number(req.query.userId);
    if (!userId) return res.status(400).json({ error: "userId required" });

    const participations = await db.query.conversationParticipantsTable.findMany({
      where: eq(conversationParticipantsTable.userId, userId),
    });

    const conversations = await Promise.all(
      participations.map((p) =>
        db.query.conversationsTable.findFirst({ where: eq(conversationsTable.id, p.conversationId) })
      )
    );

    return res.json(conversations.filter(Boolean));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load conversations" });
  }
});

router.post("/conversations", async (req, res) => {
  try {
    const { participantIds } = req.body;
    if (!Array.isArray(participantIds) || participantIds.length < 2) {
      return res.status(400).json({ error: "participantIds array of ≥2 required" });
    }

    const [conversation] = await db.insert(conversationsTable).values({ type: "direct" }).returning();

    await Promise.all(
      (participantIds as number[]).map((uid) =>
        db.insert(conversationParticipantsTable).values({ conversationId: conversation.id, userId: uid })
      )
    );

    return res.status(201).json(conversation);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create conversation" });
  }
});

router.get("/conversations/:id", async (req, res) => {
  try {
    const conversation = await db.query.conversationsTable.findFirst({
      where: eq(conversationsTable.id, Number(req.params.id)),
    });
    if (!conversation) return res.status(404).json({ error: "Conversation not found" });
    return res.json(conversation);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load conversation" });
  }
});

router.get("/conversations/:id/messages", async (req, res) => {
  try {
    const messages = await db.query.messagesTable.findMany({
      where: eq(messagesTable.conversationId, Number(req.params.id)),
      orderBy: (m, { asc }) => [asc(m.createdAt)],
    });
    return res.json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load messages" });
  }
});

router.post("/conversations/:id/messages", async (req, res) => {
  try {
    const { senderId, content, mediaUrl, messageType = "text" } = req.body;
    if (!senderId || !content) return res.status(400).json({ error: "senderId and content required" });

    const [message] = await db.insert(messagesTable).values({
      conversationId: Number(req.params.id),
      senderId: Number(senderId),
      content: String(content),
      mediaUrl,
      messageType,
    }).returning();

    return res.status(201).json(message);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to send message" });
  }
});

router.delete("/conversations/:id/messages/:msgId", async (req, res) => {
  try {
    await db.delete(messagesTable).where(
      and(
        eq(messagesTable.id, Number(req.params.msgId)),
        eq(messagesTable.conversationId, Number(req.params.id))
      )
    );
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete message" });
  }
});

export default router;
