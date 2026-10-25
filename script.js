
document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. MOBILE NAVIGATION
  // ==========================================
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    navItems.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      });
    });

    // Close the mobile menu when clicking outside it.
    document.addEventListener("click", (event) => {
      const clickedInsideMenu = navLinks.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      }
    });

    // Close the mobile menu with Escape.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      }
    });
  }

  // ==========================================
  // 2. ACTIVE NAVIGATION LINK
  // ==========================================
  const sections = document.querySelectorAll("section[id]");

  if ("IntersectionObserver" in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const sectionId = entry.target.id;

          navItems.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${sectionId}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        root: null,
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // ==========================================
  // 3. AUTOMATIC COPYRIGHT YEAR
  // ==========================================
  const yearElement = document.querySelector("#year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ==========================================
  // 4. CERTIFICATE SLIDESHOW
  // ==========================================
  const certificateSlider = document.getElementById(
    "certificateSlider"
  );

  if (certificateSlider) {
    const slides = Array.from(
      certificateSlider.querySelectorAll(".certificate-slide")
    );

    const dotsContainer = document.getElementById("certificateDots");
    const counter = document.getElementById("certificateCounter");
    const previousButton = document.getElementById("certificatePrev");
    const nextButton = document.getElementById("certificateNext");

    let currentCertificate = 0;

    // Check that the required slideshow elements exist.
    if (
      slides.length > 0 &&
      dotsContainer &&
      counter &&
      previousButton &&
      nextButton
    ) {
      // Create one navigation dot for every certificate.
      dotsContainer.innerHTML = "";

      slides.forEach((slide, index) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "certificate-dot";
        dot.setAttribute(
          "aria-label",
          `Show certificate ${index + 1}`
        );

        dot.addEventListener("click", () => {
          showCertificate(index);
        });

        dotsContainer.appendChild(dot);
      });

      const dots = Array.from(
        dotsContainer.querySelectorAll(".certificate-dot")
      );

      // Display the selected certificate.
      function showCertificate(index) {
        currentCertificate =
          (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
          const isActive = slideIndex === currentCertificate;

          slide.classList.toggle("active", isActive);
          slide.setAttribute("aria-hidden", String(!isActive));

          // Prevent keyboard focus on links in hidden slides.
          slide
            .querySelectorAll("a, button, input, select, textarea")
            .forEach((element) => {
              if (isActive) {
                element.removeAttribute("tabindex");
              } else {
                element.setAttribute("tabindex", "-1");
              }
            });
        });

        // Update the navigation dots.
        dots.forEach((dot, dotIndex) => {
          const isActive = dotIndex === currentCertificate;

          dot.classList.toggle("active", isActive);

          if (isActive) {
            dot.setAttribute("aria-current", "true");
          } else {
            dot.removeAttribute("aria-current");
          }
        });

        // Update the slide counter, for example: 01 / 05.
        counter.textContent =
          `${String(currentCertificate + 1).padStart(2, "0")} / ` +
          `${String(slides.length).padStart(2, "0")}`;
      }

      // Previous certificate.
      previousButton.addEventListener("click", () => {
        showCertificate(currentCertificate - 1);
      });

      // Next certificate.
      nextButton.addEventListener("click", () => {
        showCertificate(currentCertificate + 1);
      });

      // Navigate with the left and right arrow keys.
      certificateSlider.addEventListener("keydown", (event) => {
        // Don't intercept arrow keys while typing in a form field.
        const target = event.target;

        if (
          target instanceof HTMLElement &&
          target.matches("input, textarea, select, [contenteditable='true']")
        ) {
          return;
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          showCertificate(currentCertificate - 1);
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          showCertificate(currentCertificate + 1);
        }
      });

      // Show the first certificate when the page loads.
      showCertificate(0);
    }
  }
});

