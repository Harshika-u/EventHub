const events = [
  {
    name: "Dance Competition",
    image: "https://via.placeholder.com/300"
  },
  {
    name: "Music Fest",
    image: "https://via.placeholder.com/300"
  }
];

const container = document.getElementById("events-container");

if (container) {
  events.forEach(event => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${event.image}">
      <h3>${event.name}</h3>
    `;

    container.appendChild(card);
  });
}