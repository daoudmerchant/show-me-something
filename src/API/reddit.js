export const getRedditData = async ({
  subreddit = "all",
  limit = 10,
  timeframe = "day",
  filter = "top",
}) => {
  try {
    const data = await (
      await fetch(
        `https://www.reddit.com/r/${subreddit}/${filter}.json?limit=${limit}&t=${timeframe}&raw_json=1`
      )
    ).json();
    console.log(data);
    const parsedData = data.data.children.map((child) => ({
      title: child.data.title,
      text: child.data.selftext,
      subreddit: child.data.subreddit,
      upvotes: child.data.ups,
      downvotes: child.data.downs,
      controversiality: child.data.upvote_ratio,
      id: child.data.id,
      nsfw: child.data.over_18,
      url: `https://www.reddit.com${child.data.permalink.slice(0, -1)}`,
      type:
        child.data.post_hint ||
        (!!child.data.gallery_data
          ? "gallery"
          : child.data.url.includes("reddit")
          ? "text"
          : "website"),
      content: (() => {
        if (child.data.gallery_data) {
          // is Reddit gallery of images
          const galleryKeys = child.data.gallery_data.items.map(
            (item) => item.media_id
          );
          return {
            images: galleryKeys.map((key) =>
              child.data.media_metadata[key].p.map((img) => ({
                url: img.u,
                width: img.x,
                height: img.y,
              }))
            ),
          };
        }
        switch (child.data.post_hint) {
          case "hosted:video":
            // remove "?source=fallback" from url
            const videoUrl = child.data.media.reddit_video.fallback_url.slice(
              0,
              -16
            );
            return {
              videourl: videoUrl,
              audiourl: videoUrl.split("DASH")[0].concat("DASH_audio.mp4"),
              width: child.data.media.reddit_video.width,
              height: child.data.media.reddit_video.height,
            };
          case "rich:video":
            let url;
            if (child.data.media.oembed.provider_name === "Gfycat") {
              url = child.data.media.oembed.thumbnail_url
                .split("-")[0]
                .concat("-mobile.mp4");
            }
            if (child.data.media.oembed.provider_name === "YouTube") {
              url = child.data.media.oembed.html.split("\\")[5];
            }
            return {
              videourl: url,
              width: child.data.media.oembed.thumbnail_width,
              height: child.data.media.oembed.thumbnail_height,
            };
          case "image":
            return {
              thumbnail: {
                url: child.data.thumbnail,
                width: child.data.thumbnail_width,
                height: child.data.thumbnail_height,
              },
              images: child.data.preview.images[0].resolutions,
              fallback: child.data.url,
            };
          default:
            return {
              url: child.data.url,
            };
        }
      })(),
    }));
    return parsedData;
  } catch (error) {
    console.error(error);
  }
};

export const getCommentData = async (url) => {
  try {
    const data = await (await fetch(`${url}.json`)).json();
    console.log(data);
    const comments = data[1].data.children;
    return (
      comments
        // @ts-ignore
        .map((comment) => ({
          content: comment.data.body,
          author: comment.data.author,
          isMod: comment.data.distinguished === "moderator",
          isSubmitter: comment.data.is_submitter,
          controversiality: comment.data.controversiality,
          upvotes: comment.data.ups,
          downvotes: comment.data.downs,
        }))
        // @ts-ignore
        .filter((comment) => !comment.isMod)
    );
  } catch (error) {
    console.log(error);
  }
};
