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