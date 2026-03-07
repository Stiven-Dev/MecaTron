// [feature/back-to-top] Muestra el boton tras un umbral de scroll y vuelve al inicio.
const backToTopButton = document.querySelector("#btn-volver-arriba");

if (backToTopButton) {
	const showAfter = 250;

	const toggleBackToTop = () => {
		backToTopButton.classList.toggle("is-visible", window.scrollY > showAfter);
	};

	window.addEventListener("scroll", toggleBackToTop, { passive: true });

	backToTopButton.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	});

	toggleBackToTop();
}

const siteHeader = document.querySelector(".site-header");
const homeLink = document.querySelector(".home-link");
const mainNav = document.querySelector(".main-nav");
const navToggle = document.querySelector(".nav-toggle");

// [feature/nav] Navegacion responsive: colapsa por falta de ancho o en movil.
if (siteHeader && homeLink && mainNav && navToggle) {
	const navLinks = Array.from(mainNav.querySelectorAll("a"));
	const staticLogoLabel = "Identificador de secciones MecaTron";
	const mobileCollapseMaxWidth = 720;

	// [feature/nav-a11y] Sincroniza clases y atributos aria para estado visual/accesible.
	const setNavExpanded = (isExpanded) => {
		const isInteractive = !navToggle.disabled;
		const expandedState = isInteractive ? isExpanded : false;

		mainNav.classList.toggle("is-open", expandedState);
		navToggle.setAttribute("aria-expanded", String(expandedState));

		if (!isInteractive) {
			navToggle.setAttribute("aria-label", staticLogoLabel);
			return;
		}

		navToggle.setAttribute(
			"aria-label",
			expandedState ? "Cerrar menú de secciones" : "Abrir menú de secciones",
		);
	};

	// [feature/nav-measure] Compara ancho disponible del header vs ancho real requerido por la nav.
	const needsCollapsedNav = () => {
		if (window.innerWidth <= mobileCollapseMaxWidth) {
			return true;
		}

		const previousStyles = {
			display: mainNav.style.display,
			position: mainNav.style.position,
			visibility: mainNav.style.visibility,
			width: mainNav.style.width,
			flexWrap: mainNav.style.flexWrap,
			pointerEvents: mainNav.style.pointerEvents,
		};

		const wasCollapsed = siteHeader.classList.contains("is-collapsed-nav");

		if (wasCollapsed) {
			siteHeader.classList.remove("is-collapsed-nav");
		}

		mainNav.style.display = "flex";
		mainNav.style.position = "absolute";
		mainNav.style.visibility = "hidden";
		mainNav.style.width = "auto";
		mainNav.style.flexWrap = "nowrap";
		mainNav.style.pointerEvents = "none";

		const requiredNavWidth = mainNav.scrollWidth;
		const headerStyles = window.getComputedStyle(siteHeader);
		const horizontalPadding =
			parseFloat(headerStyles.paddingLeft) +
			parseFloat(headerStyles.paddingRight);
		const headerGap = parseFloat(headerStyles.gap || "0");
		const safeMargin = 20;
		const availableWidth =
			siteHeader.clientWidth -
			horizontalPadding -
			navToggle.offsetWidth -
			homeLink.offsetWidth -
			headerGap * 2 -
			safeMargin;

		mainNav.style.display = previousStyles.display;
		mainNav.style.position = previousStyles.position;
		mainNav.style.visibility = previousStyles.visibility;
		mainNav.style.width = previousStyles.width;
		mainNav.style.flexWrap = previousStyles.flexWrap;
		mainNav.style.pointerEvents = previousStyles.pointerEvents;

		if (wasCollapsed) {
			siteHeader.classList.add("is-collapsed-nav");
		}

		return requiredNavWidth > availableWidth;
	};

	// [feature/nav-layout] Aplica modo normal o colapsado segun la medicion actual.
	const applyNavLayout = () => {
		const collapse = needsCollapsedNav();
		siteHeader.classList.toggle("is-collapsed-nav", collapse);
		navToggle.disabled = !collapse;

		if (!collapse) {
			setNavExpanded(false);
			return;
		}

		navToggle.setAttribute(
			"aria-label",
			mainNav.classList.contains("is-open")
				? "Cerrar menú de secciones"
				: "Abrir menú de secciones",
		);
	};

	// [feature/nav-perf] Encapsula el reflow en rAF para evitar recalculos repetidos.
	const requestNavLayoutUpdate = () => {
		window.requestAnimationFrame(applyNavLayout);
	};

	navToggle.addEventListener("click", () => {
		if (navToggle.disabled) {
			return;
		}

		const shouldOpen = !mainNav.classList.contains("is-open");
		setNavExpanded(shouldOpen);
	});

	navLinks.forEach((link) => {
		link.addEventListener("click", () => {
			if (siteHeader.classList.contains("is-collapsed-nav")) {
				setNavExpanded(false);
			}
		});
	});

	document.addEventListener("click", (event) => {
		if (!siteHeader.classList.contains("is-collapsed-nav")) {
			return;
		}

		if (!mainNav.classList.contains("is-open")) {
			return;
		}

		if (siteHeader.contains(event.target)) {
			return;
		}

		setNavExpanded(false);
	});

	window.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
			setNavExpanded(false);
			navToggle.focus();
		}
	});

	window.addEventListener("load", requestNavLayoutUpdate);
	window.addEventListener("resize", requestNavLayoutUpdate);
	window.addEventListener("orientationchange", requestNavLayoutUpdate);

	if (document.fonts && document.fonts.ready) {
		document.fonts.ready.then(requestNavLayoutUpdate);
	}

	setNavExpanded(false);
	applyNavLayout();
}

// [feature/contact-links] Resuelve enlaces en runtime para dificultar scraping directo.
const demoContactLinks = document.querySelectorAll(".demo-contact-link");

if (demoContactLinks.length > 0) {
	const decodeContact = (charCodes) =>
		charCodes.map((code) => String.fromCharCode(code)).join("");

	const obfuscatedContacts = {
		phone: [43, 53, 55, 51, 48, 48, 49, 50, 51, 52, 53, 54, 55],
		mail: [
			100, 101, 109, 111, 64, 109, 101, 99, 97, 116, 114, 111, 110, 46, 99, 111,
		],
	};

	demoContactLinks.forEach((link) => {
		link.addEventListener("click", (event) => {
			event.preventDefault();

			const contactType = link.dataset.contact;
			const value = decodeContact(obfuscatedContacts[contactType] || []);

			if (!value) {
				return;
			}

			window.location.href =
				contactType === "phone" ? `tel:${value}` : `mailto:${value}`;
		});
	});
}

// [feature/char-counter] Actualiza contador del textarea y estados cercanos al limite.
const demoMessageInput = document.querySelector("#demo-mensaje");
const demoCounter = document.querySelector("#demo-char-counter");
const demoCounterCurrent = demoCounter?.querySelector("[data-current]");
const demoCounterLimit = demoCounter?.querySelector("[data-limit]");

if (demoMessageInput && demoCounter && demoCounterCurrent) {
	const maxChars = Number(demoMessageInput.getAttribute("maxlength")) || 0;

	if (demoCounterLimit && maxChars > 0) {
		demoCounterLimit.textContent = String(maxChars);
	}

	const updateMessageCounter = () => {
		const currentChars = demoMessageInput.value.length;
		demoCounterCurrent.textContent = String(currentChars);

		if (maxChars > 0) {
			demoCounter.classList.toggle(
				"is-near-limit",
				currentChars >= Math.floor(maxChars * 0.9),
			);
			demoCounter.classList.toggle("is-at-limit", currentChars >= maxChars);
		}
	};

	demoMessageInput.addEventListener("input", updateMessageCounter);
	updateMessageCounter();
}
