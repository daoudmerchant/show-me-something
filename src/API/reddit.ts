interface RedditParams {
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
}: RedditParams = {}) => {
  try {
    const data = await (
      await fetch(
        `https://www.reddit.com/r/${subreddit}/${filter}.json?limit=${limit}&t=${timeframe}`
      )
    ).json();
    console.log(data);
    const parsedData = data.data.children.map((child: any) => ({
      title: child.data.title,
      text: child.data.selftext,
      subreddit: child.data.subreddit,
      id: child.data.id,
      nsfw: child.data.over_18,
      url: `https://www.reddit.com${child.data.permalink.slice(0, -1)}`,
      content: (() => {
        switch (child.data.post_hint) {
          case "hosted:video":
            return {
              url: child.data.media.reddit_video.fallback_url,
              width: child.data.media.reddit_video.width,
              height: child.data.media.reddit_video.height,
            };
          case "rich:video":
            if (child.data.media.oembed.provider_name === "Gfycat") {
              return {
                url: child.data.media.oembed.thumbnail_url
                  .split("-")[0]
                  .concat("-mobile.mp4"),
                width: child.data.media.oembed.thumbnail_width,
                height: child.data.media.oembed.thumbnail_height,
              };
            }
            break;
          case "image":
            return {
              thumbnail: {
                url: child.data.thumbnail,
                width: child.data.thumbnail_width,
                height: child.data.thumbnail_height,
              },
              url: child.data.url,
            };
          case undefined:
            return null;
        }
      })(),
    }));
    return parsedData;
  } catch (error) {
    console.error(error);
  }
};

export const getCommentData = async (url: string) => {
  try {
    const data = await (await fetch(`${url}.json`)).json();
    console.log(data);
    const comments = data[1].data.children;
    // @ts-ignore
    return comments.map((comment) => ({
      content: comment.data.body,
      author: comment.data.author,
      isMod: comment.data.distinguished === "moderator",
      isSubmitter: comment.data.is_submitter,
      controversiality: comment.data.controversiality,
      upvotes: comment.data.ups,
      downvotes: comment.data.downs,
    }));
  } catch (error) {
    console.log(error);
  }
};
