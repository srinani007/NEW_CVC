// teams.js

const API_URL = "http://localhost:8080/api/teams"; // Backend endpoint

// Load teams on page load
document.addEventListener("DOMContentLoaded", () => {
  loadTeams();
});

// Show/hide form
function showForm() {
  const form = document.getElementById("team-form");
  form.classList.toggle("hidden");
}

// Load teams from backend
async function loadTeams() {
  try {
    const response = await fetch(API_URL);
    const teams = await response.json();
    renderTeams(teams);
  } catch (error) {
    console.error("Error loading teams:", error);
  }
}

// Render team cards
function renderTeams(teams) {
  const container = document.getElementById("team-list");
  container.innerHTML = "";

  teams.forEach((team) => {
    const card = document.createElement("div");
    card.className = "bg-white shadow-md rounded p-4 border hover:shadow-lg transition";

    card.innerHTML = `
      <h3 class="text-lg font-semibold text-blue-700">${team.name}</h3>
      <p class="mt-2 text-sm"><strong>Coach:</strong> ${team.coach}</p>
      <p class="text-sm"><strong>Age Group:</strong> ${team.ageGroup}</p>
    `;

    container.appendChild(card);
  });
}

// Submit new team
async function submitTeam(event) {
  event.preventDefault();

  const name = document.getElementById("teamName").value;
  const coach = document.getElementById("coachName").value;
  const ageGroup = document.getElementById("ageGroup").value;

  const team = { name, coach, ageGroup };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(team),
    });

    if (response.ok) {
      document.getElementById("team-form").classList.add("hidden");
      loadTeams(); // Refresh list
    } else {
      console.error("Failed to save team:", response.statusText);
    }
  } catch (error) {
    console.error("Error saving team:", error);
  }
}
