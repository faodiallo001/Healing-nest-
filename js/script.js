"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initializeHeader();
  initializeRevealAnimations();
});

function initializeHeader() {
  const header = document.getElementById("site-header");

  if (!header) {
    return;
  }

  const mainNavigation = header.querySelector(".main-navigation");
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileNavigation = document.getElementById("mobile-navigation");
  const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");

  const desktopDropdownItems = header.querySelectorAll(
    ".nav-item-dropdown"
  );

  const mobileDropdownItems = header.querySelectorAll(
    ".mobile-dropdown-item"
  );

  const mobileNavigationLinks = header.querySelectorAll(
    ".mobile-navigation a"
  );

  /*
   * Sticky header
   */
  function updateStickyHeader() {
    const stickyPoint = 70;

    if (window.scrollY > stickyPoint) {
      header.classList.add("is-sticky");

      if (mainNavigation) {
        document.body.style.paddingTop =
          `${mainNavigation.offsetHeight}px`;
      }
    } else {
      header.classList.remove("is-sticky");
      document.body.style.paddingTop = "0";
    }
  }

  updateStickyHeader();

  window.addEventListener("scroll", updateStickyHeader, {
    passive: true
  });

  /*
   * Desktop dropdowns
   */
  desktopDropdownItems.forEach((dropdownItem) => {
    const trigger = dropdownItem.querySelector(".dropdown-trigger");

    if (!trigger) {
      return;
    }

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();

      const willOpen = !dropdownItem.classList.contains("is-open");

      closeDesktopDropdowns();

      if (willOpen) {
        dropdownItem.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });

    dropdownItem.addEventListener("mouseenter", () => {
      if (window.innerWidth > 1050) {
        closeDesktopDropdowns();

        dropdownItem.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });

    dropdownItem.addEventListener("mouseleave", () => {
      if (window.innerWidth > 1050) {
        dropdownItem.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  });

  function closeDesktopDropdowns() {
    desktopDropdownItems.forEach((item) => {
      item.classList.remove("is-open");

      const trigger = item.querySelector(".dropdown-trigger");

      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.addEventListener("click", (event) => {
    const clickedInsideDropdown = event.target.closest(
      ".nav-item-dropdown"
    );

    if (!clickedInsideDropdown) {
      closeDesktopDropdowns();
    }
  });

  /*
   * Mobile menu
   */
  function openMobileMenu() {
    if (
      !mobileMenuButton ||
      !mobileNavigation ||
      !mobileMenuOverlay
    ) {
      return;
    }

    mobileMenuButton.classList.add("is-active");
    mobileNavigation.classList.add("is-open");
    mobileMenuOverlay.classList.add("is-visible");
    document.body.classList.add("menu-open");

    mobileMenuButton.setAttribute("aria-expanded", "true");
    mobileMenuButton.setAttribute(
      "aria-label",
      "Close navigation menu"
    );
  }

  function closeMobileMenu() {
    if (
      !mobileMenuButton ||
      !mobileNavigation ||
      !mobileMenuOverlay
    ) {
      return;
    }

    mobileMenuButton.classList.remove("is-active");
    mobileNavigation.classList.remove("is-open");
    mobileMenuOverlay.classList.remove("is-visible");
    document.body.classList.remove("menu-open");

    mobileMenuButton.setAttribute("aria-expanded", "false");
    mobileMenuButton.setAttribute(
      "aria-label",
      "Open navigation menu"
    );
  }

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", () => {
      const isOpen = mobileNavigation?.classList.contains("is-open");

      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener("click", closeMobileMenu);
  }

  mobileNavigationLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  /*
   * Mobile dropdowns
   */
  mobileDropdownItems.forEach((dropdownItem) => {
    const trigger = dropdownItem.querySelector(
      ".mobile-dropdown-trigger"
    );

    if (!trigger) {
      return;
    }

    trigger.addEventListener("click", () => {
      const willOpen = !dropdownItem.classList.contains("is-open");

      mobileDropdownItems.forEach((item) => {
        item.classList.remove("is-open");

        const itemTrigger = item.querySelector(
          ".mobile-dropdown-trigger"
        );

        if (itemTrigger) {
          itemTrigger.setAttribute("aria-expanded", "false");
        }
      });

      if (willOpen) {
        dropdownItem.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  /*
   * Escape key
   */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDesktopDropdowns();
      closeMobileMenu();
    }
  });

  /*
   * Close mobile menu when switching to desktop
   */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1050) {
      closeMobileMenu();
    }

    updateStickyHeader();
  });

  /*
   * Active page link
   */
  setActiveNavigationLink(header);
}

function setActiveNavigationLink(header) {
  const currentPath =
    window.location.pathname === "/"
      ? "/index.html"
      : window.location.pathname;

  const navigationLinks = header.querySelectorAll(
    ".desktop-nav a.nav-link, .mobile-nav-list > li > a"
  );

  navigationLinks.forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname;

    if (linkPath === currentPath) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

function initializeRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!revealElements.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("active");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}
