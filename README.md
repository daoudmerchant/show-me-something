# ShowMeSomething

[comment]: <> (TODO: add live demo)

Reddit content viewer using the Reddit API, customisable using Google Firebase with OAuth and user account management (inc. form validation).

Written in React (hook-based) with React Router Dom and styled with Sass for desktop and mobile.

## Functionality

[X] View video (hosted and embedded), images, image galleries and text posts
[X] View top comments
[X] Pull 'buttons' from Google Firebase
[X] Create user accounts via Google Sign-In
[X] Create and modify user 'buttons'

- [x] Manage Firebase data
- [x] Form validation checks on edit

[X] Error handling for contacting Reddit and loading content
[X] Adaptive for mobile and desktop users

## Possible future improvement

[ ] Reorder user buttons
[ ] Restructure database in to sub-collections and sub-documents
[ ] Error handling for contacting database
[ ] Alternative sign-in methods
[ ] Improved UI / assets
[ ] Refactor in Typescript

### Concept

The concept of this project was to create something which 'served' Reddit to non-Reddit users in a way which trimmed all unnecessary information, made accessing content instant, encouraged content consumption over '[doomscrolling](https://en.wikipedia.org/wiki/Doomscrolling)' and used a database with user accounts to manage how the experience both looks and behaves (with an emphasis on customisability). Specifically, I wanted to get my hands dirty with the Reddit API (for which there is very little endpoint documentation), working with `fetch` and digging through the JSON myself rather than defaulting to a [library](https://github.com/not-an-aardvark/snoowrap) to do it for me, as well as managing a Firebase database.

### Challenges

- Exploring Reddit API endpoint for post data
- Avoiding excessive calls to Reddit API / excessive reads/writes to database
- Creating the most reusable component structure
- First project to use Sass (inc. functions) - previously used styled components
- Balancing use of `props` and `useContext` logically
- Creating a 'feel' which translates across mobile and desktop
- User-friendly error-handling
- First time creating an app of this size and scope :)

I really enjoyed making this project, and hope you enjoy using it!
