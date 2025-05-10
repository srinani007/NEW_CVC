// events.js

const API_EVENTS = "http://localhost:8080/api/events";
const API_TEAMS = "http://localhost:8080/api/teams";

// Load everything on page load
document.addEventListener("DOMContentLoaded", () => {
  loadTeams();
  loadEvents();
});

// Load teams into both dropdowns
async function loadTeams() {
  try {
    const response = await fetch(API_TEAMS);
    const teams = await response.json();

    const team1Select = document.getElementById("team1Select");
    const team2Select = document.getElementById("team2Select");

    teams.forEach((team) => {
      const option1 = document.createElement("option");
      option1.value = team.id;
      option1.textContent = team.name;
      team1Select.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = team.id;
      option2.textContent = team.name;
      team2Select.appendChild(option2);
    });
  } catch (error) {
    console.error("Error loading teams:", error);
  }
}

// Load events from backend
async function loadEvents() {
  try {
    const response = await fetch(API_EVENTS);
    const events = await response.json();
    renderEvents(events);
  } catch (error) {
    console.error("Error loading events:", error);
  }
}

// Render event cards
function renderEvents(events) {
  const container = document.getElementById("event-list");
  container.innerHTML = "";

  events.forEach((event) => {
    const card = document.createElement("div");
    card.className = "bg-white shadow-md rounded p-4 border hover:shadow-lg transition";

    card.innerHTML = `
      <h3 class="text-lg font-semibold text-yellow-700">${event.title}</h3>
      <p class="text-sm"><strong>Type:</strong> ${event.type}</p>
      <p class="text-sm"><strong>Location:</strong> ${event.location}</p>
      <p class="text-sm"><strong>Date & Time:</strong> ${new Date(event.eventDateTime).toLocaleString()}</p>
      <p class="text-sm"><strong>Team 1:</strong> ${event.team1?.name || 'N/A'}</p>
      <p class="text-sm"><strong>Team 2:</strong> ${event.team2?.name || 'N/A'}</p>
      ${event.result ? `<p class="text-sm"><strong>Result:</strong> ${event.result}</p>` : ""}
    `;

    container.appendChild(card);
  });
}

// Submit event form
async function submitEvent(event) {
  event.preventDefault();

  const title = document.getElementById("eventTitle").value;
  const location = document.getElementById("eventLocation").value;
  const eventDateTime = document.getElementById("eventDateTime").value;
  const team1Id = document.getElementById("team1Select").value;
  const team2Id = document.getElementById("team2Select").value;
  const type = document.getElementById("eventType").value;
  const result = document.getElementById("eventResult").value;

  if (team1Id === team2Id) {
    alert("Team 1 and Team 2 cannot be the same!");
    return;
  }

  const eventObj = {
    title,
    location,
    eventDateTime,
    type,
    result,
    team1: { id: team1Id },
    team2: { id: team2Id },
  };

  try {
    const response = await fetch(API_EVENTS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventObj),
    });

    if (response.ok) {
      loadEvents(); // refresh list
      document.querySelector("form").reset(); // clear form
    } else {
      console.error("Failed to save event:", response.statusText);
    }
  } catch (error) {
    console.error("Error saving event:", error);
  }
}
