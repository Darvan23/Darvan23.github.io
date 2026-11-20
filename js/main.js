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

/* ==========================================================
   3D components: spin panels, project deck, skills globe
   ========================================================== */
(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    /* ---------- Grab-and-spin: drag to rotate, release snaps front/back ---------- */
    function makeSpin(spin, { onRotate } = {}) {
        const inner = spin.querySelector(".spin-inner");
        let rx = 0, ry = 0, vx = 0, vy = 0;
        let down = false, startX = 0, startY = 0, lastX = 0, lastY = 0, moved = 0, raf = null;

        const apply = () => {
            inner.style.setProperty("--srx", `${rx}deg`);
            inner.style.setProperty("--sry", `${ry}deg`);
            const norm = ((ry % 360) + 360) % 360;
            const facingBack = norm > 90 && norm < 270;
            spin.classList.toggle("flipped", facingBack);
            if (onRotate) onRotate(rx, ry);
        };

        const settle = () => {
            // glide with inertia, then ease to the nearest face (0 or 180 deg)
            const target = Math.round((ry + vy * 8) / 180) * 180;
            const step = () => {
                vy *= 0.9;
                ry += vy;
                ry += (target - ry) * 0.12;
                rx += (0 - rx) * 0.14;
                apply();
                if (Math.abs(target - ry) > 0.2 || Math.abs(rx) > 0.2) raf = requestAnimationFrame(step);
                else { ry = target; rx = 0; apply(); raf = null; spin.classList.remove("moving"); }
            };
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(step);
        };

        spin.addEventListener("pointerdown", (e) => {
            if (e.button !== undefined && e.button !== 0) return;
            down = true; moved = 0;
            startX = lastX = e.clientX; startY = lastY = e.clientY;
            cancelAnimationFrame(raf);
        });

        window.addEventListener("pointermove", (e) => {
            if (!down) return;
            const dx = e.clientX - lastX, dy = e.clientY - lastY;
            lastX = e.clientX; lastY = e.clientY;
            moved = Math.max(moved, Math.hypot(e.clientX - startX, e.clientY - startY));
            if (moved < 6) return;
            if (!spin.classList.contains("grabbing")) {
                spin.classList.add("grabbing", "moving");
                try { spin.setPointerCapture(e.pointerId); } catch (_) {}
            }
            vy = dx * 0.55;
            ry += vy;
            if (e.pointerType === "mouse") rx = Math.max(-35, Math.min(35, rx - dy * 0.35));
            apply();
        });

        const up = () => {
            if (!down) return;
            down = false;
            spin.classList.remove("grabbing");
            if (moved >= 6 || rx !== 0 || ry % 180 !== 0) settle();
        };
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", up);

        // a drag must not follow the link underneath
        spin.addEventListener("click", (e) => {
            if (moved >= 6) { e.preventDefault(); e.stopPropagation(); }
        }, true);

        spin.flip = () => { vy = 0; spin.classList.add("moving"); ry = Math.round(ry / 180) * 180 + 180; settle(); };
        spin.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                if (spin.dataset.flipOnClick !== undefined) { e.preventDefault(); spin.flip(); }
            }
        });
        if (spin.dataset.flipOnClick !== undefined) {
            spin.addEventListener("click", () => { if (moved < 6) spin.flip(); });
        }
        apply();
        return spin;
    }

    /* ---------- Turn every project screenshot into a spin panel ---------- */
    document.querySelectorAll(".project-card .project-thumb").forEach((thumb) => {
        const card = thumb.closest(".project-card");
        const title = card.querySelector("h3")?.textContent.trim() || "";
        const kind = card.querySelector(".kind")?.textContent.trim() || "";
        const tags = card.querySelector(".tags")?.cloneNode(true);

        const spin = document.createElement("div");
        spin.className = "spin project-spin";
        const inner = document.createElement("div");
        inner.className = "spin-inner";

        [-2, -4, -6].forEach((z) => {
            const edge = document.createElement("div");
            edge.className = "spin-edge";
            edge.style.setProperty("--z", `${z}px`);
            edge.setAttribute("aria-hidden", "true");
            inner.appendChild(edge);
        });

        thumb.parentNode.insertBefore(spin, thumb);
        thumb.classList.add("spin-face");
        inner.appendChild(thumb);

        const back = document.createElement("div");
        back.className = "spin-face spin-back project-back";
        back.setAttribute("aria-hidden", "true");
        back.innerHTML = `<span class="kind"></span><strong></strong>`;
        back.querySelector(".kind").textContent = kind;
        back.querySelector("strong").textContent = title;
        if (tags) back.appendChild(tags);
        const small = document.createElement("small");
        small.textContent = "Sleep terug om de screenshot te zien";
        back.appendChild(small);
        inner.appendChild(back);

        spin.appendChild(inner);
        const hint = document.createElement("span");
        hint.className = "spin-hint";
        hint.textContent = "↻ Sleep om te draaien";
        spin.appendChild(hint);

        makeSpin(spin);
    });

    /* ---------- Business card ---------- */
    const biz = document.querySelector(".biz");
    if (biz) {
        makeSpin(biz, {
            onRotate: (rx, ry) => biz.style.setProperty("--sheen", String(((ry % 360) / 360) * 80 - 20)),
        });
    }

    /* ---------- Project deck follows the mouse ---------- */
    const deckStage = document.querySelector(".deck-stage");
    if (deckStage && finePointer && !reduceMotion) {
        const deck = deckStage.querySelector(".deck");
        window.addEventListener("pointermove", (e) => {
            const px = e.clientX / window.innerWidth - 0.5;
            const py = e.clientY / window.innerHeight - 0.5;
            deck.style.setProperty("--dx", `${-26 + px * 22}deg`);
            deck.style.setProperty("--dy", `${10 - py * 14}deg`);
        });
    }

    /* ---------- Skills globe ---------- */
    const globe = document.querySelector(".globe");
    if (globe) {
        const tags = [...globe.querySelectorAll(".globe-tag")];
        const n = tags.length;
        // spread points evenly over a sphere (Fibonacci sphere)
        const pts = tags.map((_, i) => {
            const y = 1 - (i / (n - 1)) * 2;
            const r = Math.sqrt(1 - y * y);
            const t = Math.PI * (3 - Math.sqrt(5)) * i;
            return { x: Math.cos(t) * r, y, z: Math.sin(t) * r };
        });

        let ax = 0.0, ay = 0.0;          // current angles
        let vx = 0.0016, vy = reduceMotion ? 0 : 0.0045; // auto spin
        const base = { vx, vy };
        let down = false, lx = 0, ly = 0, visible = true;

        const draw = () => {
            const R = Math.min(globe.clientWidth, globe.clientHeight) * 0.42;
            const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
            pts.forEach((p, i) => {
                // rotate around Y then X
                const x1 = p.x * cy + p.z * sy;
                const z1 = -p.x * sy + p.z * cy;
                const y2 = p.y * cx - z1 * sx;
                const z2 = p.y * sx + z1 * cx;
                const depth = (z2 + 1) / 2; // 0 back .. 1 front
                const scale = 0.6 + depth * 0.55;
                const el = tags[i];
                el.style.transform = `translate(-50%, -50%) translate3d(${x1 * R}px, ${y2 * R}px, 0) scale(${scale})`;
                el.style.opacity = String(0.25 + depth * 0.75);
                el.style.zIndex = String(Math.round(depth * 100));
                el.style.filter = depth < 0.35 ? "blur(1px)" : "none";
            });
        };

        const loop = () => {
            if (visible) {
                if (!down) {
                    vx += (base.vx - vx) * 0.02;
                    vy += (base.vy - vy) * 0.02;
                }
                ax += vx; ay += vy;
                draw();
            }
            requestAnimationFrame(loop);
        };
        draw();
        requestAnimationFrame(loop);
        new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(globe);

        globe.addEventListener("pointerdown", (e) => {
            down = true; lx = e.clientX; ly = e.clientY;
            globe.classList.add("grabbing");
            try { globe.setPointerCapture(e.pointerId); } catch (_) {}
        });
        globe.addEventListener("pointermove", (e) => {
            if (!down) return;
            vy = (e.clientX - lx) * 0.004;
            vx = -(e.clientY - ly) * 0.004;
            lx = e.clientX; ly = e.clientY;
        });
        const end = () => { down = false; globe.classList.remove("grabbing"); };
        globe.addEventListener("pointerup", end);
        globe.addEventListener("pointercancel", end);
    }

    /* ---------- Tilt for skill groups and steps ---------- */
    if (finePointer && !reduceMotion) {
        document.querySelectorAll(".skill-group, .step").forEach((card) => {
            card.addEventListener("pointermove", (e) => {
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                card.classList.add("is-tilting");
                card.style.setProperty("--ry", `${(px - 0.5) * 10}deg`);
                card.style.setProperty("--rx", `${(0.5 - py) * 10}deg`);
            });
            card.addEventListener("pointerleave", () => {
                card.classList.remove("is-tilting");
                card.style.setProperty("--rx", "0deg");
                card.style.setProperty("--ry", "0deg");
            });
        });
    }
})();

/* ==========================================================
   Analytics events (Umami). Only sends anything once the
   Umami script is on the page; otherwise this does nothing.
   ========================================================== */
(() => {
    const track = (name, data) => {
        try { if (window.umami && typeof window.umami.track === "function") window.umami.track(name, data); } catch (_) {}
    };
    window.dsTrack = track;

    const pagina = () => (location.pathname.split("/").pop() || "index.html").replace(".html", "") || "index";
    const label = (el) => (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40);

    document.addEventListener("click", (e) => {
        // buttons and the CV menu toggle
        const btn = e.target.closest("button, summary");
        if (btn && !e.target.closest("a")) {
            if (btn.tagName === "SUMMARY") track("CV menu geopend", { pagina: pagina() });
            else if (btn.type === "submit") track("Contactformulier verzenden", {});
            else track("Knop klik", { knop: label(btn), pagina: pagina() });
            return;
        }
        const a = e.target.closest("a");
        if (!a) return;
        if (a.closest(".nav")) { track("Menu klik", { naar: label(a), pagina: pagina() }); return; }
        if (a.classList.contains("brand")) { track("Logo klik", { pagina: pagina() }); return; }
        const href = a.getAttribute("href") || "";
        const card = a.closest(".project-card");
        const project = card ? (card.querySelector("h3")?.textContent || "").trim() : undefined;

        if (href.includes("cv/")) track("CV downloaden", { taal: href.includes("-nl") ? "NL" : "EN" });
        else if (a.closest(".ring-item")) track("3D ring klik", { project: a.querySelector("span")?.textContent.trim() });
        else if (a.closest(".deck-card")) track("Deck klik", {});
        else if (a.classList.contains("button-play") || a.querySelector(".play-overlay")) track("Game spelen", { game: project });
        else if (href.startsWith("mailto:")) track("E-mail klik", { pagina: pagina() });
        else if (href.startsWith("tel:")) track("Telefoon klik", {});
        else if (/linkedin\.com/.test(href)) track("Social klik", { site: "LinkedIn" });
        else if (/instagram\.com/.test(href)) track("Social klik", { site: "Instagram" });
        else if (/github\.com/.test(href)) track(card ? "Code bekijken" : "Social klik", card ? { project } : { site: "GitHub" });
        else if (card) track("Project openen", { project, knop: a.textContent.trim() || "afbeelding" });
        else track("Link klik", { link: label(a) || href, pagina: pagina() });
    }, true);

    // one event per page when someone plays with a 3D element
    const once = new Set();
    const trackOnce = (key, name, data) => { if (!once.has(key)) { once.add(key); track(name, data); } };

    const observeFlip = (el, cb) => new MutationObserver(() => { if (el.classList.contains("flipped")) cb(); })
        .observe(el, { attributes: true, attributeFilter: ["class"] });

    document.querySelectorAll(".project-spin").forEach((spin) => {
        const project = (spin.closest(".project-card")?.querySelector("h3")?.textContent || "").trim();
        observeFlip(spin, () => trackOnce("spin:" + project, "Project omgedraaid", { project }));
    });
    const biz = document.querySelector(".biz");
    if (biz) observeFlip(biz, () => trackOnce("biz", "Visitekaartje omgedraaid", {}));
    const globe = document.querySelector(".globe");
    if (globe) globe.addEventListener("pointerdown", () => trackOnce("globe", "Skills-bol gedraaid", {}));
    const ring = document.querySelector(".ring-stage");
    if (ring) ring.addEventListener("pointerdown", () => trackOnce("ring", "3D ring gedraaid", {}));
})();

/* ==========================================================
   Extra anonymous analytics: scroll depth, section views,
   time per section, contact form started/abandoned.
   Never sends names, e-mails, IPs or typed text.
   ========================================================== */
(() => {
    const track = (n, d) => { if (window.dsTrack) window.dsTrack(n, d); };
    const pagina = (location.pathname.split("/").pop() || "index.html").replace(".html", "") || "index";

    /* scroll depth: 25 / 50 / 75 / 100 %, each once per page view */
    const marks = [25, 50, 75, 100];
    const hit = new Set();
    const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max <= 0 ? 100 : Math.round((window.scrollY / max) * 100);
        marks.forEach((m) => {
            if (pct >= m && !hit.has(m)) { hit.add(m); track("Scroll diepte", { pagina, procent: m }); }
        });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* sections: name = the section's h2 (or h1 for the hero) */
    const sections = [...document.querySelectorAll("section")].map((el) => {
        const h = el.querySelector("h2, h1");
        return { el, name: (h ? (h.getAttribute("aria-label") || h.textContent) : el.id || "sectie").replace(/\s+/g, " ").trim().slice(0, 40), seen: false, ms: 0, since: null };
    });

    if ("IntersectionObserver" in window && sections.length) {
        const io = new IntersectionObserver((entries) => {
            const now = performance.now();
            entries.forEach((e) => {
                const s = sections.find((x) => x.el === e.target);
                if (!s) return;
                if (e.isIntersecting) {
                    if (!s.seen) { s.seen = true; track("Sectie bekeken", { pagina, sectie: s.name }); }
                    if (s.since === null) s.since = now;
                } else if (s.since !== null) {
                    s.ms += now - s.since; s.since = null;
                }
            });
        }, { threshold: 0.35 });
        sections.forEach((s) => io.observe(s.el));
    }

    /* contact form: started, and abandoned if left without sending */
    const form = document.getElementById("contactForm");
    let started = false, sent = false;
    if (form) {
        form.addEventListener("focusin", () => {
            if (!started) { started = true; track("Contactformulier begonnen", {}); }
        });
        form.addEventListener("submit", () => { sent = true; });
    }

    /* when the visitor leaves: time per section (2s or more) + abandoned form */
    let flushed = false;
    const flush = () => {
        if (flushed) return;
        flushed = true;
        const now = performance.now();
        sections.forEach((s) => {
            const total = s.ms + (s.since !== null ? now - s.since : 0);
            const sec = Math.round(total / 1000);
            if (sec >= 2) track("Tijd per sectie", { pagina, sectie: s.name, seconden: sec });
        });
        if (started && !sent) track("Contactformulier afgebroken", {});
    };
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });
    window.addEventListener("pagehide", flush);
})();

/* ---------- Game tiles: tilt toward mouse, tap to flip on touch ---------- */
(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const tiles = document.querySelectorAll(".game-tile");
    tiles.forEach((tile) => {
        const inner = tile.querySelector(".tile-inner");
        if (fine) {
            tile.addEventListener("pointermove", (e) => {
                if (tile.matches(":hover")) return; // hover already flips it
            });
        }
        tile.addEventListener("click", () => {
            if (!fine) tile.classList.toggle("flipped");
            if (window.dsTrack) window.dsTrack("Game-icoon bekeken", { game: tile.querySelector(".tile-front strong").textContent });
        });
        tile.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tile.classList.toggle("flipped"); }
        });
    });
    // whole row leans gently toward the mouse
    const row = document.querySelector(".game-tiles");
    if (row && fine && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        row.addEventListener("pointermove", (e) => {
            const r = row.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            tiles.forEach((t) => {
                t.style.setProperty("--ty", `${-14 + px * 30}deg`);
                t.style.setProperty("--tx", `${8 - py * 20}deg`);
            });
        });
        row.addEventListener("pointerleave", () => tiles.forEach((t) => { t.style.removeProperty("--ty"); t.style.removeProperty("--tx"); }));
    }
})();
