"use strict";

/*==============================
    OPTIONAL LIBRARIES
==============================*/

if (window.AOS) {
    AOS.init({
        duration: 1000,
        once: true,
    });
}

/*==============================
    SHARED STATE
==============================*/

const rootElement = document.documentElement;
const body = document.body;
const themeStorageKey = "smilecare-theme";
const rtlStorageKey = "smilecare-direction";

const themeToggleButtons = document.querySelectorAll("#theme-toggle, #mobile-theme-toggle");
const rtlToggleButtons = document.querySelectorAll("#rtl-toggle, #mobile-rtl-toggle");

function readStorage(key) {
    try {
        return window.localStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

function writeStorage(key, value) {
    try {
        window.localStorage.setItem(key, value);
    } catch (error) {
        // Storage can be unavailable in locked-down contexts.
    }
}

function syncThemeButtons(isDarkMode) {
    themeToggleButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(isDarkMode));

        const icon = button.querySelector("i");
        if (icon) {
            icon.className = `fa-solid ${isDarkMode ? "fa-sun" : "fa-moon"}`;
        }
    });
}

function syncRtlButtons(isRtl) {
    rtlToggleButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(isRtl));
    });
}

function setTheme(isDarkMode) {
    body.classList.toggle("dark-mode", isDarkMode);
    syncThemeButtons(isDarkMode);
    writeStorage(themeStorageKey, isDarkMode ? "dark" : "light");
}

function setDirection(isRtl) {
    rootElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
    body.classList.toggle("rtl-mode", isRtl);
    syncRtlButtons(isRtl);
    writeStorage(rtlStorageKey, isRtl ? "rtl" : "ltr");
}

setTheme(readStorage(themeStorageKey) === "dark");
setDirection(readStorage(rtlStorageKey) === "rtl");

themeToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
        setTheme(!body.classList.contains("dark-mode"));
    });
});

rtlToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
        setDirection(rootElement.getAttribute("dir") !== "rtl");
    });
});

/*==============================
    MOBILE MENU
==============================*/

const menuToggle = document.querySelector(".menu-toggle");
const closeMenu = document.querySelector(".close-menu");
const mobileMenu = document.querySelector(".mobile-menu");
const overlay = document.querySelector(".mobile-overlay");

function closeMobileMenu() {
    if (!menuToggle || !mobileMenu || !overlay) {
        return;
    }

    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");
    menuToggle.classList.remove("active");
}

if (menuToggle && mobileMenu && overlay) {
    menuToggle.addEventListener("click", () => {
        mobileMenu.classList.add("active");
        overlay.classList.add("active");
        menuToggle.classList.add("active");
    });
}

if (closeMenu && mobileMenu && overlay) {
    closeMenu.addEventListener("click", closeMobileMenu);
}

if (overlay && mobileMenu && menuToggle) {
    overlay.addEventListener("click", closeMobileMenu);
}

/*==============================
    MOBILE DROPDOWN
==============================*/

const dropdownBtn = document.querySelector(".mobile-dropdown-btn");
const submenu = document.querySelector(".mobile-submenu");

if (dropdownBtn && submenu) {
    dropdownBtn.addEventListener("click", () => {
        submenu.style.display = submenu.style.display === "block" ? "none" : "block";
    });
}

/*==============================
    ACTIVE NAVIGATION
==============================*/

function getPageNameFromHref(href) {
    if (!href || href === "#") {
        return null;
    }

    try {
        return new URL(href, window.location.href).pathname.split("/").pop() || "index.html";
    } catch (error) {
        return null;
    }
}

function clearActiveNavigation() {
    document
        .querySelectorAll(".nav-menu a.active, .dropdown-menu a.active, .mobile-nav a.active, .mobile-dropdown-btn.active")
        .forEach((link) => {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        });
}

function setActiveNavigation() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const isHomePage = currentPage === "index.html" || currentPage === "home-2.html";

    clearActiveNavigation();

    document.querySelectorAll(".nav-menu .nav-item > a").forEach((link) => {
        const pageName = getPageNameFromHref(link.getAttribute("href"));

        if (pageName === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });

    document.querySelectorAll(".dropdown-menu a, .mobile-submenu a, .mobile-nav a").forEach((link) => {
        const pageName = getPageNameFromHref(link.getAttribute("href"));

        if (pageName === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });

    if (isHomePage) {
        const desktopHomeTrigger = document.querySelector(".nav-item.dropdown > a");
        const mobileHomeTrigger = document.querySelector(".mobile-dropdown-btn");

        if (desktopHomeTrigger) {
            desktopHomeTrigger.classList.add("active");
            desktopHomeTrigger.setAttribute("aria-current", "page");
        }

        if (mobileHomeTrigger) {
            mobileHomeTrigger.classList.add("active");
            mobileHomeTrigger.setAttribute("aria-current", "page");
        }
    }
}

setActiveNavigation();

/*==============================
    STICKY HEADER
==============================*/

const header = document.querySelector(".header");

if (header) {
    function updateHeaderState() {
        header.classList.toggle("active", window.scrollY > 80);
    }

    window.addEventListener("scroll", updateHeaderState);
    updateHeaderState();
}

/*==============================
    HERO SLIDER
==============================*/

if (window.Swiper && document.querySelector(".hero-slider")) {
    new Swiper(".hero-slider", {
        loop: true,
        speed: 1200,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
}

if (window.Swiper && document.querySelector(".testimonial-swiper")) {
    new Swiper(".testimonial-swiper", {
        loop: true,
        speed: 900,
        spaceBetween: 24,
        autoplay: {
            delay: 4500,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".testimonial-next",
            prevEl: ".testimonial-prev",
        },
        pagination: {
            el: ".testimonial-pagination",
            clickable: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 3,
            },
        },
    });
}

/*==============================
    COUNTER ANIMATION
==============================*/

const counterItems = document.querySelectorAll("[data-count]");

function animateCounter(element) {
    if (!element || element.dataset.countAnimated === "true") {
        return;
    }

    const targetValue = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || "";
    const duration = 1800;
    const startTime = performance.now();

    element.dataset.countAnimated = "true";

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(targetValue * easedProgress);

        element.textContent = `${currentValue}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

if (counterItems.length) {
    if ("IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.35,
        });

        counterItems.forEach((item) => counterObserver.observe(item));
    } else {
        counterItems.forEach(animateCounter);
    }
}

/*==============================
    AUTH PASSWORD TOGGLE
==============================*/

const passwordToggleButtons = document.querySelectorAll("[data-password-toggle]");

passwordToggleButtons.forEach((button) => {
    const inputId = button.getAttribute("data-target");
    const input = inputId ? document.getElementById(inputId) : button.closest(".auth-password")?.querySelector("input");
    const icon = button.querySelector("i");

    if (!input || !icon) {
        return;
    }

    const syncButton = () => {
        const isVisible = input.type === "text";
        icon.className = `fa-solid ${isVisible ? "fa-eye-slash" : "fa-eye"}`;
        button.setAttribute("aria-label", isVisible ? "Hide password" : "Show password");
        button.setAttribute("aria-pressed", String(isVisible));
    };

    syncButton();

    button.addEventListener("click", () => {
        input.type = input.type === "password" ? "text" : "password";
        syncButton();
    });
});

/*==============================
    APPOINTMENT FORM
==============================*/

const appointmentDateInput = document.getElementById("appointment-date");

if (appointmentDateInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    appointmentDateInput.min = `${year}-${month}-${day}`;
}

const appointmentSelectWraps = document.querySelectorAll("[data-appointment-select]");

function closeAppointmentSelects(exceptWrap = null) {
    appointmentSelectWraps.forEach((wrap) => {
        if (wrap !== exceptWrap) {
            wrap.classList.remove("is-open");

            const button = wrap.querySelector(".appointment-select-button");
            if (button) {
                button.setAttribute("aria-expanded", "false");
            }
        }
    });
}

appointmentSelectWraps.forEach((wrap) => {
    const select = wrap.querySelector("select");
    const button = wrap.querySelector(".appointment-select-button");
    const valueLabel = wrap.querySelector(".appointment-select-value");
    const menu = wrap.querySelector(".appointment-select-menu");

    if (!select || !button || !valueLabel || !menu) {
        return;
    }

    menu.innerHTML = "";

    Array.from(select.options).forEach((option, index) => {
        if (option.disabled && index === 0) {
            return;
        }

        const optionButton = document.createElement("button");
        optionButton.type = "button";
        optionButton.className = "appointment-select-option";
        optionButton.setAttribute("role", "option");
        optionButton.setAttribute("data-value", option.value);
        optionButton.textContent = option.textContent;

        if (option.selected) {
            optionButton.classList.add("is-selected");
        }

        optionButton.addEventListener("click", () => {
            select.value = option.value;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            valueLabel.textContent = option.textContent;
            button.classList.remove("is-placeholder");
            closeAppointmentSelects();
        });

        menu.appendChild(optionButton);
    });

    const syncSelectedState = () => {
        const selectedOption = select.options[select.selectedIndex];
        const isPlaceholder = !selectedOption || !selectedOption.value;

        valueLabel.textContent = selectedOption ? selectedOption.textContent : valueLabel.textContent;
        button.classList.toggle("is-placeholder", isPlaceholder);

        menu.querySelectorAll(".appointment-select-option").forEach((optionButton) => {
            optionButton.classList.toggle("is-selected", optionButton.getAttribute("data-value") === select.value);
        });
    };

    syncSelectedState();

    button.addEventListener("click", (event) => {
        event.preventDefault();
        const shouldOpen = !wrap.classList.contains("is-open");
        closeAppointmentSelects();
        wrap.classList.toggle("is-open", shouldOpen);
        button.setAttribute("aria-expanded", String(shouldOpen));
    });

    select.addEventListener("change", syncSelectedState);
});

document.addEventListener("click", (event) => {
    const clickedInsideSelect = event.target.closest("[data-appointment-select]");

    if (!clickedInsideSelect) {
        closeAppointmentSelects();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeAppointmentSelects();
    }
});

/*==============================
    HOME 2 FAQ ACCORDION
==============================*/

const home2FaqAccordion = document.querySelector("[data-home2-faq]");

if (home2FaqAccordion) {
    const faqItems = Array.from(home2FaqAccordion.querySelectorAll(".home2-faq-item"));

    function setFaqPanelState(item, isOpen) {
        const button = item.querySelector(".home2-faq-question");
        const panel = item.querySelector(".home2-faq-panel");

        if (!button || !panel) {
            return;
        }

        item.classList.toggle("is-open", isOpen);
        button.setAttribute("aria-expanded", String(isOpen));
        panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : "0px";
    }

    function closeOtherFaqItems(activeItem) {
        faqItems.forEach((item) => {
            if (item !== activeItem) {
                setFaqPanelState(item, false);
            }
        });
    }

    faqItems.forEach((item) => {
        const button = item.querySelector(".home2-faq-question");
        const panel = item.querySelector(".home2-faq-panel");

        if (!button || !panel) {
            return;
        }

        button.addEventListener("click", () => {
            const isOpen = item.classList.contains("is-open");
            closeOtherFaqItems(item);
            setFaqPanelState(item, !isOpen);
        });
    });

    const syncOpenPanels = () => {
        faqItems.forEach((item) => {
            const panel = item.querySelector(".home2-faq-panel");
            if (panel && item.classList.contains("is-open")) {
                panel.style.maxHeight = `${panel.scrollHeight}px`;
            }
        });
    };

    window.addEventListener("resize", syncOpenPanels);
    faqItems.forEach((item) => setFaqPanelState(item, item.classList.contains("is-open")));
}

/*==============================
    SERVICE DETAIL FAQ ACCORDION
==============================*/

const serviceFaqAccordions = document.querySelectorAll("[data-service-faq]");

serviceFaqAccordions.forEach((accordion) => {
    const faqItems = Array.from(accordion.querySelectorAll(".service-faq-item"));

    function setFaqPanelState(item, isOpen) {
        const button = item.querySelector(".service-faq-question");
        const panel = item.querySelector(".service-faq-answer");

        if (!button || !panel) {
            return;
        }

        item.classList.toggle("is-open", isOpen);
        button.setAttribute("aria-expanded", String(isOpen));
        panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : "0px";
    }

    function closeOtherFaqItems(activeItem) {
        faqItems.forEach((item) => {
            if (item !== activeItem) {
                setFaqPanelState(item, false);
            }
        });
    }

    faqItems.forEach((item) => {
        const button = item.querySelector(".service-faq-question");
        const panel = item.querySelector(".service-faq-answer");

        if (!button || !panel) {
            return;
        }

        button.addEventListener("click", () => {
            const isOpen = item.classList.contains("is-open");
            closeOtherFaqItems(item);
            setFaqPanelState(item, !isOpen);
        });
    });

    const syncOpenPanels = () => {
        faqItems.forEach((item) => {
            const panel = item.querySelector(".service-faq-answer");

            if (panel && item.classList.contains("is-open")) {
                panel.style.maxHeight = `${panel.scrollHeight}px`;
            }
        });
    };

    window.addEventListener("resize", syncOpenPanels);
    faqItems.forEach((item) => setFaqPanelState(item, item.classList.contains("is-open")));
});
