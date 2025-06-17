import studioFreightlenis from "https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/+esm";

$(document).ready(function () {
  console.log("ready");
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

  const lenis = new studioFreightlenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  initFunctions();
});

CustomEase.create("custom", "M0,0 C0.8,0 0.3,1 1,1 ");

function initFunctions() {
  initMobileMenu();
  initSplitText();
  initDetectScrollingDirection();
  initScrollTriggerAnimations();
  initAccordionCSS();
}

function initMobileMenu() {
  console.log("initMobileMenu");

  if (window.innerWidth < 768) {
    let menuToggles = $("[data-menu='toggle']")
    let menuWrapper = $(".nav__menu")
    let menu = $(".nav__menu-outer")

    function openMenu() {
      console.log("openMenu")
      menuWrapper.attr("data-menu-status", "open")
    }

    function closeMenu() {
      console.log("closeMenu")
      menuWrapper.attr("data-menu-status", "closed")
    }

    menuToggles.on("click", function () {
      if (menuWrapper.attr("data-menu-status") === "open") {
        closeMenu()
      } else {
        openMenu()
      }
    })
  }
}

function initSplitText() {
  document.fonts.ready.then(() => {
    let splitLines = SplitText.create('[data-split="lines"]', {
      type: "lines",
      linesClass: "line",
      mask: "lines",
      autoSplit: true,
    });
  });
}

function initDetectScrollingDirection() {
  let lastScrollTop = 0;
  const threshold = 10; // Minimal scroll distance to switch to up/down
  const thresholdTop = 50; // Minimal scroll distance from top of window to start

  window.addEventListener("scroll", () => {
    const nowScrollTop = window.scrollY;

    if (Math.abs(lastScrollTop - nowScrollTop) >= threshold) {
      // Update Scroll Direction
      const direction = nowScrollTop > lastScrollTop ? "down" : "up";
      document
        .querySelectorAll("[data-scrolling-direction]")
        .forEach((el) =>
          el.setAttribute("data-scrolling-direction", direction)
        );

      // Update Scroll Started
      const started = nowScrollTop > thresholdTop;
      document
        .querySelectorAll("[data-scrolling-started]")
        .forEach((el) =>
          el.setAttribute("data-scrolling-started", started ? "true" : "false")
        );

      lastScrollTop = nowScrollTop;
    }
  });
}

function initScrollTriggerAnimations() {
  // ---- GLOBAL SCROLL ANIMATIONS ---- //
  $('[data-animate="lines"]').each(function () {
    let triggerElement = $(this);

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "0% 95%",
        end: "0% 30%",
        markers: true,
        // scrub: 2,
      },
    });

    tl.from($(this).find(".line"), {
      y: "100%",
      ease: "custom",
      duration: 0.875,
    });
  });

  $('[data-animate="image"]').each(function () {
    let triggerElement = $(this);
    let imageElement = $(this).find("img");

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "0% 95%",
        end: "0% 30%",
        markers: true,
        // scrub: 2,
      },
    });

    tl.fromTo(
      triggerElement,
      {
        clipPath: "inset(100% 0% 0% 0% round 0.5rem)",
      },
      {
        clipPath: "inset(0% 0% 0% 0% round 0.5rem)",
        duration: 0.875,
        ease: "custom",
      }
    );

    console.log($(this));
  });
  // ---- HOME HERO SECTION ---- //

  $(".section__h-hero").each(function () {
    let headingSplit = SplitText.create(".h-display", {
      mask: "lines",
    });
    let heroImage = $(this).find(".background-img__img");

    let triggerElement = $(this);
    let heading = $(this).find(".h-display");

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    tl.to(
      heroImage,
      {
        scale: 1.15,
        duration: 0.875,
        ease: "linear",
      },
      "<"
    );

    tl.to(
      triggerElement,
      {
        ease: "none",
        clipPath: "inset(0% 0% 20% 0%)",
      },
      "<"
    );

    tl.to(
      headingSplit.lines,
      {
        y: "-100%",
      },
      "<"
    );
  });
}

function initAccordionCSS() {
  document.querySelectorAll('[data-accordion-css-init]').forEach((accordion) => {
    const closeSiblings = accordion.getAttribute('data-accordion-close-siblings') === 'true';

    accordion.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-accordion-toggle]');
      if (!toggle) return; // Exit if the clicked element is not a toggle

      const singleAccordion = toggle.closest('[data-accordion-status]');
      if (!singleAccordion) return; // Exit if no accordion container is found

      const isActive = singleAccordion.getAttribute('data-accordion-status') === 'active';
      singleAccordion.setAttribute('data-accordion-status', isActive ? 'not-active' : 'active');
      
      // When [data-accordion-close-siblings="true"]
      if (closeSiblings && !isActive) {
        accordion.querySelectorAll('[data-accordion-status="active"]').forEach((sibling) => {
          if (sibling !== singleAccordion) sibling.setAttribute('data-accordion-status', 'not-active');
        });
      }
    });
  });
}
