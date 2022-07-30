//Gets the data from json file
loadCourses();
uploadProfiles();
document.cookie = "SameSite = None; Secure;";
// Variable declarations

const profilesEl = document.querySelector(".profiles");
const courseEl = document.querySelector(".course");
const outlineEl = document.querySelector(".outline");
const outlineAreaEl = document.querySelector(".outline-area");
const popupEl = document.querySelector(".popup");
const popupContainerEl = document.querySelector(".popup-container");
const categoriesAreaEl = document.querySelector(".categories-area");
const mainEl = document.querySelector(".main");
const toggleEl = document.querySelector(".toggle");

async function getCourses() {
  const res = await fetch("data.json");
  const response = await res.json();
  return response.courses;
}

// //Show courses on page

function loadCourses() {
  getCourses()
    .then((data) => {
      for (let x in data) {
        const btn = document.createElement("button");
        btn.className = "icon";
        btn.setAttribute("href", "#outline");
        btn.setAttribute("for", x);
        //<i class="${data[x].icon}"></i>
        btn.innerHTML += `<span class="course-title">${x}</span>`;
        courseEl.appendChild(btn);
        btn.addEventListener("click", () => {
          showOutline(btn.getAttribute("for"));
          document.getElementById("outline").style.visibility = "visible";
          document.getElementById("outline").style.marginTop = "4rem";
          document.getElementById("outline").scrollIntoView({
            behavior: "smooth",
          });
        });
      }
    })
    .catch((err) => console.log("Err1: ", err));
}

async function showOutline(course) {
  getCourses()
    .then((data) => {
      outlineAreaEl.style.display = "block";
      const outline = data[course].outline;
      outlineEl.innerHTML = "";
      for (let x in outline) {
        const btn = document.createElement("button");
        btn.setAttribute("for", course);
        btn.innerHTML += `<span class="course-title">${x}</span>`;
        outlineEl.appendChild(btn);
        btn.addEventListener("click", () => {
          const course = btn.getAttribute("for");
          showPopup(x, course);
        });
      }
    })
    .catch((err) => console.log("Err2: ", err));
}
async function showPopup(topic, course) {
  popupContainerEl.style.display = "block";
  categoriesAreaEl.style.display = "none";
  mainEl.style.display = "none";
  popupEl.innerHTML = "";
  getCourses()
    .then((data) => {
      const popupData = data[course].outline[topic];
      popupEl.innerHTML = `<i class="fas fa-times"></i>
                          <h3>${topic}</h3>
                          <hr>
                          <iframe class="video" width="560" height="315" src="${popupData.video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                          <hr>
                          <p class="description">${popupData.description}`;
      if (popupData.pdf.name.length > 0) {
        popupEl.innerHTML += `<h5>Related Materials</h5>`;
        for (let i = 0; i < popupData.pdf.name.length; i++) {
          popupEl.innerHTML += `<div class="pdfs">
                          <a href="${popupData.pdf.link[i]}" target="_blank">
                              <button>
                              <i class="far fa-file-pdf"></i><span>${popupData.pdf.name[i]}</span>
                              </button>
                          </a>`;
        }
      }
    })
    .catch((err) => console.log("Err3: ", err));
}

//Add event listener to cancel tutorial popup

popupContainerEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-times")) {
    popupContainerEl.style.display = "none";
    categoriesAreaEl.style.display = "block";
    mainEl.style.display = "block";
  }
});

//Upload profiles
async function uploadProfiles() {
  const res = await fetch("data.json");
  const response = await res.json();
  const profiles = await response.profiles;
  for (let x in profiles) {
    const div = document.createElement("div");
    div.classList.add("profile");
    div.innerHTML = `<img src="${profiles[x].img}" alt="${profiles[x].name}" />
                      <div class="name">${profiles[x].name}</div>
                      <div class="matric_no">${x}</div>`;
    profilesEl.appendChild(div);
  }
}

toggleEl.addEventListener("click", () => {
  if (toggleEl.textContent == "Show More") {
    toggleEl.innerText = "show less";
    profilesEl.style.height = "1670px";
  } else {
    toggleEl.innerText = "Show More";
    profilesEl.style.height = "33rem";
  }
});
