import { generateId } from "ai";
import { InferSelectModel } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

type roleType = "user" | "assistant" | "tool";

export const userTable = pgTable("users", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const chat = pgTable("chat", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateId()),
  title: varchar({ length: 255 }).default("untitled"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const message = pgTable("message", {
  id: integer().primaryKey(),
  chatId: text()
    .notNull()
    .references(() => chat.id, { onDelete: "cascade" }),
  role: text("user").$type<roleType>(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  totalTokens: integer("total_tokens"),
  completionTime: timestamp("completion_time"),
});

export type Chat = InferSelectModel<typeof chat>;
export type Message = InferSelectModel<typeof message>;
