function handle_gravity_button(){
document.querySelectorAll('.gravityButton').forEach(btn => {
  
    btn.addEventListener('mousemove', (e) => {
      
      const rect = btn.getBoundingClientRect();    
      const h = rect.width / 2;
      
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - h;
  
      const r1 = Math.sqrt(x*x+y*y);
      const r2 = (1 - (r1 / h)) * r1;
  
      const angle = Math.atan2(y, x);
      const tx = Math.round(Math.cos(angle) * r2 * 100) / 100;
      const ty = Math.round(Math.sin(angle) * r2 * 100) / 100;
      
      const op = (r2 / r1) + 0.25;
  
      btn.style.setProperty('--tx', `${tx}px`);
      btn.style.setProperty('--ty', `${ty}px`);
      btn.style.setProperty('--opacity', `${op}`);
    });
  
    btn.addEventListener('mouseleave', (e) => {
      btn.style.setProperty('--tx', '0px');
      btn.style.setProperty('--ty', '0px');
      btn.style.setProperty('--opacity', `${0.25}`);
    });

    btn.addEventListener('click', (e) => {
        const clicked = btn.id;

        if (clicked == "CV") {
        const pdfFilePath = "CV.pdf";
        window.open(pdfFilePath, "_blank");
        };

        if (clicked == "contact") {
          handle_modal_contact();
        };
        if (clicked == "portfolio") {
          handle_modal_portfolio()
        };


    });
  })
};

function handle_aura(){
	const aura = document.getElementById('aura');

	document.addEventListener('mousemove', (e) => {
		// Mettre à jour la position de l'aura selon la position de la souris
		aura.style.left = e.clientX - aura.clientWidth / 2 + 'px';
		aura.style.top = e.clientY - aura.clientHeight / 2 + 'px';

		// Afficher l'aura
		aura.style.display = 'block';
	});

};

function handle_modal_portfolio() {
  const modal = document.getElementById("modalPortfolio");
  const col1 = document.getElementById("column1");
  

  if (modal.classList.contains("visible")) {
    modal.classList.remove("visible");
    col1.style.zIndex = "1";
    
  } else {
    modal.classList.add("visible");
    col1.style.zIndex = "3"; // Définir le z-index de la colonne
    
  }
};

function handle_modal_contact() {
  const modal = document.getElementById("modalContact");
  const col3 = document.getElementById("column3");

  if (modal.classList.contains("visible")) {
    modal.classList.remove("visible");
    col3.style.zIndex = "1";

  } else {
    modal.classList.add("visible");
    col3.style.zIndex = "3";

  };
};



function handle_header(){
  const overlapEls = document.querySelectorAll(".overlap") || [];
  overlapEls.forEach(el => {
    const chars = [...el.textContent];
    el.innerHTML = "";
    chars.forEach((char,index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.setProperty("--index", index)
      el.append(span)
  })
})
}

function fetchGitHubProjects(username) {
  const modalContent = document.getElementById("divModalPortfolio");

  if (!modalContent) {
    console.error("L'élément modalContent n'a pas été trouvé.");
    return;
  }

  const apiUrl = `https://api.github.com/users/${username}/repos`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        modalContent.textContent = "Aucun projet GitHub trouvé.";
        return;
      }

      const projectsList = document.createElement("ul");
      projectsList.className = "github-projects-list";

      data.forEach((project) => {
        if (project.name !== "Tuxiboule") {
          const projectItem = document.createElement("li");
          const projectLink = document.createElement("a");

          const projectContainer = document.createElement("div"); // Container pour le projet
          projectContainer.className = "project-container"; // Appliquer une classe spécifique

          const readmeContent = document.createElement("p");
          readmeContent.className = "readme-content";



          const readmeApiUrl = `https://api.github.com/repos/${username}/${project.name}/readme`;
          fetch(readmeApiUrl)
            .then((response) => response.json())
            .then((readmeData) => {
              // Le contenu du fichier README est encodé en base64
              const readmeBase64 = readmeData.content;

              // Décoder le contenu en UTF-8
              const readmeText = decodeURIComponent(escape(window.atob(readmeBase64)));
              const htmlContent = marked.marked(readmeText);
              readmeContent.insertAdjacentHTML('beforeend', htmlContent);
            })
            .catch((error) => {
              console.error("Une erreur s'est produite lors de la récupération du README : ", error);
              readmeContent.textContent = "Impossible de récupérer le README pour ce projet.";
            });

          projectContainer.appendChild(readmeContent);
          projectContainer.appendChild(projectLink);
          projectItem.appendChild(projectContainer);
          projectsList.appendChild(projectItem);
        }
      });

      modalContent.appendChild(projectsList);
    })
    .catch((error) => {
      console.error("Une erreur s'est produite lors de la récupération des projets GitHub : ", error);
      modalContent.textContent = "Impossible de récupérer les projets GitHub pour le moment.";
    });
}







function main(){
	handle_gravity_button()
	handle_aura()
  fetchGitHubProjects("Tuxiboule");
  handle_header()
};

main()


  
  