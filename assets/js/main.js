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

// [feature/form-submit] Valida y envia el formulario demo con feedback dinamico (sin alertas).
const demoForm = document.querySelector(".demo-form");

if (demoForm) {
	const demoNameInput = demoForm.querySelector('input[name="nombre"]');
	const demoEmailInput = demoForm.querySelector('input[name="correo"]');
	const demoFormMessageInput = demoForm.querySelector('textarea[name="mensaje"]');
	const submitButton = demoForm.querySelector('button[type="submit"]');

	let formFeedback = demoForm.querySelector("#demo-form-feedback");

	if (!formFeedback) {
		formFeedback = document.createElement("p");
		formFeedback.id = "demo-form-feedback";
		formFeedback.className = "form-feedback";
		formFeedback.setAttribute("aria-live", "polite");

		if (submitButton) {
			submitButton.insertAdjacentElement("afterend", formFeedback);
		} else {
			demoForm.append(formFeedback);
		}
	}

	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

	const setFieldValidity = (field, isValid) => {
		if (!field) {
			return;
		}

		field.classList.toggle("is-invalid", !isValid);
		field.setAttribute("aria-invalid", String(!isValid));
	};

	const showFormFeedback = (message, type) => {
		if (!formFeedback) {
			return;
		}

		formFeedback.textContent = message;
		formFeedback.classList.remove("is-success", "is-error", "is-visible");

		if (!message) {
			return;
		}

		formFeedback.classList.add("is-visible", type === "success" ? "is-success" : "is-error");
	};

	const getTrimmedValue = (field) => field?.value.trim() || "";

	const validateDemoForm = () => {
		const errors = [];

		const nameValue = getTrimmedValue(demoNameInput);
		const emailValue = getTrimmedValue(demoEmailInput);
		const messageValue = getTrimmedValue(demoFormMessageInput);

		const isNameValid = nameValue.length >= 3;
		const isEmailValid = emailPattern.test(emailValue);
		const isMessageValid = messageValue.length >= 10;

		setFieldValidity(demoNameInput, isNameValid);
		setFieldValidity(demoEmailInput, isEmailValid);
		setFieldValidity(demoFormMessageInput, isMessageValid);

		if (!isNameValid) {
			errors.push("Ingresa un nombre valido de al menos 3 caracteres.");
		}

		if (!isEmailValid) {
			errors.push("Ingresa un correo electronico valido.");
		}

		if (!isMessageValid) {
			errors.push("Ingresa un mensaje de al menos 10 caracteres.");
		}

		return errors;
	};

	const handleFieldInput = (field) => {
		if (!field) {
			return;
		}

		field.addEventListener("input", () => {
			if (field.classList.contains("is-invalid")) {
				setFieldValidity(field, true);
			}

			if (formFeedback?.classList.contains("is-error")) {
				showFormFeedback("", "error");
			}
		});
	};

	handleFieldInput(demoNameInput);
	handleFieldInput(demoEmailInput);
	handleFieldInput(demoFormMessageInput);

	demoForm.addEventListener("submit", (event) => {
		event.preventDefault();

		const validationErrors = validateDemoForm();

		if (validationErrors.length > 0) {
			showFormFeedback(validationErrors[0], "error");
			return;
		}

		showFormFeedback(
			"Solicitud enviada correctamente. Te contactaremos en menos de 24 horas habiles.",
			"success",
		);

		demoForm.reset();
		setFieldValidity(demoNameInput, true);
		setFieldValidity(demoEmailInput, true);
		setFieldValidity(demoFormMessageInput, true);

		if (demoMessageInput) {
			demoMessageInput.dispatchEvent(new Event("input", { bubbles: true }));
		}
	});
}

// [feature/theme-toggle] Alterna entre tema claro/oscuro y recuerda preferencia del usuario.
const themeToggleButton = document.querySelector("#btn-theme-toggle");

if (themeToggleButton) {
	const root = document.documentElement;
	const themeStorageKey = "mecatron-theme";

	const applyTheme = (theme) => {
		const nextTheme = theme === "dark" ? "dark" : "light";
		const isDark = nextTheme === "dark";

		root.dataset.theme = nextTheme;
		themeToggleButton.setAttribute("aria-pressed", String(isDark));
		themeToggleButton.setAttribute(
			"aria-label",
			isDark ? "Activar modo claro" : "Activar modo oscuro",
		);
		themeToggleButton.title =
			isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
	};

	const getInitialTheme = () => {
		try {
			const storedTheme = window.localStorage.getItem(themeStorageKey);

			if (storedTheme === "dark" || storedTheme === "light") {
				return storedTheme;
			}
		} catch {
			// Sin acceso a storage: se usa preferencia del sistema.
		}

		return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
			? "dark"
			: "light";
	};

	applyTheme(getInitialTheme());

	themeToggleButton.addEventListener("click", () => {
		const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
		applyTheme(nextTheme);

		try {
			window.localStorage.setItem(themeStorageKey, nextTheme);
		} catch {
			// Ignora error de storage y mantiene el cambio visual en memoria.
		}
	});
}

// [feature/benefits-toggle] Muestra/oculta informacion secundaria sin recargar pagina.
const infoToggleButtons = document.querySelectorAll(".info-toggle-btn");

if (infoToggleButtons.length > 0) {
	const setPanelState = (button, panel, isExpanded) => {
		const showText = button.dataset.showText || "Mostrar informacion";
		const hideText = button.dataset.hideText || "Ocultar informacion";

		panel.hidden = !isExpanded;
		button.setAttribute("aria-expanded", String(isExpanded));
		button.textContent = isExpanded ? hideText : showText;
	};

	infoToggleButtons.forEach((button) => {
		const targetId = button.dataset.toggleTarget;
		const panel = targetId ? document.getElementById(targetId) : null;

		if (!panel) {
			return;
		}

		setPanelState(button, panel, button.getAttribute("aria-expanded") !== "false");

		button.addEventListener("click", () => {
			setPanelState(button, panel, panel.hidden);
		});
	});
}

// [feature/benefits-counter] Anima indicadores numericos al entrar en viewport.
const metricCounters = Array.from(document.querySelectorAll(".metric-counter[data-end]"));

if (metricCounters.length > 0) {
	const prefersReducedMotion =
		window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false;

	const formatCounterValue = (counter, value) => {
		const prefix = counter.dataset.prefix || "";
		const suffix = counter.dataset.suffix || "";

		counter.textContent = `${prefix}${Math.round(value)}${suffix}`;
	};

	const animateCounter = (counter) => {
		if (counter.dataset.animated === "true") {
			return;
		}

		counter.dataset.animated = "true";

		const start = Number(counter.dataset.start || 0);
		const end = Number(counter.dataset.end || 0);
		const duration = Number(counter.dataset.duration || 1200);

		if (prefersReducedMotion || duration <= 0) {
			formatCounterValue(counter, end);
			return;
		}

		const startTime = performance.now();
		const delta = end - start;
		const easeOutCubic = (progress) => 1 - (1 - progress) ** 3;

		const tick = (now) => {
			const elapsed = now - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = easeOutCubic(progress);

			formatCounterValue(counter, start + delta * eased);

			if (progress < 1) {
				window.requestAnimationFrame(tick);
			}
		};

		window.requestAnimationFrame(tick);
	};

	const runCounters = () => {
		metricCounters.forEach(animateCounter);
	};

	const benefitsSection = document.querySelector("#beneficios");

	if (benefitsSection && "IntersectionObserver" in window) {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					runCounters();
					observer.disconnect();
				}
			},
			{ threshold: 0.35 },
		);

		observer.observe(benefitsSection);
	} else {
		runCounters();
	}
}
