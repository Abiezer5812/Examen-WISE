// ---------- TODO 1 : Menu mobile ----------
// Au clic sur #menu-toggle :
// - affichez/masquez #mobile-menu
// - mettez à jour l'attribut aria-expanded du bouton ("true"/"false")
// Fermez aussi le menu si l'utilisateur clique sur un des liens qu'il contient.

// ---------- TODO 2 : Accordéon FAQ ----------
// Pour chaque .faq-question :
// - au clic, affichez/masquez le .faq-answer associé (attribut hidden)
// - mettez à jour aria-expanded sur le bouton
// - un seul item ouvert à la fois : ouvrir une question referme celle qui était ouverte

// ---------- TODO 3 : Compteurs animés ----------
// Utilisez IntersectionObserver pour détecter quand #stats-section entre dans l'écran.
// Une fois visible (une seule fois), pour chaque .stat-value :
// - lisez la valeur cible dans l'attribut data-target
// - animez le nombre affiché de 0 jusqu'à cette valeur (ex. avec setInterval,
//   requestAnimationFrame, ou une simple boucle avec des étapes)

// ---------- TODO 4 : Formulaire de devis ----------
// Sur #quote-form, à la soumission (submit) :
// - empêchez le rechargement de la page (preventDefault)
// - validez : nom non vide, message non vide, email au format valide (contient "@" et un domaine)
// - si invalide : affichez un message d'erreur à côté du/des champ(s) concerné(s) (pas de alert() !)
// - si valide : affichez un message de confirmation dans la page, et réinitialisez le formulaire

 
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
 
function fermerMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("hidden", "");
}
 
function ouvrirMenu() {
  menuToggle.setAttribute("aria-expanded", "true");
  mobileMenu.removeAttribute("hidden");
}
 
menuToggle.addEventListener("click", function () {
  const estOuvert = menuToggle.getAttribute("aria-expanded") === "true";
 
  if (estOuvert) {
    fermerMenu();
  } else {
    ouvrirMenu();
  }
});
 
const liensMenuMobile = mobileMenu.querySelectorAll("a");
 
liensMenuMobile.forEach(function (lien) {
  lien.addEventListener("click", fermerMenu);
});
 
/* ===================== ACCORDÉON FAQ ===================== */
 
const questionsFaq = document.querySelectorAll(".faq-question");
 
questionsFaq.forEach(function (bouton) {
  bouton.addEventListener("click", function () {
    const reponseId = bouton.getAttribute("aria-controls");
    const reponse = document.getElementById(reponseId);
    const estOuvert = bouton.getAttribute("aria-expanded") === "true";
 
    questionsFaq.forEach(function (autreBouton) {
      const autreReponseId = autreBouton.getAttribute("aria-controls");
      const autreReponse = document.getElementById(autreReponseId);
 
      autreBouton.setAttribute("aria-expanded", "false");
      autreReponse.setAttribute("hidden", "");
    });
 
    if (!estOuvert) {
      bouton.setAttribute("aria-expanded", "true");
      reponse.removeAttribute("hidden");
    }
  });
});
 
/* ===================== COMPTEURS ANIMÉS ===================== */
 
function animerCompteur(element) {
  const cible = Number(element.getAttribute("data-target"));
  const duree = 1500;
  const depart = performance.now();
 
  function etape(instantActuel) {
    const tempsEcoule = instantActuel - depart;
    const progression = Math.min(tempsEcoule / duree, 1);
    const valeurActuelle = Math.floor(progression * cible);
 
    element.textContent = valeurActuelle;
 
    if (progression < 1) {
      requestAnimationFrame(etape);
    } else {
      element.textContent = cible;
    }
  }
 
  requestAnimationFrame(etape);
}
 
const statsSection = document.getElementById("stats-section");
const valeursStats = document.querySelectorAll(".stat-value");
 
const observateurStats = new IntersectionObserver(function (entrees, observateur) {
  entrees.forEach(function (entree) {
    if (entree.isIntersecting) {
      valeursStats.forEach(animerCompteur);
      observateur.unobserve(statsSection);
    }
  });
});
 
observateurStats.observe(statsSection);
 
/* ===================== FORMULAIRE DE DEVIS ===================== */
 
const formulaireDevis = document.getElementById("quote-form");
const champNom = document.getElementById("name");
const champEmail = document.getElementById("email");
const champMessage = document.getElementById("message");
const erreurNom = document.getElementById("name-error");
const erreurEmail = document.getElementById("email-error");
const erreurMessage = document.getElementById("message-error");
const messageSucces = document.getElementById("form-success");
 
function emailEstValide(valeur) {
  const morceaux = valeur.split("@");
  if (morceaux.length !== 2) return false;

  const partieAvant = morceaux[0];
  const partieApres = morceaux[1];

  const positionPoint = partieApres.indexOf(".");

  const avantEstValide = partieAvant.length > 0 && !partieAvant.includes(" ");
  const domaineAUnPoint = positionPoint > 0;
  const finDuDomaineExiste = positionPoint < partieApres.length - 1;
  const pasDEspaceApres = !partieApres.includes(" ");

  return avantEstValide && domaineAUnPoint && finDuDomaineExiste && pasDEspaceApres;
}
 
formulaireDevis.addEventListener("submit", function (evenement) {
  evenement.preventDefault();
 
  erreurNom.textContent = "";
  erreurEmail.textContent = "";
  erreurMessage.textContent = "";
  messageSucces.setAttribute("hidden", "");
 
  let formulaireValide = true;
 
  if (champNom.value.trim() === "") {
    erreurNom.textContent = "Merci d'indiquer votre nom.";
    formulaireValide = false;
  }
 
  if (!emailEstValide(champEmail.value.trim())) {
    erreurEmail.textContent = "Merci d'indiquer un email valide.";
    formulaireValide = false;
  }
 
  if (champMessage.value.trim() === "") {
    erreurMessage.textContent = "Merci de décrire votre projet.";
    formulaireValide = false;
  }
 
  if (formulaireValide) {
    messageSucces.removeAttribute("hidden");
    formulaireDevis.reset();
  }
});