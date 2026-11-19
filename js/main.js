/* Darvan Suleiman — portfolio interactions
   - 3D project ring (auto-spin, drag/swipe, keyboard)
   - 3D tilt + light glare on project cards
   - Scroll reveals for project grids and skill bars
   - 3D controller that follows the mouse
   Everything respects prefers-reduced-motion. */

(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    /* ---------- 3D project ring ---------- */
    const stage = document.querySelector(".ring-stage");
    if (stage) {
        const ring = stage.querySelector(".ring");
        const items = [...ring.querySelectorAll(".ring-item")];
        const step = 360 / items.length;

        const layout = () => {
            const w = items[0].getBoundingClientRect().width || 220;
            // distance so cards don't overlap, plus breathing room
            const r = Math.round((w / 2) / Math.tan(Math.PI / items.length) * 1.12);
            items.forEach((el, i) => {
                el.style.setProperty("--a", `${i * step}deg`);
                el.style.setProperty("--r", `${r}px`);
            });
        };
        layout();
        window.addEventListener("resize", layout);

        let angle = 0;
        let velocity = reduceMotion ? 0 : -0.12; // degrees per frame
        const baseSpeed = velocity;
        let dragging = false;
        let hovered = false;
        let lastX = 0;
        let moved = 0;
        let visible = true;

        const render = () => ring.style.setProperty("--ry", `${angle}deg`);

        const tick = () => {
            if (visible && !dragging) {
                const target = hovered ? 0 : baseSpeed;
                velocity += (target - velocity) * 0.04;
                angle += velocity;
                render();
            }
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);

        new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stage);

        stage.addEventListener("pointerdown", (e) => {
            dragging = true;
            moved = 0;
            lastX = e.clientX;
            stage.classList.add("dragging");
            stage.setPointerCapture(e.pointerId);
        });

        stage.addEventListener("pointermove", (e) => {
            if (!dragging) return;
            const dx = e.clientX - lastX;
            lastX = e.clientX;
            moved += Math.abs(dx);
            velocity = dx * 0.25;
            angle += velocity;
            render();
        });

        const endDrag = () => {
            dragging = false;
            stage.classList.remove("dragging");
        };
        stage.addEventListener("pointerup", endDrag);
        stage.addEventListener("pointercancel", endDrag);

        // a drag should not open the project under the cursor
        stage.addEventListener("click", (e) => {
            if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
        }, true);

        stage.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") hovered = true; });
        stage.addEventListener("pointerleave", () => { hovered = false; });

        // keyboard: focusing a card turns it to the front
        items.forEach((el, i) => {
            el.addEventListener("focus", () => {
                hovered = true;
                angle = -i * step;
                render();
            });
            el.addEventListener("blur", () => { hovered = false; });
        });
    }

    /* ---------- 3D tilt on project cards ---------- */
    if (finePointer && !reduceMotion) {
        document.querySelectorAll(".project-card").forEach((card) => {
            const max = card.classList.contains("featured") ? 4 : 7;
            card.addEventListener("pointermove", (e) => {
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                card.classList.add("is-tilting");
                card.style.setProperty("--ry", `${(px - 0.5) * max * 2}deg`);
                card.style.setProperty("--rx", `${(0.5 - py) * max * 2}deg`);
                card.style.setProperty("--mx", `${px * 100}%`);
                card.style.setProperty("--my", `${py * 100}%`);
            });
            card.addEventListener("pointerleave", () => {
                card.classList.remove("is-tilting");
                card.style.setProperty("--rx", "0deg");
                card.style.setProperty("--ry", "0deg");
            });
        });
    }

    /* ---------- Reveal on scroll ---------- */
    const toReveal = document.querySelectorAll(".reveal, .skill-group");
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        toReveal.forEach((el) => io.observe(el));
    } else {
        toReveal.forEach((el) => el.classList.add("in-view"));
    }

    /* ---------- 3D controller follows the mouse ---------- */
    const padArea = document.querySelector(".gamer");
    const pad = document.querySelector(".pad");
    if (padArea && pad && finePointer && !reduceMotion) {
        const sticks = pad.querySelectorAll(".pad-stick");
        padArea.addEventListener("pointermove", (e) => {
            const r = padArea.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            pad.style.setProperty("--ty", `${px * 50}deg`);
            pad.style.setProperty("--tx", `${18 - py * 34}deg`);
            sticks.forEach((s) => {
                s.style.setProperty("--sx", `${px * 10}px`);
                s.style.setProperty("--sy", `${py * 10}px`);
            });
        });
        padArea.addEventListener("pointerleave", () => {
            pad.style.setProperty("--ty", "-22deg");
            pad.style.setProperty("--tx", "18deg");
            sticks.forEach((s) => { s.style.setProperty("--sx", "0px"); s.style.setProperty("--sy", "0px"); });
        });
    }
})();
