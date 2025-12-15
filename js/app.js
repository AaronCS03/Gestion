const LS_KEY = "tasky_tasks_v1";

const el = (id) => document.getElementById(id);

const modalBackdrop = el("modalBackdrop");
const taskForm = el("taskForm");

const addTaskBtn = el("addTaskBtn");
const closeModalBtn = el("closeModalBtn");
const cancelBtn = el("cancelBtn");
const deleteBtn = el("deleteBtn");

const searchInput = el("searchInput");
const filterSelect = el("filterSelect");
const sortSelect = el("sortSelect");

const colProgress = el("colProgress");
const colCompleted = el("colCompleted");
const colOverdue = el("colOverdue");

const countProgress = el("countProgress");
const countCompleted = el("countCompleted");
const countOverdue = el("countOverdue");

let tasks = loadTasks();
let editingId = null;

function loadTasks(){
  try{
    return JSON.parse(localStorage.getItem(LS_KEY)) || seed();
  }catch{
    return seed();
  }
}

function saveTasks(){
  localStorage.setItem(LS_KEY, JSON.stringify(tasks));
}

function seed(){

  const today = new Date();
  const iso = (d) => d.toISOString().slice(0,10);
  const plusDays = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return iso(d);
  };

  return [
    {
      id: Date.now(),
      dueDate: plusDays(1),
      time: "18:00",
      subject: "UX Design",
      category: "UX Design",
      priority: "Alta",
      status: "In Progress",
      title: "User Flow",
      description: "Designing a dashboard involves creating a visual interface that helps users complete tasks fast. Define the flow, edge cases, and handoff notes.",
      progress: 3,
      members: ["A","J","Y"]
    },
    {
      id: Date.now()+1,
      dueDate: plusDays(-2),
      time: "09:00",
      subject: "Development",
      category: "Development",
      priority: "Media",
      status: "Over-Due",
      title: "Website Design",
      description: "Designing a Website involves defining layout sections, typography scale, responsive grid, and interactive components aligned to brand rules.",
      progress: 4,
      members: ["A","J"]
    },
    {
      id: Date.now()+2,
      dueDate: plusDays(0),
      time: "18:00",
      subject: "UX Design",
      category: "UX Design",
      priority: "Baja",
      status: "Completed Task",
      title: "User Flow",
      description: "Final pass: reviewed the flow, confirmed states, and ensured consistent spacing across cards and columns.",
      progress: 10,
      members: ["Y","J"]
    },
  ];
}


function prioClass(p){
  if(p === "Alta") return "prio-high";
  if(p === "Media") return "prio-med";
  return "prio-low";
}

function prioLabel(p){
  if(p === "Alta") return "High";
  if(p === "Media") return "Medium";
  return "Low";
}

function shortDate(iso){

  const d = new Date(iso + "T00:00:00");
  const dd = String(d.getDate()).padStart(2,"0");
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

function ensureMembers(t){
  if(!Array.isArray(t.members) || t.members.length===0){
    t.members = ["A","J"];
  }
  return t;
}

function openModal(modeTitle){
  el("modalTitle").textContent = modeTitle;
  modalBackdrop.style.display = "flex";
}

function closeModal(){
  modalBackdrop.style.display = "none";
}

window.closeModal = closeModal; 

function resetForm(){
  taskForm.reset();
  el("taskId").value = "";
  editingId = null;
  deleteBtn.style.display = "none";
  el("saveBtn").textContent = "Save";
  el("modalTitle").textContent = "Add task";
}


function getViewTasks(){
  const q = searchInput.value.trim().toLowerCase();
  const prioFilter = filterSelect.value;

  let arr = [...tasks];


  if(q){
    arr = arr.filter(t =>
      (t.title||"").toLowerCase().includes(q) ||
      (t.description||"").toLowerCase().includes(q) ||
      (t.subject||"").toLowerCase().includes(q) ||
      (t.category||"").toLowerCase().includes(q)
    );
  }


  if(prioFilter){
    arr = arr.filter(t => t.priority === prioFilter);
  }


  const sort = sortSelect.value;
  const prioScore = (p) => (p==="Alta"?3 : p==="Media"?2 : 1);

  arr.sort((a,b)=>{
    if(sort==="dateAsc") return (a.dueDate||"").localeCompare(b.dueDate||"");
    if(sort==="dateDesc") return (b.dueDate||"").localeCompare(a.dueDate||"");
    if(sort==="prioDesc") return prioScore(b.priority) - prioScore(a.priority);
    if(sort==="prioAsc") return prioScore(a.priority) - prioScore(b.priority);
    return 0;
  });

  return arr;
}

function render(){
  colProgress.innerHTML = "";
  colCompleted.innerHTML = "";
  colOverdue.innerHTML = "";

  const view = getViewTasks();

  const byStatus = {
    "In Progress": [],
    "Completed Task": [],
    "Over-Due": []
  };

  for(const t of view){
    if(!byStatus[t.status]) byStatus[t.status] = [];
    byStatus[t.status].push(ensureMembers(t));
  }

  countProgress.textContent = byStatus["In Progress"].length;
  countCompleted.textContent = byStatus["Completed Task"].length;
  countOverdue.textContent = byStatus["Over-Due"].length;

  const mount = (col, list) => {
    if(list.length === 0){
      const empty = document.createElement("div");
      empty.className = "card";
      empty.style.opacity = "0.75";
      empty.innerHTML = `<div class="card-title">No tasks</div>
                         <p class="card-desc">Add a new task to see it here.</p>`;
      col.appendChild(empty);
      return;
    }
    list.forEach(t => col.appendChild(cardNode(t)));
  };

  mount(colProgress, byStatus["In Progress"]);
  mount(colCompleted, byStatus["Completed Task"]);
  mount(colOverdue, byStatus["Over-Due"]);

  saveTasks();
}

function cardNode(t){
  const card = document.createElement("div");
  card.className = "card";

  const timeChip = t.time ? `<span class="chip">🕒 ${formatTime(t.time)}</span>` : "";
  const dateChip = t.dueDate ? `<span class="chip">📅 ${shortDate(t.dueDate)}</span>` : "";
  const tagChip  = t.category ? `<span class="chip tag">${escapeHtml(t.category)}</span>` : "";

  card.innerHTML = `
    <div class="card-top">
      <div class="chips">
        <span class="chip ${prioClass(t.priority)}">${prioLabel(t.priority)}</span>
        ${t.status === "Over-Due" ? dateChip : timeChip}
        ${tagChip}
      </div>
      <button class="kebab" type="button" title="menu">⋮</button>
    </div>

    <div class="card-title">${escapeHtml(t.title || "")}</div>
    <p class="card-desc">${escapeHtml(t.description || "")}</p>

    <div class="progress">☰ ${Number(t.progress || 0)}/10</div>

    <div class="card-foot">
      <div class="mini-avatars">
        ${ensureMembers(t).members.slice(0,3).map(m=>`<div class="avatar" title="Member">${escapeHtml(m)}</div>`).join("")}
        ${t.members.length > 3 ? `<div class="avatar more">+${t.members.length-3}</div>` : ""}
      </div>

      <div class="card-actions">
        <button class="iconbtn" type="button" data-action="view" data-id="${t.id}" title="View">👁️</button>
        <button class="iconbtn" type="button" data-action="edit" data-id="${t.id}" title="Edit">✏️</button>
        <button class="iconbtn danger" type="button" data-action="delete" data-id="${t.id}" title="Delete">🗑️</button>
      </div>
    </div>
  `;

  return card;
}


/* ---------- CRUD ---------- */
function viewTask(id){
  const t = tasks.find(x => x.id === id);
  if(!t) return;

  fillForm(t);
  lockForm(true);
  deleteBtn.style.display = "none";
  el("saveBtn").style.display = "none";
  el("modalTitle").textContent = "Task details";
  openModal("Task details");
}

function editTask(id){
  const t = tasks.find(x => x.id === id);
  if(!t) return;

  fillForm(t);
  lockForm(false);
  editingId = id;
  deleteBtn.style.display = "inline-flex";
  el("saveBtn").style.display = "inline-flex";
  el("saveBtn").textContent = "Update";
  el("modalTitle").textContent = "Edit task";
  openModal("Edit task");
}

function deleteTask(id){
  const t = tasks.find(x => x.id === id);
  if(!t) return;

  if(confirm("¿Eliminar esta tarea?")){
    tasks = tasks.filter(x => x.id !== id);
    render();
  }
}

function addTask(){
  resetForm();
  lockForm(false);
  el("saveBtn").style.display = "inline-flex";
  openModal("Add task");
}

function fillForm(t){
  el("taskId").value = t.id;
  el("dueDate").value = t.dueDate || "";
  el("time").value = t.time || "";
  el("subject").value = t.subject || "";
  el("category").value = t.category || "";
  el("priority").value = t.priority || "Media";
  el("status").value = t.status || "In Progress";
  el("progress").value = Number(t.progress || 0);
  el("title").value = t.title || "";
  el("description").value = t.description || "";
}

function lockForm(locked){
  const fields = ["dueDate","time","subject","category","priority","status","progress","title","description"];
  fields.forEach(id => el(id).disabled = locked);
}

function formatTime(hhmm){

  const [h,m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = ((h + 11) % 12) + 1;
  return `${hr}:${String(m).padStart(2,"0")} ${ampm}`;
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}


addTaskBtn.addEventListener("click", addTask);
closeModalBtn.addEventListener("click", () => { closeModal(); resetForm(); el("saveBtn").style.display="inline-flex"; });
cancelBtn.addEventListener("click", () => { closeModal(); resetForm(); el("saveBtn").style.display="inline-flex"; });

modalBackdrop.addEventListener("click", (e) => {
  if(e.target === modalBackdrop){
    closeModal();
    resetForm();
    el("saveBtn").style.display="inline-flex";
  }
});

deleteBtn.addEventListener("click", () => {
  if(!editingId) return;
  deleteTask(editingId);
  closeModal();
  resetForm();
  el("saveBtn").style.display="inline-flex";
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const payload = {
    id: editingId ?? Date.now(),
    dueDate: el("dueDate").value,
    time: el("time").value,
    subject: el("subject").value.trim(),
    category: el("category").value.trim(),
    priority: el("priority").value,
    status: el("status").value,
    progress: Number(el("progress").value || 0),
    title: el("title").value.trim(),
    description: el("description").value.trim(),
    members: ["A","J","Y"] 
  };

  if(editingId){
    tasks = tasks.map(t => t.id === editingId ? payload : t);
  } else {
    tasks.unshift(payload);
  }

  render();
  closeModal();
  resetForm();
  el("saveBtn").style.display="inline-flex";
});

searchInput.addEventListener("input", render);
filterSelect.addEventListener("change", render);
sortSelect.addEventListener("change", render);

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if(!btn) return;

  const action = btn.dataset.action;
  const id = Number(btn.dataset.id);

  if(action === "view") viewTask(id);
  if(action === "edit") editTask(id);
  if(action === "delete") deleteTask(id);
});



render();
