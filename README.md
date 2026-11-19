# Raunaq & Mehardeep’s wedding invitation

Open `index.html` in a browser, or run `python3 -m http.server 8000` in this folder and visit [localhost:8000](http://localhost:8000). The site uses plain HTML, CSS, and JavaScript. There is no install or build step.

## Personalize

- Edit `WEDDING_CONFIG` at the top of `script.js`. Keep an explicit UTC offset in each event timestamp. Venue maps, itinerary and RSVP choices use the same event and venue data.
- Set `rsvpEndpoint` to the Formspree form URL. While it is empty, the form validates and shows a preview confirmation without sending data. Verify that a test RSVP arrives in your Formspree dashboard after publishing. The Formspree Free plan currently includes 50 submissions per month.
- Set `photoAlbumUrl` to a Google Photos shared album with collaboration enabled, or a Dropbox file request. Check the link as a guest.
- Edit the palette in `:root` at the top of `styles.css`. The local artwork is adapted from the supplied wedding invitation. The short instrumental is placeholder audio. Replace it by changing `audioPath`.
- The invitation does not specify dress codes. Set `dressCode` on each event once you have confirmed it.

## Deploy on a free static host

- [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) — Push the site files to a public repository and choose the branch root under **Settings → Pages → Deploy from a branch**.
- [Netlify Drop](https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/) — Drag in the folder containing `index.html`, `styles.css`, `script.js`, and `assets/`.
- [Cloudflare Pages](https://developers.cloudflare.com/pages/get-started/direct-upload/) — Create a Pages Direct Upload project and upload the same folder.

The footer shows a WhatsApp share link on the hosted HTTPS site. It opens WhatsApp with the invitation link ready to share.

The hosted invitation is public. Review the names, schedule, map destinations, and sharing permissions before publishing.
