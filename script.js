const tiltCards = document.querySelectorAll("[data-tilt]");

tiltCards.forEach((tiltCard) => {
  tiltCard.addEventListener("pointermove", (event) => {
    const bounds = tiltCard.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const rotateX = (0.5 - y) * 7;
    const rotateY = (x - 0.5) * 10;
    const glowX = `${x * 100}%`;
    const glowY = `${y * 100}%`;

    tiltCard.classList.add("is-active");
    tiltCard.style.setProperty("--glow-x", glowX);
    tiltCard.style.setProperty("--glow-y", glowY);
    tiltCard.style.transform = `perspective(1200px) translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
  });

  tiltCard.addEventListener("pointerleave", () => {
    tiltCard.classList.remove("is-active");
    tiltCard.style.transform = "perspective(1200px) translateY(0) rotateX(0deg) rotateY(0deg) scale(1)";
  });
});

const heroPanel = document.querySelector(".hero-panel");
const heroSide = document.querySelector(".hero-side");
const topHeroCard = document.querySelector(".hero-side .hero-card:not(.extra-card)");
const extraCard = document.querySelector(".extra-card");
const visitCounterNumber = document.querySelector("#visit-counter-number");

function syncHeroCardHeights() {
  if (!heroPanel || !heroSide || !topHeroCard || !extraCard) {
    return;
  }

  if (window.innerWidth <= 900) {
    extraCard.style.minHeight = "";
    return;
  }

  const sideStyles = window.getComputedStyle(heroSide);
  const gap = parseFloat(sideStyles.gap) || 0;
  const remainingHeight = heroPanel.offsetHeight - topHeroCard.offsetHeight - gap;

  extraCard.style.minHeight = `${Math.max(92, remainingHeight)}px`;
}

window.addEventListener("load", syncHeroCardHeights);
window.addEventListener("resize", syncHeroCardHeights);
syncHeroCardHeights();

async function updateVisitCounter() {
  if (!visitCounterNumber) {
    return;
  }

  try {
    const response = await fetch("https://api.counterapi.dev/v1/ritvik-siyag/personal-card/up");
    if (!response.ok) {
      throw new Error("Counter request failed");
    }

    const data = await response.json();
    const count = data.count ?? data.value ?? 0;
    visitCounterNumber.textContent = String(count);
  } catch {
    visitCounterNumber.textContent = "N/A";
  }
}

updateVisitCounter();
