"use strict";

// Edit this object to personalize the invitation. Give event timestamps a UTC offset.
const WEDDING_CONFIG = {
  couple: [
    {
      name: "Raunaq",
      parents: "Son of Randeep & Raminder Singh Sawhney",
      grandparents: [
        "Late Mrs. Harinder Kaur & Late Mr. Rajinder Singh Sawhney",
        "Mrs. Rajinder Kaur & Late Mr. Mohinder Singh",
      ],
    },
    {
      name: "Mehardeep",
      parents: "Daughter of Gurpreet & Ravinder Pal Singh Anand",
    },
  ],
  welcome: "With the blessings of Waheguru, our families invite you to celebrate the wedding of their beloved children. Nehal warmly invites you to his brother’s Sagan and Engagement Ceremony.",
  heavenlyBlessing: "Late Mrs. Bimla Kaur",
  location: "New Delhi, India",
  timeZone: "Asia/Kolkata",
  ceremonyId: "anand-karaj",
  audioPath: "./assets/instrumental.m4a",
  rsvpEndpoint: "https://formspree.io/f/xaeojzpz",
  photoAlbumUrl: "", // Paste a guest-accessible shared album or upload link here.
  venues: {
    hotel: {
      name: "Radisson Blu",
      area: "Paschim Vihar, New Delhi",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Radisson+Blu+Hotel+New+Delhi+Paschim+Vihar",
      hotelUrl: "https://www.radissonhotels.com/en-us/hotels/radisson-blu-new-delhi-paschim-vihar",
    },
    gurudwara: {
      name: "Gurudwara Singh Sabha",
      area: "Guru Harkrishan Nagar, New Delhi",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Guru+Harkishan+Gurudwara%2C+M3FP%2B27G%2C+Paschim+Vihar%2C+New+Delhi",
    },
  },
  events: [
    { id: "sagan", title: "Sagan Ceremony", startsAt: "2027-01-09T18:30:00+05:30", venue: "hotel", dressCode: "" },
    { id: "ring", title: "Ring Ceremony", startsAt: "2027-01-09T19:30:00+05:30", venue: "hotel", dressCode: "" },
    { id: "dinner", title: "Dinner & Cocktails", startsAt: "2027-01-09T20:00:00+05:30", venue: "hotel", dressCode: "" },
    { id: "anand-karaj", title: "Anand Karaj", startsAt: "2027-01-10T11:30:00+05:30", venue: "gurudwara", dressCode: "" },
    { id: "lunch", title: "Wedding Lunch", startsAt: "2027-01-10T13:00:00+05:30", venue: "hotel", dressCode: "" },
  ],
};

const byId = (id) => document.getElementById(id);
const { couple, timeZone, events, venues } = WEDDING_CONFIG;
const ceremony = events.find((event) => event.id === WEDDING_CONFIG.ceremonyId);
const dateFormat = new Intl.DateTimeFormat("en-IN", {
  timeZone, weekday: "long", day: "numeric", month: "long", year: "numeric",
});
const shortDateFormat = new Intl.DateTimeFormat("en-IN", {
  timeZone, day: "numeric", month: "short",
});
const timeFormat = new Intl.DateTimeFormat("en-IN", {
  timeZone, hour: "numeric", minute: "2-digit", hour12: true,
});
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

function element(tag, content = "", className = "") {
  const node = document.createElement(tag);
  node.textContent = content;
  if (className) node.className = className;
  return node;
}

function externalLink(label, url, map = false) {
  const link = element("a", label, map ? "map-link" : "");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  if (map) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const use = document.createElementNS(svg.namespaceURI, "use");
    svg.setAttribute("aria-hidden", "true");
    use.setAttribute("href", "#icon-map");
    svg.append(use);
    link.prepend(svg);
  }
  return link;
}

function renderCouple() {
  const names = couple.map(({ name }) => name).join(" & ");
  const ceremonyStarts = new Date(ceremony.startsAt);
  const weddingDate = dateFormat.format(ceremonyStarts);
  document.title = names + " | Wedding invitation";
  document.querySelectorAll("[data-couple]").forEach((node) => { node.textContent = names; });
  document.querySelector("[data-monogram]").textContent = couple.map(({ name }) => name[0]).join("·");
  byId("first-name").textContent = couple[0].name;
  byId("second-name").textContent = couple[1].name;
  byId("wedding-location").textContent = WEDDING_CONFIG.location;
  byId("wedding-date").textContent = weddingDate;
  byId("footer-date").textContent = weddingDate + " · " + WEDDING_CONFIG.location;
  const ceremonyLink = byId("ceremony-link");
  ceremonyLink.href = "#" + ceremony.id;
  ceremonyLink.textContent = ceremony.title + " · " + timeFormat.format(ceremonyStarts).toUpperCase();
  if (location.protocol === "https:") {
    const invitationUrl = new URL(location.href);
    invitationUrl.search = "";
    invitationUrl.hash = "";
    const shareUrl = new URL("https://wa.me/");
    shareUrl.searchParams.set("text", names + " | Wedding invitation\n" + weddingDate + "\n" + invitationUrl);
    const shareLink = externalLink("Share on WhatsApp", shareUrl);
    shareLink.className = "share-link";
    byId("invitation-footer").append(shareLink);
  }
  byId("welcome-copy").textContent = WEDDING_CONFIG.welcome;
  byId("heavenly-blessing").textContent = WEDDING_CONFIG.heavenlyBlessing;
  for (const person of couple) {
    const family = element("article", "", "family");
    family.append(element("h3", person.name), element("p", person.parents));
    if (person.grandparents?.length) {
      family.append(element("p", "Grandson of", "family-detail"));
      for (const relative of person.grandparents) {
        family.append(element("p", relative, "family-detail"));
      }
    }
    byId("families").append(family);
  }
}

function renderItinerary() {
  const days = new Map();
  for (const event of [...events].sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))) {
    const starts = new Date(event.startsAt);
    const day = dateFormat.format(starts);
    if (!days.has(day)) days.set(day, []);
    days.get(day).push(event);

    const option = element("label");
    const checkbox = element("input");
    checkbox.type = "checkbox";
    checkbox.name = "events";
    checkbox.value = event.title;
    checkbox.setAttribute("aria-describedby", "event-error");
    option.append(checkbox, document.createTextNode(event.title));
    byId("rsvp-events").append(option);
  }

  const observer = !reducedMotion.matches && "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-pending");
            observer.unobserve(entry.target);
          }
        }
      }, { threshold: .12 })
    : null;

  for (const [day, dayEvents] of days) {
    const group = element("section");
    const cards = element("div", "", dayEvents.length >= 3 ? "day-cards day-cards--three" : "day-cards");
    group.append(element("h3", day, "day-heading"), cards);
    byId("itinerary").append(group);
    dayEvents.forEach((event, index) => {
      const venue = venues[event.venue];
      const card = element("article", "", "event-card");
      const heading = element("h4", event.title);
      if (event.id === ceremony.id) {
        card.id = ceremony.id;
        card.tabIndex = -1;
        card.classList.add("event-card--ceremony");
        heading.id = "ceremony-card-title";
        card.setAttribute("aria-labelledby", "ceremony-card-title");
      }
      const starts = new Date(event.startsAt);
      const time = element("time", shortDateFormat.format(starts) + " · " + timeFormat.format(starts).toUpperCase());
      time.dateTime = event.startsAt;
      const location = element("p", venue.name, "event-venue");
      location.append(element("span", venue.area));
      const map = externalLink("View map", venue.mapUrl, true);
      map.setAttribute("aria-label", "View map for " + event.title + " at " + venue.name + " (opens in a new tab)");
      card.append(time, heading, location,
        element("p", event.dressCode ? "Dress code · " + event.dressCode : "Dress code not specified", "badge"), map);
      cards.append(card);
      if (observer) {
        card.classList.add("reveal", "reveal-pending");
        card.style.setProperty("--reveal-delay", Math.min(index, 3) * 80 + "ms");
        observer.observe(card);
      }
    });
  }
}

function renderTravel() {
  const { hotel, gurudwara } = venues;
  const cards = [
    ["Where to stay", hotel.name + " in " + hotel.area + " hosts the Saturday celebrations and Sunday lunch.", "Visit the hotel website", hotel.hotelUrl],
    ["Ceremony directions", gurudwara.name + " is in " + gurudwara.area + ".", "Open ceremony map", gurudwara.mapUrl],
    ["Share your photos", "Add your favourite photos from the celebrations to our shared album.", "Open the shared album", WEDDING_CONFIG.photoAlbumUrl],
  ];
  for (const [title, copy, label, url] of cards) {
    const card = element("article", "", "travel-card");
    card.append(element("h3", title), element("p", copy));
    card.append(url ? externalLink(label, url) : element("span", "Album link coming soon", "album-status"));
    byId("travel-cards").append(card);
  }
}

function startCountdown() {
  const target = Date.parse(ceremony.startsAt);
  const readings = Array.from(document.querySelectorAll("#countdown dd"));
  let timer;

  function update() {
    const remaining = Math.max(0, Math.ceil((target - Date.now()) / 1000));
    const values = [
      Math.floor(remaining / 86400),
      Math.floor(remaining / 3600) % 24,
      Math.floor(remaining / 60) % 60,
      remaining % 60,
    ];
    readings.forEach((reading, index) => {
      const value = String(values[index]).padStart(2, "0");
      if (reading.textContent !== value) reading.textContent = value;
    });
    if (!remaining) {
      byId("countdown-complete").hidden = false;
      clearInterval(timer);
    }
  }

  timer = setInterval(update, 1000);
  update();
}

function setUpEnvelope() {
  const intro = byId("intro");
  const invitation = byId("invitation");
  const seal = byId("seal");
  const music = byId("music");
  const sound = byId("sound-toggle");
  const hasMusic = Boolean(WEDDING_CONFIG.audioPath);

  if (hasMusic) music.src = WEDDING_CONFIG.audioPath;

  function updateSound() {
    const playing = !music.paused && !music.error;
    sound.classList.toggle("is-playing", playing);
    sound.setAttribute("aria-label", playing ? "Pause music" : "Play music");
    byId("sound-label").textContent = playing ? "Sound on" : "Sound off";
  }

  function playMusic() {
    music.play().then(updateSound).catch(updateSound);
  }

  for (const event of ["playing", "pause", "error"]) music.addEventListener(event, updateSound);
  sound.addEventListener("click", () => {
    if (music.paused) playMusic();
    else music.pause();
  });

  seal.addEventListener("click", () => {
    if (hasMusic) playMusic();
    seal.disabled = true;
    intro.classList.add("is-opening");
    const showInvitation = () => {
      invitation.hidden = false;
      intro.classList.add("is-leaving");
      const finish = () => {
        intro.hidden = true;
        invitation.inert = false;
        document.body.classList.remove("intro-open");
        sound.hidden = !hasMusic;
        const section = document.getElementById(location.hash.slice(1));
        if (section && invitation.contains(section)) {
          section.tabIndex = -1;
          section.focus({ preventScroll: true });
          section.scrollIntoView({ behavior: "instant" });
        } else {
          byId("couple-heading").focus({ preventScroll: true });
        }
      };
      if (reducedMotion.matches) finish();
      else setTimeout(finish, 490);
    };
    if (reducedMotion.matches) showInvitation();
    else setTimeout(showInvitation, 970);
  }, { once: true });

  document.body.classList.add("intro-open");
  invitation.inert = true;
  intro.hidden = false;
}

function setUpRsvp() {
  const form = byId("rsvp-form");
  const details = byId("attendance-details");
  const eventOptions = byId("rsvp-events");
  const eventError = byId("event-error");
  const formError = byId("rsvp-error");
  const confirmation = byId("rsvp-confirmation");
  const submit = form.querySelector("button[type=submit]");
  const guestName = form.elements.namedItem("name");
  const contact = form.elements.namedItem("contact");
  const attendance = form.elements.namedItem("attendance");
  const endpoint = WEDDING_CONFIG.rsvpEndpoint.trim();
  const submitLabel = endpoint ? "Send RSVP" : "Preview RSVP";

  byId("rsvp-preview").hidden = Boolean(endpoint);
  if (endpoint) form.action = endpoint;
  submit.textContent = submitLabel;

  function updateAttendance() {
    const attending = attendance.value === "Attending";
    details.hidden = !attending;
    details.disabled = !attending;
    eventError.hidden = true;
  }

  function validateContact() {
    const value = contact.value.trim();
    const digits = value.replace(/\D/g, "");
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const phone = /^\+?[\d\s().-]+$/.test(value) && digits.length >= 7 && digits.length <= 15;
    contact.setCustomValidity(email || phone ? "" : "Enter a valid phone number or email address.");
  }

  guestName.addEventListener("input", () => guestName.setCustomValidity(""));
  contact.addEventListener("input", validateContact);
  eventOptions.addEventListener("change", () => { eventError.hidden = true; });
  form.querySelectorAll('[name="attendance"]').forEach((radio) => radio.addEventListener("change", updateAttendance));
  updateAttendance();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    formError.hidden = true;
    guestName.setCustomValidity(guestName.value.trim() ? "" : "Enter your name.");
    validateContact();
    if (!form.reportValidity()) return;
    const attending = attendance.value === "Attending";
    if (attending && !eventOptions.querySelector(":checked")) {
      eventError.hidden = false;
      eventOptions.querySelector("input").focus();
      return;
    }

    if (endpoint) {
      const data = new FormData(form);
      data.set("name", guestName.value.trim());
      data.set("contact", contact.value.trim());
      if (attending) data.set("events", data.getAll("events").join(", "));
      submit.disabled = true;
      submit.textContent = "Sending…";
      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) {
          throw new Error(response.status === 429
            ? "RSVP submissions are temporarily limited. Please try again later."
            : "Your response could not be sent. Please try again.");
        }
      } catch (error) {
        formError.textContent = error instanceof TypeError
          ? "We couldn’t reach the RSVP service. Please check your connection and try again."
          : error.message;
        formError.hidden = false;
        return;
      } finally {
        submit.disabled = false;
        submit.textContent = submitLabel;
      }
    }

    byId("confirmation-title").textContent = endpoint ? "Thank you for replying!" : "RSVP preview complete!";
    byId("confirmation-text").textContent = endpoint
      ? (attending ? "We look forward to celebrating with you." : "Thank you for letting us know.")
      : "The form is ready to try. Your response was not sent.";
    form.hidden = true;
    confirmation.hidden = false;
    confirmation.focus();
  });

  byId("rsvp-again").addEventListener("click", () => {
    form.reset();
    updateAttendance();
    confirmation.hidden = true;
    form.hidden = false;
    guestName.focus();
  });
}

renderCouple();
renderItinerary();
renderTravel();
startCountdown();
setUpRsvp();
setUpEnvelope();
