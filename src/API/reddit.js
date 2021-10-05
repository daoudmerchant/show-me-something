export const getRedditData = async ({
  subreddit,
  limit,
  timeframe,
  filter,
}) => {
  try {
    const data = await (
      await fetch(
        `https://www.reddit.com/r/${subreddit}/${filter}.json?limit=${limit}&t=${timeframe}&raw_json=1`
      )
    ).json();
    // TODO: Improve error handling on Reddit down
    if (data.error === 404) {
      alert(`Couldn't retrieve subreddit ${subreddit}`);
      return [];
    }
    //
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
      type: (() => {
        if (child.data.post_hint === "link") {
          // Linked content
          if (child.data.url.includes("v.redd.it")) {
            // Reddit video crosspost
            return { media: "video", local: true };
          }
          if (child.data.url.includes("i.imgur.com")) {
            // Imgur
            if (child.data.url.slice(-4) === "gifv") {
              // Gif (video)
              return { media: "video", local: true };
            }
            alert(`Untreated Imgur content ${child.data.url}`);
            console.log(child.data);
          }
          alert(`Untreated link ${child.data.url}`);
          console.log(child.data);
        }
        if (child.data.post_hint === "hosted:video")
          return { media: "video", local: true };
        if (child.data.post_hint === "rich:video")
          // linked video
          return { media: "video", local: false };
        // Default Reddit post hints
        if (child.data.post_hint) return { media: child.data.post_hint };
        if (!!child.data.gallery_data) {
          // Reddit image gallery
          return { media: "gallery" };
        }
        if (child.data.url.includes("reddit")) {
          // Reddit text post
          return { media: "text" };
        }
        return { media: "website" };
      })(),
      /*
        TODO:

        Separate "video" and "linkedvideo" in to:
      */
      content: (() => {
        if (child.data.gallery_data) {
          // is Reddit gallery of images
          const galleryKeys = child.data.gallery_data.items.map(
            (item) => item.media_id
          );
          return {
            gallery: galleryKeys.map((key) => ({
              images: child.data.media_metadata[key].p.map((img) => ({
                url: img.u,
                width: img.x,
                height: img.y,
              })),
            })),
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
              format: "mp4",
            };
          case "rich:video":
            // console.log(child.data);
            // let url;
            // if (child.data.media.oembed.provider_name === "Gfycat") {
            //   url = child.data.media.oembed.thumbnail_url
            //     .split("-")[0]
            //     .concat("-mobile.mp4");
            // }
            // if (child.data.media.oembed.provider_name === "YouTube") {
            //   url = child.data.media.oembed.html.split("\\")[5];
            // }
            alert("Rich video " + child.data.media.oembed.provider_name);
            console.log(child.data);
            return {
              html: child.data.media.oembed.html,
              width: child.data.media.oembed.thumbnail_width,
              height: child.data.media.oembed.thumbnail_height,
            };
          case "image":
            return {
              // thumbnail: {
              //   url: child.data.thumbnail,
              //   width: child.data.thumbnail_width,
              //   height: child.data.thumbnail_height,
              // },
              width: child.data.thumbnail_width,
              height: child.data.thumbnail_height,
              images: child.data.preview.images[0].resolutions,
              fallback: child.data.url,
            };
          case "link":
            if (child.data.url.includes("v.redd.it")) {
              // Reddit video
              return {
                videourl: child.data.url + "/DASH_720.mp4",
                audiourl: child.data.url + "/DASH_audio.mp4",
                width: child.data.thumbnail_width,
                height: child.data.thumbnail_height,
                format: "mp4",
              };
            }
            if (child.data.url.includes("i.imgur.com")) {
              // Imgur
              if (child.data.url.slice(-4) === "gifv") {
                // Imgur gif
                return {
                  videourl: child.data.url.slice(0, -4) + "webm",
                  width: child.data.thumbnail_width,
                  height: child.data.thumbnail_height,
                  format: "webm",
                };
              }
              alert(`Untreated Imgur type ${child.data.url}`);
              console.log(child.data);
            }
            alert(`Untreated link type ${child.data.url}`);
            console.log(child.data);
            break;
          case "website":
            return {
              url: child.data.url,
            };
          default:
            alert(`Untreated case ${child.data.post_hint}!`);
            console.log(child.data);
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
