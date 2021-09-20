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

export const getCommentData = async (url: string, quantity: number) => {
  try {
    const data = await (await fetch(`${url}.json`)).json();
    const commentData = data[1].data.children;
    let comments = [];
    for (let i = 0; i < quantity; i++) {
      const comment = commentData[i].data;
      comments.push({
        content: comment.body,
        author: comment.author,
        mod: comment.distinguished === "moderator",
        isSubmitter: comment.is_submitter,
        controversiality: comment.controversiality,
        upvotes: comment.ups,
        downvotes: comment.downs,
      });
    }
    console.log(comments);
    return comments;
  } catch (error) {
    console.log(error);
  }
};
