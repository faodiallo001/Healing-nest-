"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("header-container", "/components/header.html");
  await loadComponent("footer-container", "/components/footer.html");

  document.dispatchEvent(new CustomEvent("componentsLoaded"));
});

async function loadComponent(containerId, componentPath) {
  const container = document.getElementById(containerId);

  if (!container) {
    return;
  }

  try {
    const response = await fetch(componentPath);

    if (!response.ok) {
      throw new Error(
        `Unable to load ${componentPath}: ${response.status}`
      );
    }

    container.innerHTML = await response.text();
  } catch (error) {
    console.error(error);

    container.innerHTML = `
      <p style="padding: 1rem; text-align: center;">
        This section could not be loaded.
      </p>
    `;
  }
}
