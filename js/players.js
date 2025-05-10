// players.js

const API_TEAMS = "http://localhost:8080/api/teams";
const API_PLAYERS = "http://localhost:8080/api/players";

// Load all teams into dropdown on page load
document.addEventListener("DOMContentLoaded", () => {
  loadTeamsForDropdown();
});

// Load teams for select dropdown
async function loadTeamsForDropdown() {
  try {
    const response = await fetch(API_TEAMS);
    const teams = await response.json();

    const select = document.getElementById("teamSelect");
    teams.forEach((team) => {
      const option = document.createElement("option");
      option.value = team.id;
      option.textContent = team.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading teams:", error);
  }
}

// Load players for selected team
async function loadPlayersByTeam(teamId) {
  if (!teamId) {
    document.getElementById("player-list").innerHTML = "";
    return;
  }

  try {
    const response = await fetch(`${API_PLAYERS}/team/${teamId}`);
    const players = await response.json();
    renderPlayers(players);
  } catch (error) {
    console.error("Error loading players:", error);
  }
}

// Render players to grid
function renderPlayers(players) {
  const container = document.getElementById("player-list");
  container.innerHTML = "";

  players.forEach((player) => {
    const card = document.createElement("div");
    card.className = "bg-white shadow-md rounded p-4 border hover:shadow-lg transition";

    card.innerHTML = `
      <h3 class="text-lg font-semibold text-purple-700">${player.name}</h3>
      <p class="text-sm"><strong>Age:</strong> ${player.age}</p>
      <p class="text-sm"><strong>Position:</strong> ${player.position}</p>
      <p class="text-sm"><strong>Jersey #:</strong> ${player.jerseyNumber}</p>
    `;

    container.appendChild(card);
  });
}

// Submit new player
async function submitPlayer(event) {
  event.preventDefault();

  const name = document.getElementById("playerName").value;
  const age = parseInt(document.getElementById("playerAge").value);
  const position = document.getElementById("playerPosition").value;
  const jerseyNumber = parseInt(document.getElementById("jerseyNumber").value);
  const teamId = document.getElementById("teamSelect").value;

  if (!teamId) {
    alert("Please select a team before adding a player.");
    return;
  }

  const player = {
    name,
    age,
    position,
    jerseyNumber,
    team: { id: teamId }
  };

  try {
    const response = await fetch(API_PLAYERS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(player),
    });

    if (response.ok) {
      loadPlayersByTeam(teamId); // refresh list
      document.querySelector("form").reset(); // clear form
    } else {
      console.error("Failed to save player:", response.statusText);
    }
  } catch (error) {
    console.error("Error saving player:", error);
  }
}
