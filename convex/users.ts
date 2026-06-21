import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateNewUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    if (user.length === 0) {
      await ctx.db.insert("UserTable", {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
      });
      return "User Created Successfully";
    }
    return "User Already Exists";
  },
});
