// SKILLS
const skills = ["Weave", "Jump", "Check Check", "Round", "Tunnel", "Stay", "Recall"];

// Load data
let sessions = JSON.parse(localStorage.getItem("agilitySessions")) || [];

const skillsContainer = document.getElementById("skillsContainer");
const modal = document.getElementById("modal");
const addSessionBtn = document.getElementById("addSessionBtn");
const closeModal = document.getElementById("closeModal");
const sessionForm = document.getElementById("sessionForm");
const skillSelect = document.getElementById("skillSelect");

// Dynamic groups
const groups = {
    weave: document.getElementById("group-weave"),
    jump: document.getElementById("group-jump"),
    tunnel: document.getElementById("group-tunnel"),
    round: document.getElementById("group-round"),
    check: document.getElementById("group-check"),
};

// Populate drop-down
skills.forEach(s => {
    const opt = document.createElement("option");
    opt.textContent = s;
    skillSelect.appendChild(opt);
});

// Show modal
addSessionBtn.onclick = () => modal.classList.remove("hidden");
// Hide modal
closeModal.onclick = () => modal.classList.add("hidden");

// Dynamic form behaviour
skillSelect.addEventListener("change", () => {
    const val = skillSelect.value;

    document.querySelectorAll(".skill-group").forEach(g => (g.style.display = "none"));

    if (val === "Weave") groups.weave.style.display = "block";
    if (val === "Jump") groups.jump.style.display = "block";
    if (val === "Tunnel") groups.tunnel.style.display = "block";
    if (val === "Round") groups.round.style.display = "block";
    if (val === "Check Check") groups.check.style.display = "block";
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
            const div = document.createElement("div");
            div.classList.add("session");

            div.innerHTML = `
                <small>${s.date}</small><br>
                <strong>${s.progress}</strong><br>
                ${s.poles ? "Poles: " + s.poles + "<br>" : ""}
                ${s.entryAngle ? "Entry Angle: " + s.entryAngle + "<br>" : ""}
                ${s.jumpHeight ? "Jump height: " + s.jumpHeight + "cm<br>" : ""}
                ${s.jumpType ? "Jump type: " + s.jumpType + "<br>" : ""}
                ${s.tunnelShape ? "Tunnel: " + s.tunnelShape + "<br>" : ""}
                ${s.distance ? "Distance: " + s.distance + "m<br>" : ""}
                ${s.turnDirection ? "Direction: " + s.turnDirection + "<br>" : ""}
                ${s.notes ? "<em>" + s.notes + "</em><br>" : ""}
                <button class="deleteSession" data-id="${s.id}">Delete</button>
            `;

            card.appendChild(div);
        });

        skillsContainer.appendChild(card);
    });

    // Delete handlers
    document.querySelectorAll(".deleteSession").forEach(btn => {
        btn.onclick = () => {
            const id = Number(btn.dataset.id);
            sessions = sessions.filter(s => s.id !== id);
            localStorage.setItem("agilitySessions", JSON.stringify(sessions));
            renderSkills();
        };
    });
}

renderSkills();

// Save session
sessionForm.addEventListener("submit", e => {
    e.preventDefault();

    const skill = skillSelect.value;
    const progress = document.getElementById("progressSelect").value;

    const data = {
        id: Date.now(),
        skill,
        progress,
        notes: document.getElementById("notes").value.trim(),
        date: new Date().toLocaleDateString(),
    };

    // Custom fields
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

    // Store
    sessions.push(data);
    localStorage.setItem("agilitySessions", JSON.stringify(sessions));

    sessionForm.reset();
    modal.classList.add("hidden");
    renderSkills();
});

// RESET ALL DATA
document.getElementById("resetBtn").onclick = () => {
    if (confirm("Delete ALL training data?")) {
        sessions = [];
        localStorage.removeItem("agilitySessions");
        renderSkills();
    }
};
