// INITIAL SKILLS
const skills = ["Weave", "Jump", "Check Check", "Round", "Tunnel", "Stay", "Recall"];

// Load saved sessions
let sessions = JSON.parse(localStorage.getItem("agilitySessions")) || [];

// DOM elements
const skillsContainer = document.getElementById("skillsContainer");
const modal = document.getElementById("modal");
const addSessionBtn = document.getElementById("addSessionBtn");
const closeModal = document.getElementById("closeModal");
const sessionForm = document.getElementById("sessionForm");
const skillSelect = document.getElementById("skillSelect");

// --- NEW: dynamic field groups ---
const groupWeave = document.getElementById("group-weave");
const groupJump = document.getElementById("group-jump");
const groupTunnel = document.getElementById("group-tunnel");
const groupRound = document.getElementById("group-round");
const groupCheck = document.getElementById("group-check");

// Populate dropdown
skills.forEach(s => {
    const opt = document.createElement("option");
    opt.textContent = s;
    skillSelect.appendChild(opt);
});

// Show modal
addSessionBtn.onclick = () => modal.classList.remove("hidden");
closeModal.onclick = () => modal.classList.add("hidden");

// NEW: Show relevant fields based on skill
skillSelect.addEventListener("change", () => {
    const val = skillSelect.value;

    // Hide all groups
    document.querySelectorAll(".skill-group").forEach(g => g.style.display = "none");

    if (val === "Weave") groupWeave.style.display = "block";
    if (val === "Jump") groupJump.style.display = "block";
    if (val === "Tunnel") groupTunnel.style.display = "block";
    if (val === "Round") groupRound.style.display = "block";
    if (val === "Check Check") groupCheck.style.display = "block";
});

// Render skill cards
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
            const d = document.createElement("div");
            d.classList.add("session");

            d.innerHTML = `
                <small>${s.date}</small>
                <strong>${s.progress}</strong><br>
                ${s.poles ? "Poles: " + s.poles + "<br>" : ""}
                ${s.entryAngle ? "Entry angle: " + s.entryAngle + "<br>" : ""}
                ${s.jumpHeight ? "Jump height: " + s.jumpHeight + "cm<br>" : ""}
                ${s.jumpType ? "Jump type: " + s.jumpType + "<br>" : ""}
                ${s.tunnelShape ? "Tunnel shape: " + s.tunnelShape + "<br>" : ""}
                ${s.turnDirection ? "Turn: " + s.turnDirection + "<br>" : ""}
                ${s.distance ? "Distance: " + s.distance + "m<br>" : ""}
                ${s.notes}
            `;

            card.appendChild(d);
        });

        skillsContainer.appendChild(card);
    });
}

renderSkills();

// Handle form submit
sessionForm.addEventListener("submit", e => {
    e.preventDefault();

    const skill = skillSelect.value;
    let data = {
        skill,
        progress: document.getElementById("progressSelect").value,
        notes: document.getElementById("notes").value,
        date: new Date().toLocaleDateString(),
    };

    // Add dynamic fields depending on skill
    if (skill === "Weave") {
        data.poles = document.getElementById("weavePoles").value;
        data.entryAngle = document.getElementById("weaveEntryAngle").value;
    }
    if (skill === "Jump") {
        data.jumpHeight = document.getElementById("jumpHeight").value;
        data.jumpType = document.getElementById("jumpType").value;
    }
    if (skill === "Tunnel") {
        data.tunnelShape = document.getElementById("tunnelShape").value;
        data.distance = document.getElementById("tunnelDistance").value;
    }
    if (skill === "Round") {
        data.distance = document.getElementById("roundDistance").value;
        data.turnDirection = document.getElementById("roundDirection").value;
    }
    if (skill === "Check Check") {
        data.turnDirection = document.getElementById("checkDirection").value;
    }

    sessions.push(data);
    localStorage.setItem("agilitySessions", JSON.stringify(sessions));

    sessionForm.reset();
    modal.classList.add("hidden");
    renderSkills();
});
