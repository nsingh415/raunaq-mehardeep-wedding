# Raunaq & Mehardeep’s wedding invitation

Open `index.html` in a browser, or run `python3 -m http.server 8000` in this folder and visit [localhost:8000](http://localhost:8000). The site uses plain HTML, CSS, and JavaScript. There is no install or build step.

## Guest links

- **January 10 only.** Send the site's regular link, such as `https://YOUR-USERNAME.github.io/raunaq-mehardeep-wedding/`. Guests see Anand Karaj and Wedding Lunch.
- **January 9–10.** Append `?invite=full` to the site link. Guests also see Sagan Ceremony, Ring Ceremony, and Dinner.

WhatsApp sharing follows the version opened. Both links are public. Anyone with the full link can open it.

## Personalize

- Edit `WEDDING_CONFIG` at the top of `script.js`. Keep an explicit UTC offset in each event timestamp. The printed schedule and its map links use the same event and venue data.
- Edit the palette in `:root` at the top of `styles.css`. The local artwork is adapted from the supplied wedding invitation. The short instrumental is placeholder audio. Replace it by changing `audioPath`.

## Deploy on a free static host

- [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) — Push the site files to a public repository and choose the branch root under **Settings → Pages → Deploy from a branch**.
- [Netlify Drop](https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/) — Drag in the folder containing `index.html`, `styles.css`, `script.js`, and `assets/`.
- [Cloudflare Pages](https://developers.cloudflare.com/pages/get-started/direct-upload/) — Create a Pages Direct Upload project and upload the same folder.

The footer shows a WhatsApp share link on the hosted HTTPS site. It opens WhatsApp with the invitation link ready to share.

When publishing a change that updates the HTML and its CSS or JavaScript together, increment the asset version in `index.html` so browsers fetch the matching files.

The hosted invitation is public. Review the names, schedule, map destinations, and sharing permissions before publishing.
