/* AGRIBAC — scripts du site */
(function () {
  "use strict";

  var cfg = window.AGRIBAC_CONFIG || {};
  var waNumber = String(cfg.whatsapp || "").replace(/\D/g, "");
  var hasWa = waNumber.length >= 8;
  var prixKg = typeof cfg.prixKg === "number" && cfg.prixKg > 0 ? cfg.prixKg : null;

  function formatFcfa(n) {
    return Math.round(n).toLocaleString("fr-FR").replace(/ | /g, " ") + " FCFA";
  }

  function waLink(message) {
    if (!hasWa) return "contact.html#coordonnees";
    return "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(message || "");
  }

  function openWhatsApp(message) {
    if (!hasWa) {
      window.location.href = "contact.html#coordonnees";
      return;
    }
    window.open(waLink(message), "_blank", "noopener");
  }

  /* Liens WhatsApp : <a data-wa="message"> */
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    var msg = a.getAttribute("data-wa") || "Bonjour AGRIBAC, je souhaite commander des poulets.";
    a.setAttribute("href", waLink(msg));
    if (hasWa) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    }
  });

  /* Coordonnées */
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    var key = el.getAttribute("data-cfg");
    var val = cfg[key];
    var fallback = el.getAttribute("data-fallback");
    if (key === "telephone" && val) {
      el.innerHTML = "";
      var a = document.createElement("a");
      a.href = "tel:" + String(val).replace(/[^\d+]/g, "");
      a.textContent = val;
      el.appendChild(a);
    } else if (key === "email" && val) {
      el.innerHTML = "";
      var m = document.createElement("a");
      m.href = "mailto:" + val;
      m.textContent = val;
      el.appendChild(m);
    } else if (key === "whatsapp") {
      el.textContent = hasWa ? "+" + waNumber : (fallback || "Numéro bientôt disponible");
    } else if (val) {
      el.textContent = val;
    } else if (fallback) {
      el.textContent = fallback;
    }
  });

  /* Prix au kg */
  document.querySelectorAll("[data-prix]").forEach(function (el) {
    el.innerHTML = prixKg
      ? formatFcfa(prixKg) + " <small>/ kg</small>"
      : "Sur demande";
  });
  document.querySelectorAll("[data-prix-maj]").forEach(function (el) {
    el.textContent = prixKg
      ? (cfg.prixMaj ? "Tarif mis à jour le " + cfg.prixMaj + "." : "Tarif du jour.")
      : "Le prix varie selon le marché : demandez le tarif du jour sur WhatsApp ou par téléphone.";
  });

  /* Menu mobile */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* Année du pied de page */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Estimateur de prix */
  var est = document.getElementById("estimateur");
  if (est) {
    var nb = est.querySelector("#est-nombre");
    var poids = est.querySelector("#est-poids");
    var out = est.querySelector("#est-resultat");
    var update = function () {
      var n = Math.max(0, parseInt(nb.value, 10) || 0);
      var p = Math.max(0, parseFloat(String(poids.value).replace(",", ".")) || 0);
      var total = n * p;
      if (!n || !p) {
        out.textContent = "Indiquez le nombre de poulets et le poids moyen.";
        return;
      }
      var kg = total.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
      out.textContent = prixKg
        ? "Poids total estimé : " + kg + " kg · Montant estimé : " + formatFcfa(total * prixKg) + " (hors livraison)."
        : "Poids total estimé : " + kg + " kg. Le montant sera calculé avec le tarif du jour.";
    };
    nb.addEventListener("input", update);
    poids.addEventListener("input", update);
    update();
    var estBtn = est.querySelector("[data-est-wa]");
    if (estBtn) {
      estBtn.addEventListener("click", function () {
        var n = parseInt(nb.value, 10) || 0;
        var p = poids.value || "?";
        openWhatsApp("Bonjour AGRIBAC, je souhaite le tarif du jour pour " + n + " poulet(s) d'environ " + p + " kg chacun.");
      });
    }
  }

  /* Formulaires -> message WhatsApp */
  function validate(form) {
    var ok = true;
    var first = null;
    form.querySelectorAll("[required]").forEach(function (f) {
      var valid = f.type === "radio"
        ? !!form.querySelector('input[name="' + f.name + '"]:checked')
        : f.checkValidity() && String(f.value).trim() !== "";
      if (f.type !== "radio") f.setAttribute("aria-invalid", valid ? "false" : "true");
      if (!valid) { ok = false; if (!first) first = f; }
    });
    if (first) first.focus();
    return ok;
  }

  function val(form, name) {
    var el = form.elements[name];
    if (!el) return "";
    if (el instanceof RadioNodeList) return el.value || "";
    return String(el.value || "").trim();
  }

  document.querySelectorAll("form[data-wa-form]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    form.querySelectorAll("input, select, textarea").forEach(function (f) {
      f.addEventListener("input", function () {
        if (f.getAttribute("aria-invalid") === "true" && f.checkValidity()) f.setAttribute("aria-invalid", "false");
      });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form)) {
        status.className = "form-status is-error";
        status.textContent = "Merci de compléter les champs obligatoires signalés.";
        return;
      }
      var type = form.getAttribute("data-wa-form");
      var lines = [];
      if (type === "commande") {
        lines.push("Bonjour AGRIBAC, je souhaite passer une commande :");
        lines.push("• Nom : " + val(form, "nom"));
        lines.push("• Téléphone : " + val(form, "telephone"));
        lines.push("• Client : " + val(form, "client"));
        lines.push("• Nombre de poulets : " + val(form, "quantite"));
        lines.push("• Taille souhaitée : " + val(form, "taille"));
        lines.push("• Mode : " + val(form, "mode"));
        if (val(form, "commune")) lines.push("• Commune : " + val(form, "commune"));
        if (val(form, "adresse")) lines.push("• Adresse / repère : " + val(form, "adresse"));
        if (val(form, "date")) lines.push("• Date souhaitée : " + val(form, "date"));
        if (val(form, "message")) lines.push("• Précisions : " + val(form, "message"));
      } else if (type === "pro") {
        lines.push("Bonjour AGRIBAC, je souhaite un devis professionnel :");
        lines.push("• Établissement : " + val(form, "etablissement"));
        lines.push("• Activité : " + val(form, "activite"));
        lines.push("• Contact : " + val(form, "nom") + " – " + val(form, "telephone"));
        lines.push("• Commune : " + val(form, "commune"));
        lines.push("• Volume estimé : " + val(form, "volume"));
        lines.push("• Fréquence : " + val(form, "frequence"));
        if (val(form, "message")) lines.push("• Précisions : " + val(form, "message"));
      } else {
        lines.push("Bonjour AGRIBAC,");
        lines.push(val(form, "message"));
        lines.push("— " + val(form, "nom") + " (" + val(form, "telephone") + ")");
      }
      status.className = "form-status is-ok";
      status.textContent = hasWa
        ? "Votre message est prêt : WhatsApp va s'ouvrir, il suffit d'appuyer sur « Envoyer »."
        : "Le numéro WhatsApp d'AGRIBAC sera bientôt disponible. En attendant, contactez-nous par téléphone.";
      if (hasWa) openWhatsApp(lines.join("\n"));
    });
  });
})();
