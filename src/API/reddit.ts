interface redditParams {
  subreddit?: string;
  limit?: number;
  timeframe?: "hour" | "day" | "week" | "month" | "year" | "all";
  filter?:
    | "controversial"
    | "best"
    | "hot"
    | "new"
    | "random"
    | "rising"
    | "top";
}

export const getRedditData = async ({
  subreddit = "all",
  limit = 10,
  timeframe = "day",
  filter = "top",
}: redditParams = {}) => {
  try {
    const data = await (
      await fetch(
        `https://www.reddit.com/r/${subreddit}/${filter}.json?limit=${limit}&t=${timeframe}`
      )
    ).json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
