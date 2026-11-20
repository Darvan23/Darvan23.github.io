/* Bug Hunt — a small hidden game on Darvan's portfolio.
   Click the bug button (bottom right), fly the ship, shoot every bug.
   Original artwork drawn on a canvas. No libraries. */
(() => {
    const TOTAL_BUGS = 12;
    const track = (n, d) => { if (window.dsTrack) window.dsTrack(n, d); };
    const T = (s) => (window.dsT ? window.dsT(s) : s);

    /* ---------- launcher button ---------- */
    const fab = document.createElement("button");
    fab.className = "bh-fab";
    fab.type = "button";
    fab.setAttribute("aria-label", "Start Bug Hunt: een mini-game");
    fab.innerHTML = `
        <svg viewBox="0 0 32 32" aria-hidden="true">
            <ellipse cx="16" cy="18" rx="7" ry="9" fill="currentColor"/>
            <path d="M16 9v18" stroke="#0b1233" stroke-width="1.6"/>
            <circle cx="16" cy="8" r="4" fill="currentColor"/>
            <path d="M13 5l-3-3M19 5l3-3M9 14H4M9 19H3M9 24l-4 3M23 14h5M23 19h6M23 24l4 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span class="bh-fab-label">Bug Hunt</span>`;
    document.body.appendChild(fab);

    /* ---------- overlay ---------- */
    const overlay = document.createElement("div");
    overlay.className = "bh-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
        <canvas class="bh-canvas"></canvas>
        <div class="bh-hud">
            <span class="bh-count">🪲 0/${TOTAL_BUGS}</span>
            <span class="bh-time">0:00</span>
            <button type="button" class="bh-close" aria-label="Stop Bug Hunt">✕</button>
        </div>
        <div class="bh-help">Schiet alle bugs weg!<small class="bh-help-keys"></small></div>
        <div class="bh-win" hidden>
            <strong>Bug-free! 🎉</strong>
            <p class="bh-win-time"></p>
            <div class="bh-win-actions">
                <button type="button" class="button button-primary bh-again">Opnieuw</button>
                <a class="button button-ghost" href="portofolio.html#games">Speel mijn echte games</a>
            </div>
        </div>`;
    document.body.appendChild(overlay);

    const canvas = overlay.querySelector(".bh-canvas");
    const ctx = canvas.getContext("2d");
    const hudCount = overlay.querySelector(".bh-count");
    const hudTime = overlay.querySelector(".bh-time");
    const help = overlay.querySelector(".bh-help");
    const win = overlay.querySelector(".bh-win");
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const setTexts = () => {
        overlay.querySelector(".bh-help").firstChild.nodeValue = T("Schiet alle bugs weg!");
        overlay.querySelector(".bh-help-keys").textContent = touch
            ? T("Sleep om te bewegen, je schiet automatisch")
            : T("← → of muis om te bewegen, spatie of klik om te schieten");
        overlay.querySelector(".bh-again").textContent = T("Opnieuw");
        overlay.querySelector(".bh-win .button-ghost").textContent = T("Speel mijn echte games");
    };
    setTexts();

    let W = 0, H = 0, dpr = 1;
    const resize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        canvas.style.width = W + "px"; canvas.style.height = H + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* ---------- game state ---------- */
    let running = false, raf = 0, last = 0, startTime = 0, killed = 0;
    let ship, bullets, bugs, sparks, keys, pointerX, fireCooldown, shootHeld;

    const COLORS = [
        ["#ff6b7a", "#8c1f3a"], ["#6ee7c4", "#16735a"], ["#ffd166", "#9a6b06"],
        ["#b8a6ff", "#4b3aa8"], ["#8fd3ff", "#1f5f8a"],
    ];

    const rand = (a, b) => a + Math.random() * (b - a);

    function spawnBugs() {
        bugs = [];
        for (let i = 0; i < TOTAL_BUGS; i++) {
            const [c1, c2] = COLORS[i % COLORS.length];
            bugs.push({
                x: rand(40, W - 40), y: rand(90, H * 0.62),
                a: rand(0, Math.PI * 2), speed: rand(30, 70) + i * 2,
                turn: 0, size: rand(13, 18), c1, c2, phase: rand(0, 10), alive: true,
            });
        }
    }

    function start() {
        setTexts();
        resize();
        overlay.hidden = false;
        document.documentElement.classList.add("bh-active");
        win.hidden = true;
        help.classList.remove("bh-hide");
        setTimeout(() => help.classList.add("bh-hide"), 2600);
        ship = { x: W / 2, y: H - 70, vx: 0 };
        bullets = []; sparks = []; keys = {}; pointerX = null;
        fireCooldown = 0; shootHeld = false; killed = 0;
        spawnBugs();
        updateHud();
        startTime = performance.now();
        last = startTime;
        running = true;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
        track("Bug hunt gestart", {});
    }

    function stop() {
        running = false;
        cancelAnimationFrame(raf);
        overlay.hidden = true;
        document.documentElement.classList.remove("bh-active");
        fab.focus();
    }

    function updateHud() {
        hudCount.textContent = `🪲 ${killed}/${TOTAL_BUGS}`;
        const s = Math.floor((performance.now() - startTime) / 1000);
        hudTime.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    }

    function finish() {
        running = false;
        const secs = (performance.now() - startTime) / 1000;
        overlay.querySelector(".bh-win-time").textContent = (window.dsLang && window.dsLang() === "en")
            ? `All ${TOTAL_BUGS} bugs squashed in ${secs.toFixed(1)} seconds.`
            : `Alle ${TOTAL_BUGS} bugs weg in ${secs.toFixed(1)} seconden.`;
        win.hidden = false;
        track("Bug hunt gewonnen", { seconden: Math.round(secs) });
        // let the last sparks fade out
        const fade = (t) => {
            const dt = Math.min(0.05, (t - last) / 1000); last = t;
            stepSparks(dt); draw();
            if (sparks.length && !running && !overlay.hidden) raf = requestAnimationFrame(fade);
        };
        raf = requestAnimationFrame(fade);
    }

    /* ---------- update ---------- */
    function loop(t) {
        const dt = Math.min(0.05, (t - last) / 1000);
        last = t;
        if (!running) return;

        // ship movement
        const accel = 2600, maxV = 620;
        if (keys.left) ship.vx -= accel * dt;
        if (keys.right) ship.vx += accel * dt;
        if (!keys.left && !keys.right) ship.vx *= Math.pow(0.0008, dt);
        if (pointerX !== null) ship.vx = (pointerX - ship.x) * 10;
        ship.vx = Math.max(-maxV * 1.6, Math.min(maxV * 1.6, ship.vx));
        ship.x = Math.max(24, Math.min(W - 24, ship.x + ship.vx * dt));
        ship.y = H - 70;

        // shooting
        fireCooldown -= dt;
        if ((shootHeld || touch) && fireCooldown <= 0) fire();

        bullets.forEach((b) => { b.y -= 900 * dt; });
        bullets = bullets.filter((b) => b.y > -20 && !b.hit);

        // bugs wander and bounce off the edges
        bugs.forEach((g) => {
            if (!g.alive) return;
            g.phase += dt * 12;
            g.turn += rand(-3, 3) * dt;
            g.turn *= 0.96;
            g.a += g.turn * dt * 3;
            g.x += Math.cos(g.a) * g.speed * dt;
            g.y += Math.sin(g.a) * g.speed * dt;
            if (g.x < 20 || g.x > W - 20) { g.a = Math.PI - g.a; g.x = Math.max(20, Math.min(W - 20, g.x)); }
            if (g.y < 70 || g.y > H * 0.72) { g.a = -g.a; g.y = Math.max(70, Math.min(H * 0.72, g.y)); }
            bullets.forEach((b) => {
                if (g.alive && !b.hit && Math.hypot(b.x - g.x, b.y - g.y) < g.size + 4) {
                    b.hit = true; g.alive = false; killed++;
                    burst(g.x, g.y, g.c1);
                    updateHud();
                }
            });
        });

        stepSparks(dt);
        if (Math.floor(t / 250) !== Math.floor((t - dt * 1000) / 250)) updateHud();
        draw();

        if (killed >= TOTAL_BUGS) { finish(); return; }
        raf = requestAnimationFrame(loop);
    }

    function fire() {
        bullets.push({ x: ship.x - 9, y: ship.y - 18 }, { x: ship.x + 9, y: ship.y - 18 });
        fireCooldown = touch ? 0.22 : 0.16;
    }

    function burst(x, y, color) {
        for (let i = 0; i < 18; i++) {
            const a = rand(0, Math.PI * 2), v = rand(80, 320);
            sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(0.4, 0.8), max: 0.8, color });
        }
    }

    function stepSparks(dt) {
        sparks.forEach((s) => { s.x += s.vx * dt; s.y += s.vy * dt; s.vx *= 0.92; s.vy *= 0.92; s.life -= dt; });
        sparks = sparks.filter((s) => s.life > 0);
    }

    /* ---------- drawing ---------- */
    function drawBug(g) {
        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.a + Math.PI / 2);
        const s = g.size;
        // legs
        ctx.strokeStyle = g.c2; ctx.lineWidth = 2; ctx.lineCap = "round";
        for (let i = -1; i <= 1; i++) {
            const wig = Math.sin(g.phase + i) * 3;
            ctx.beginPath(); ctx.moveTo(-s * 0.5, i * s * 0.45); ctx.lineTo(-s - 2, i * s * 0.55 + wig); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(s * 0.5, i * s * 0.45); ctx.lineTo(s + 2, i * s * 0.55 - wig); ctx.stroke();
        }
        // antennae
        ctx.beginPath(); ctx.moveTo(-3, -s * 0.9); ctx.quadraticCurveTo(-6, -s * 1.4, -9, -s * 1.5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(3, -s * 0.9); ctx.quadraticCurveTo(6, -s * 1.4, 9, -s * 1.5); ctx.stroke();
        // head
        ctx.fillStyle = g.c2;
        ctx.beginPath(); ctx.arc(0, -s * 0.8, s * 0.4, 0, Math.PI * 2); ctx.fill();
        // shell
        const grad = ctx.createRadialGradient(-s * 0.3, -s * 0.3, 2, 0, 0, s);
        grad.addColorStop(0, "#ffffff"); grad.addColorStop(0.25, g.c1); grad.addColorStop(1, g.c2);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.ellipse(0, 0, s * 0.72, s * 0.9, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(11,18,51,.55)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, -s * 0.85); ctx.lineTo(0, s * 0.9); ctx.stroke();
        // spots
        ctx.fillStyle = "rgba(11,18,51,.35)";
        [[-0.35, -0.1], [0.35, 0.15], [-0.25, 0.45]].forEach(([dx, dy]) => {
            ctx.beginPath(); ctx.arc(dx * s, dy * s, s * 0.12, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();
    }

    function drawShip() {
        const { x, y } = ship;
        const tilt = Math.max(-0.35, Math.min(0.35, ship.vx / 1800));
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(tilt);
        // engine flame
        const fl = 10 + Math.random() * 8;
        const flame = ctx.createLinearGradient(0, 14, 0, 14 + fl);
        flame.addColorStop(0, "#6ee7c4"); flame.addColorStop(1, "rgba(110,231,196,0)");
        ctx.fillStyle = flame;
        ctx.beginPath(); ctx.moveTo(-7, 14); ctx.lineTo(0, 14 + fl); ctx.lineTo(7, 14); ctx.fill();
        // wings
        ctx.fillStyle = "#4b3aa8";
        ctx.beginPath(); ctx.moveTo(-6, -2); ctx.lineTo(-24, 14); ctx.lineTo(-6, 12); ctx.fill();
        ctx.beginPath(); ctx.moveTo(6, -2); ctx.lineTo(24, 14); ctx.lineTo(6, 12); ctx.fill();
        // body
        const body = ctx.createLinearGradient(-10, -24, 10, 16);
        body.addColorStop(0, "#f3f5ff"); body.addColorStop(0.5, "#8f9cff"); body.addColorStop(1, "#b8a6ff");
        ctx.fillStyle = body;
        ctx.beginPath(); ctx.moveTo(0, -26); ctx.quadraticCurveTo(12, -6, 10, 16); ctx.lineTo(-10, 16); ctx.quadraticCurveTo(-12, -6, 0, -26); ctx.fill();
        // cockpit
        ctx.fillStyle = "#0b1233";
        ctx.beginPath(); ctx.ellipse(0, -8, 4, 7, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.7)";
        ctx.beginPath(); ctx.ellipse(-1.2, -10, 1.2, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        // faint scan grid so the game layer is visible over the page
        ctx.fillStyle = "rgba(7,13,36,.28)";
        ctx.fillRect(0, 0, W, H);
        bugs.forEach((g) => g.alive && drawBug(g));
        ctx.fillStyle = "#6ee7c4";
        ctx.shadowColor = "#6ee7c4"; ctx.shadowBlur = 10;
        bullets.forEach((b) => { ctx.fillRect(b.x - 1.5, b.y - 9, 3, 14); });
        ctx.shadowBlur = 0;
        sparks.forEach((s) => {
            ctx.globalAlpha = Math.max(0, s.life / s.max);
            ctx.fillStyle = s.color;
            ctx.beginPath(); ctx.arc(s.x, s.y, 2.6, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;
        if (ship) drawShip();
    }

    /* ---------- input ---------- */
    fab.addEventListener("click", start);
    overlay.querySelector(".bh-close").addEventListener("click", stop);
    overlay.querySelector(".bh-again").addEventListener("click", start);
    window.addEventListener("resize", () => { if (!overlay.hidden) resize(); });

    window.addEventListener("keydown", (e) => {
        if (overlay.hidden) return;
        if (e.key === "Escape") { stop(); return; }
        if (!running) return;
        if (["ArrowLeft", "a", "A"].includes(e.key)) { keys.left = true; pointerX = null; e.preventDefault(); }
        if (["ArrowRight", "d", "D"].includes(e.key)) { keys.right = true; pointerX = null; e.preventDefault(); }
        if (e.key === " " || e.key === "ArrowUp") { shootHeld = true; e.preventDefault(); }
    });
    window.addEventListener("keyup", (e) => {
        if (["ArrowLeft", "a", "A"].includes(e.key)) keys.left = false;
        if (["ArrowRight", "d", "D"].includes(e.key)) keys.right = false;
        if (e.key === " " || e.key === "ArrowUp") shootHeld = false;
    });

    canvas.addEventListener("pointermove", (e) => { if (running) pointerX = e.clientX; });
    canvas.addEventListener("pointerdown", (e) => {
        if (!running) return;
        pointerX = e.clientX;
        if (!touch) { shootHeld = true; fire(); }
    });
    window.addEventListener("pointerup", () => { if (!touch) shootHeld = false; });
    canvas.addEventListener("pointerleave", () => { if (!touch) { pointerX = null; shootHeld = false; } });
})();
