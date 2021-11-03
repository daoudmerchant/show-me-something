export const getRedditData = async ({
  subreddit,
  limit,
  timeframe,
  filter,
}) => {
  try {
    const data = await (
      await fetch(
        `https://www.reddit.com/r/${subreddit}/${filter}.json?limit=${
          // TODO: Work out if it's pulling random amounts because
          // of me or because of Reddit
          limit
        }&t=${timeframe}&raw_json=1`
      )
    ).json();
    const parsedData = data.data.children.map((child) => ({
      title: child.data.title,
      text: child.data.selftext,
      subreddit: child.data.subreddit,
      upvotes: child.data.ups,
      downvotes: child.data.downs,
      controversiality: parseInt(child.data.upvote_ratio * 100),
      id: child.data.id,
      NSFW: child.data.over_18,
      spoiler: child.data.spoiler,
      url: `https://www.reddit.com${child.data.permalink.slice(0, -1)}`,
      media: (() => {
        if (child.data.post_hint === "link") {
          // Linked content
          if (child.data.url.includes("v.redd.it")) {
            // Reddit video crosspost
            console.log(child.data);
            return {
              type: "video",
              local: true,
              content: {
                videourl: child.data.url + "/DASH_720.mp4",
                audiourl: child.data.url + "/DASH_audio.mp4",
                width: child.data.thumbnail_width,
                height: child.data.thumbnail_height,
                format: "mp4",
              },
            };
          }
          if (child.data.url.includes("i.imgur.com")) {
            // Imgur
            if (child.data.url.slice(-4) === "gifv") {
              // Gif (video)
              return {
                type: "video",
                local: true,
                content: {
                  videourl: child.data.url.slice(0, -4) + "mp4",
                  width: child.data.thumbnail_width,
                  height: child.data.thumbnail_height,
                  format: "mp4",
                },
              };
            }
            console.log(`Untreated Imgur content ${child.data.url}`);
            console.log(child.data);
          }
          if (child.data.url.includes("wikipedia")) {
            return {
              type: "wikipedia",
              content: {
                url: child.data.url,
              },
            };
          }
          return {
            type: "website",
            content: {
              url: child.data.url,
            },
          };
        }
        if (child.data.post_hint === "hosted:video") {
          console.log(child.data);
          const videoUrl = child.data.media.reddit_video.fallback_url.slice(
            0,
            -16
          );
          return {
            type: "video",
            local: true,
            content: {
              videourl: videoUrl,
              audiourl: videoUrl.split("DASH")[0].concat("DASH_audio.mp4"),
              width: child.data.media.reddit_video.width,
              height: child.data.media.reddit_video.height,
              format: "mp4",
            },
          };
        }
        if (child.data.post_hint === "rich:video") {
          // linked video
          // console.log(child.data);
          return {
            type: "video",
            local: false,
            content: {
              html: child.data.media.oembed.html,
              width: child.data.media.oembed.thumbnail_width,
              height: child.data.media.oembed.thumbnail_height,
            },
          };
        }
        if (child.data.post_hint === "image") {
          return {
            type: "image",
            content: {
              // thumbnail: {
              //   url: child.data.thumbnail,
              //   width: child.data.thumbnail_width,
              //   height: child.data.thumbnail_height,
              // },
              width: child.data.thumbnail_width,
              height: child.data.thumbnail_height,
              images: child.data.preview.images[0].resolutions,
              fallback: child.data.url,
            },
          };
        }
        if (child.data.is_gallery) {
          // Reddit image gallery
          const galleryKeys = child.data.gallery_data.items.map(
            (item) => item.media_id
          );
          return {
            type: "gallery",
            content: {
              gallery: galleryKeys.map((key) => ({
                images: child.data.media_metadata[key].p.map((img) => ({
                  url: img.u,
                  width: img.x,
                  height: img.y,
                })),
              })),
            },
          };
        }
        const textPostData = {
          type: "text",
          content: {
            text: child.data.selftext,
          },
        };
        if (child.data.post_hint === "self") {
          return textPostData;
        }
        if (child.data.post_hint === undefined) {
          if (child.data.url.includes("reddit")) {
            return textPostData;
          }
          if (child.data.url.includes("wikipedia")) {
            return {
              type: "wikipedia",
              content: {
                url: child.data.url,
              },
            };
          }
          return {
            type: "website",
            content: {
              url: child.data.url,
            },
          };
        }
        console.log(`Untreated case ${child.data.post_hint}!`);
        console.log(child.data);
      })(),
    }));
    return parsedData;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getCommentData = async (url) => {
  try {
    const data = await (await fetch(`${url}.json`)).json();
    const comments = data[1].data.children;
    return comments
      .map((comment) => ({
        content: comment.data.body,
        author: comment.data.author,
        isMod: comment.data.distinguished === "moderator",
        isSubmitter: comment.data.is_submitter,
        controversiality: comment.data.controversiality,
        upvotes: comment.data.ups,
        downvotes: comment.data.downs,
      }))
      .filter((comment) => !comment.isMod);
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const checkSubredditExists = async (subreddit) => {
  try {
    const data = await (
      await fetch(`https://www.reddit.com/r/${subreddit}/about.json`)
    ).json();
    return {
      exists: true,
      subreddit: data.data.display_name,
      subtitle: data.data.title,
      icon: data.data.icon_img || data.data.header_img || null,
    };
  } catch (error) {
    console.log(error);
    return {
      exists: false,
    };
  }
};
