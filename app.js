// INITIAL SKILLS
const skills = [
    "Weave",
    "Jump",
    "Check Check",
    "Round",
    "Tunnel",
    "Stay",
    "Recall",
];

// Load saved sessions
let sessions = JSON.parse(localStorage.getItem("agilitySessions")) || [];

// DOM elements
const skillsContainer = document.getElementById("skillsContainer");
const modal = document.getElementById("modal");
const addSessionBtn = document.getElementById("addSessionBtn");
const closeModal = document.getElementById("closeModal");
const sessionForm = document.getElementById("sessionForm");
const skillSelect = document.getElementById("skillSelect");

// Populate dropdown
skills.forEach(s => {
    const opt = document.createElement("option");
    opt.textContent = s;
    skillSelect.appendChild(opt);
});

// Show modal
addSessionBtn.onclick = () => { modal.classList.remove("hidden"); };

// Hide modal
closeModal.onclick = () => { modal.classList.add("hidden"); };

// Generate skill cards
function renderSkills() {
    skillsContainer.innerHTML = "";

    skills.forEach(skill => {
        const card = document.createElement("div");
        card.classList.add("skill-card");

        const title = document.createElement("h2");
        title.textContent = skill;
        card.appendChild(title);

        const filtered = sessions.filter(s => s.skill === skill);

        filtered.forEach(s => {
            const sessionDiv = document.createElement("div");
            sessionDiv.classList.add("session");

            sessionDiv.innerHTML = `
                <small>${s.date}</small>
                <strong>${s.progress}</strong><br>
                ${s.weave ? "Weave distance: " + s.weave + "m<br>" : ""}
                ${s.jump ? "Jump height: " + s.jump + "cm<br>" : ""}
                ${s.notes}
            `;

            card.appendChild(sessionDiv);
        });

        skillsContainer.appendChild(card);
    });
}

renderSkills();

// Handle form submit
sessionForm.addEventListener("submit", e => {
    e.preventDefault();

    const newSession = {
        skill: document.getElementById("skillSelect").value,
        progress: document.getElementById("progressSelect").value,
        weave: document.getElementById("weaveDistance").value,
        jump: document.getElementById("jumpHeight").value,
        notes: document.getElementById("notes").value,
        date: new Date().toLocaleDateString(),
    };

    sessions.push(newSession);
    localStorage.setItem("agilitySessions", JSON.stringify(sessions));

    sessionForm.reset();
    modal.classList.add("hidden");
    renderSkills();
});
