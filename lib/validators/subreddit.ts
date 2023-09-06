import z from "zod";

// create new subreddit
export const SubredditValidator = z.object({
    name: z.string().min(3).max(21),
});

// id của subreddit

export const SubredditSubscriptionValidator = z.object({
    subredditId: z.string(),
});

// create payload input
export type CreateSubredditPayload = z.infer<typeof SubredditValidator>;
export type SubscribeToSubredditPayload = z.infer<
    typeof SubredditSubscriptionValidator
>;
