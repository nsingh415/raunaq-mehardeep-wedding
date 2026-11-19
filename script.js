"use strict";

// Edit this object to personalize the invitation. Give event timestamps a UTC offset.
const WEDDING_CONFIG = {
  couple: [
    {
      name: "Raunaq",
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
  weddingHosts: "Randeep & Raminder",
  engagementHost: "Nehal",
  fullInviteCode: "6386cda9d96a9614894e4b7c",
  heavenlyBlessing: "Late Mrs. Bimla Kaur",
  celebratingFamily: [
    "Harshit & Jagdeep Singh", "Minnie & Sukhdeep Singh",
    "Ranbir & Gurmeet Singh", "Monica & Rajpal Singh",
    "Narinder Kaur", "Dimpy & Manpreet Singh",
  ],
  sharingTheJoy: "Nehal, Amarvir, Amandeep, Mannat, Arshdeep, Nikki, Tajevir, Tejeshwar, Simarjot & Adhiraj",
  location: "New Delhi, India",
  timeZone: "Asia/Kolkata",
  ceremonyId: "anand-karaj",
  audioPath: "./assets/santa-ke-karaj-aap-khaloa.mp3",
  venues: {
    hotel: {
      name: "Radisson Blu",
      area: "Paschim Vihar, New Delhi",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Radisson+Blu+Hotel+New+Delhi+Paschim+Vihar",
    },
    gurudwara: {
      name: "Gurudwara Singh Sabha",
      area: "Guru Harkrishan Nagar, New Delhi",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Guru+Harkishan+Gurudwara%2C+M3FP%2B27G%2C+Paschim+Vihar%2C+New+Delhi",
    },
  },
  events: [
    { id: "anand-karaj", title: "Anand Karaj", startsAt: "2027-01-10T11:30:00+05:30", venue: "gurudwara" },
    { id: "lunch", title: "Wedding Lunch", startsAt: "2027-01-10T13:00:00+05:30", venue: "hotel" },
  ],
  fullInviteEvents: [
    { id: "sagan", title: "Sagan Ceremony", startsAt: "2027-01-09T18:30:00+05:30", venue: "hotel" },
    { id: "ring", title: "Ring Ceremony", startsAt: "2027-01-09T19:30:00+05:30", venue: "hotel" },
    { id: "dinner", title: "Dinner", startsAt: "2027-01-09T20:00:00+05:30", venue: "hotel" },
  ],
};

const byId = (id) => document.getElementById(id);
const { couple, timeZone, venues, events } = WEDDING_CONFIG;
const fullInvite = new URLSearchParams(location.search).get("invite") === WEDDING_CONFIG.fullInviteCode;
const ceremony = events.find((event) => event.id === WEDDING_CONFIG.ceremonyId);
const dateFormat = new Intl.DateTimeFormat("en-IN", {
  timeZone, weekday: "long", day: "numeric", month: "long", year: "numeric",
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
  const weddingDate = dateFormat.format(new Date(ceremony.startsAt));
  document.title = names + " | Wedding invitation";
  document.querySelectorAll("[data-couple]").forEach((node) => { node.textContent = names; });
  document.querySelector("[data-monogram]").textContent = couple.map(({ name }) => name[0]).join("·");
  document.querySelectorAll("[data-person]").forEach((node) => {
    node.textContent = couple[node.dataset.person].name;
  });
  byId("wedding-date").textContent = weddingDate;
  byId("footer-date").textContent = weddingDate + " · " + WEDDING_CONFIG.location;
  if (location.protocol === "https:") {
    const invitationUrl = new URL(location.href);
    invitationUrl.search = "";
    invitationUrl.hash = "";
    if (fullInvite) invitationUrl.searchParams.set("invite", WEDDING_CONFIG.fullInviteCode);
    const shareUrl = new URL("https://wa.me/");
    shareUrl.searchParams.set("text", names + " | Wedding invitation\n" + weddingDate + "\n" + invitationUrl);
    const shareLink = externalLink("Share on WhatsApp", shareUrl);
    shareLink.className = "share-link";
    byId("invitation-footer").append(shareLink);
  }
  byId("wedding-hosts").textContent = WEDDING_CONFIG.weddingHosts;
  byId("heavenly-blessing").textContent = WEDDING_CONFIG.heavenlyBlessing;
  for (const name of WEDDING_CONFIG.celebratingFamily) {
    byId("family-names").append(element("li", name));
  }
  byId("sharing-the-joy").textContent = WEDDING_CONFIG.sharingTheJoy;
  for (const [index, person] of couple.entries()) {
    if (index > 0) byId("families").append(element("p", "with", "family-connector reveal"));
    const family = element("article", "", "family reveal");
    family.append(element("h3", person.name, "script-name"));
    if (person.parents) family.append(element("p", person.parents));
    if (person.grandparents?.length) {
      family.append(element("p", "Grandson of", "family-detail"));
      for (const relative of person.grandparents) {
        family.append(element("p", relative, "family-detail"));
      }
    }
    byId("families").append(family);
  }
}

function appendVenue(container, venue, occasion) {
  const location = element("p", venue.name, "event-venue");
  location.append(element("span", venue.area));
  const map = externalLink("View map", venue.mapUrl, true);
  map.setAttribute("aria-label", "View map for " + occasion + " at " + venue.name + " (opens in a new tab)");
  container.append(location, map);
}

function renderItinerary(container, schedule) {
  const days = new Map();
  for (const event of [...schedule].sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))) {
    const starts = new Date(event.startsAt);
    const day = dateFormat.format(starts);
    if (!days.has(day)) days.set(day, []);
    days.get(day).push(event);
  }

  for (const [day, dayEvents] of days) {
    const group = element("section");
    const firstVenue = dayEvents[0].venue;
    const sharesVenue = dayEvents.length > 1 && dayEvents.every((event) => event.venue === firstVenue);
    const cards = element("div", "", sharesVenue ? "day-cards day-cards--shared" : "day-cards");
    group.append(element("h3", day, "day-heading reveal"), cards);
    if (sharesVenue) {
      const dayVenue = element("div", "", "day-venue reveal");
      appendVenue(dayVenue, venues[firstVenue], day);
      group.append(dayVenue);
    }
    container.append(group);
    for (const event of dayEvents) {
      const card = element("article", "", "event-card reveal");
      const heading = element("h4", event.title);
      if (event.id === ceremony.id) {
        card.id = ceremony.id;
        card.tabIndex = -1;
        card.classList.add("event-card--ceremony");
        heading.id = "ceremony-card-title";
        card.setAttribute("aria-labelledby", "ceremony-card-title");
      }
      const starts = new Date(event.startsAt);
      const time = element("time", timeFormat.format(starts).toLowerCase());
      time.dateTime = event.startsAt;
      const details = element("div", "", "event-heading");
      details.append(heading, time);
      card.append(details);
      if (!sharesVenue) appendVenue(card, venues[event.venue], event.title);
      cards.append(card);
    }
  }
}

function setUpScrollReveals(invitation) {
  if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    for (const { isIntersecting, target } of entries) {
      if (isIntersecting) {
        target.classList.remove("reveal-pending");
        observer.unobserve(target);
      }
    }
  }, { rootMargin: "0px 0px -24px" });

  for (const section of invitation.querySelectorAll(".reveal")) {
    if (section.closest("[hidden]")) continue;
    section.classList.add("reveal-pending");
    observer.observe(section);
  }
}

function setUpWeekendTransition(invitation) {
  if (!fullInvite || reducedMotion.matches) return;

  const wedding = byId("celebrations");
  let frame;
  let lastProgress = -1;
  invitation.classList.add("weekend-transition");

  function update() {
    frame = undefined;
    const viewportHeight = window.innerHeight;
    const distance = Math.min(340, viewportHeight * .5);
    const progress = Math.min(1, Math.max(0, (viewportHeight - wedding.getBoundingClientRect().top) / distance));
    if (progress === lastProgress) return;
    invitation.style.setProperty("--handoff-progress", progress);
    lastProgress = progress;
  }

  function scheduleUpdate() {
    if (frame === undefined) frame = requestAnimationFrame(update);
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  update();
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

  function finishOpening() {
    intro.hidden = true;
    intro.classList.remove("is-opening");
    invitation.inert = false;
    document.body.classList.remove("intro-open");
    sound.hidden = !hasMusic;
    const section = document.getElementById(location.hash.slice(1));
    if (section && invitation.contains(section) && !section.closest("[hidden]")) {
      section.tabIndex = -1;
      section.focus({ preventScroll: true });
      section.scrollIntoView({ behavior: "instant" });
    } else {
      byId("couple-heading").focus({ preventScroll: true });
    }
  }

  seal.addEventListener("click", () => {
    if (hasMusic) playMusic();
    seal.disabled = true;
    setUpScrollReveals(invitation);
    setUpWeekendTransition(invitation);
    if (reducedMotion.matches) {
      finishOpening();
      return;
    }

    intro.classList.add("is-opening");
    const exit = intro.getAnimations?.().find((animation) => animation.animationName === "invitation-exit");
    if (exit) exit.finished.then(finishOpening, finishOpening);
    else finishOpening();
  }, { once: true });

  document.body.classList.add("intro-open");
  invitation.inert = true;
  invitation.hidden = false;
  byId("load-note").hidden = true;
  byId("seal-prompt").hidden = false;
  seal.disabled = false;
}

renderCouple();
if (fullInvite) {
  const engagement = byId("engagement");
  byId("engagement-host").textContent = WEDDING_CONFIG.engagementHost;
  renderItinerary(byId("engagement-itinerary"), WEDDING_CONFIG.fullInviteEvents);
  engagement.hidden = false;
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => {
      engagement.style.setProperty("--engagement-height", engagement.offsetHeight + "px");
    });
    observer.observe(engagement);
  }
  document.querySelector(".skip-link").href = "#engagement";
}
renderItinerary(byId("itinerary"), events);
startCountdown();
setUpEnvelope();
