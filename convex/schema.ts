import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  UserTable: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    name: v.string(),
    subscription: v.optional(v.string()),
  }),
  TripDetailTable: defineTable({
    tripId: v.string(),
    tripDetail: v.any(),
    uid: v.optional(v.id("UserTable")),
  })
});
