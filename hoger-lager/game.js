/* Hoger of Lager? — guess if the next product costs more or less.
   Original idea and first version by Darvan (school project), rebuilt as a full game. */
(() => {
    /* ---------- products: rough Dutch prices (2026), just for fun ---------- */
    const ITEMS = [
        ["🍞", "Brood van de bakker", 3],
        ["☕", "Kop koffie", 3.5],
        ["🥛", "Liter melk", 1.3],
        ["🍕", "Pizza laten bezorgen", 16],
        ["🍔", "Fastfood menu", 11],
        ["🎬", "Bioscoopkaartje", 14],
        ["🛒", "Weekboodschappen (1 persoon)", 75],
        ["⛽", "Volle tank benzine (50 liter)", 100],
        ["🚲", "Nieuwe stadsfiets", 650],
        ["🛴", "Elektrische step", 450],
        ["📱", "Topmodel smartphone", 1250],
        ["🎮", "Nieuwe gameconsole", 550],
        ["🕹️", "Extra controller", 75],
        ["💻", "Laptop voor school", 900],
        ["🎧", "Noise cancelling koptelefoon", 330],
        ["⌚", "Smartwatch", 300],
        ["📺", "Tv van 55 inch", 600],
        ["📷", "Drone met camera", 500],
        ["👟", "Sneakers", 130],
        ["👖", "Spijkerbroek", 80],
        ["🧥", "Winterjas", 190],
        ["🎒", "Rugzak", 60],
        ["🕶️", "Zonnebril", 30],
        ["⚽", "Voetbal", 30],
        ["🎸", "Gitaar voor beginners", 160],
        ["🛹", "Skateboard", 90],
        ["🪑", "Gamestoel", 250],
        ["🛋️", "Driezitsbank", 950],
        ["🧊", "Koelkast", 700],
        ["🫧", "Wasmachine", 550],
        ["🛏️", "Matras", 450],
        ["🚗", "Tweedehands auto", 7500],
        ["🚙", "Nieuwe kleine auto", 19000],
        ["⚡", "Nieuwe elektrische auto", 38000],
        ["🏠", "Gemiddeld huis in Nederland", 460000],
        ["🏢", "Huur studio in Rotterdam (per maand)", 1100],
        ["✈️", "Vliegticket Amsterdam - Londen", 120],
        ["🏖️", "Week all-inclusive vakantie", 850],
        ["💍", "Diamanten ring", 3500],
        ["⌛", "Gouden horloge", 2800],
        ["💪", "Sportschool (per maand)", 35],
        ["📺", "Streamingabonnement (per maand)", 13],
        ["🚌", "OV-dagkaart", 22],
        ["🎓", "Rijlessen (20 lessen)", 1300],
        ["🐕", "Puppy van de fokker", 1200],
        ["🌹", "Bos rozen", 25],
        ["🎂", "Verjaardagstaart", 35],
        ["🪴", "Kamerplant", 20],
    ].map(([emoji, name, price]) => ({ emoji, name, price }));

    /* ---------- state ---------- */
    const $ = (id) => document.getElementById(id);
    const screens = { start: $("start"), game: $("game"), over: $("over") };
    const ROUND_TIME = 10;
    let a, b, lives, score, round, streak, bestStreak, correct, used, timerRaf, deadline, locked;
    let best = Number(localStorage.getItem("hl-best") || 0);
    let muted = localStorage.getItem("hl-muted") === "1";
    const track = (n, d) => { try { if (window.umami) window.umami.track(n, d); } catch (_) {} };

    /* ---------- helpers ---------- */
    const euro = (n) => "€ " + n.toLocaleString("nl-NL", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
    const show = (name) => Object.entries(screens).forEach(([k, el]) => { el.hidden = k !== name; });

    function pickNext(current) {
        // early rounds: prices far apart; later: closer together (harder)
        const minRatio = round < 4 ? 2.2 : round < 8 ? 1.6 : round < 14 ? 1.3 : 1.12;
        const pool = ITEMS.filter((it) => it !== current && !used.has(it.name));
        const fair = pool.filter((it) => {
            const r = Math.max(it.price, current.price) / Math.min(it.price, current.price);
            return r >= minRatio;
        });
        const list = fair.length ? fair : pool.length ? pool : ITEMS.filter((it) => it !== current);
        const next = list[Math.floor(Math.random() * list.length)];
        used.add(next.name);
        if (used.size > ITEMS.length - 5) used = new Set([next.name]);
        return next;
    }

    function renderLives() {
        document.querySelector(".lives").innerHTML = [0, 1, 2]
            .map((i) => `<span class="heart${i < lives ? "" : " lost"}">❤</span>`).join("");
    }

    function renderCombo() {
        const m = multiplier();
        const el = $("combo");
        el.hidden = m === 1;
        el.textContent = `🔥 x${m}`;
    }

    const multiplier = () => (streak >= 6 ? 3 : streak >= 3 ? 2 : 1);

    function setCard(prefix, item, showPrice) {
        $(prefix + "-emoji").textContent = item.emoji;
        $(prefix + "-name").textContent = item.name;
        $(prefix + "-price").textContent = showPrice ? euro(item.price) : "€ ???";
    }

    /* ---------- sound (tiny Web Audio beeps) ---------- */
    let ac;
    function beep(freqs, type = "sine", dur = 0.12) {
        if (muted) return;
        try {
            ac = ac || new (window.AudioContext || window.webkitAudioContext)();
            freqs.forEach((f, i) => {
                const o = ac.createOscillator(), g = ac.createGain();
                o.type = type; o.frequency.value = f;
                const t = ac.currentTime + i * dur;
                g.gain.setValueAtTime(0.0001, t);
                g.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
                g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
                o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + 0.02);
            });
        } catch (_) {}
    }
    const sfxGood = () => beep([660, 880], "triangle");
    const sfxBad = () => beep([220, 160], "sawtooth", 0.16);
    const sfxRecord = () => beep([523, 659, 784, 1046], "triangle", 0.1);

    $("mute").textContent = muted ? "🔇" : "🔊";
    $("mute").addEventListener("click", () => {
        muted = !muted;
        localStorage.setItem("hl-muted", muted ? "1" : "0");
        $("mute").textContent = muted ? "🔇" : "🔊";
        $("mute").setAttribute("aria-label", muted ? "Geluid aan" : "Geluid uit");
    });

    /* ---------- game flow ---------- */
    function startGame() {
        lives = 3; score = 0; round = 1; streak = 0; bestStreak = 0; correct = 0; used = new Set();
        a = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        used.add(a.name);
        b = pickNext(a);
        $("score").textContent = "0";
        renderLives(); renderCombo();
        show("game");
        newRound(true);
        track("Hoger Lager gestart", {});
    }

    function newRound(first) {
        locked = false;
        $("round").textContent = round;
        setCard("a", a, true);
        setCard("b", b, false);
        const cardB = $("card-b");
        cardB.classList.remove("good", "bad", "reveal");
        if (!first) {
            cardB.classList.remove("slide-in"); void cardB.offsetWidth; cardB.classList.add("slide-in");
        }
        $("choices").classList.remove("hide");
        $("toast").textContent = "";
        startTimer();
    }

    function startTimer() {
        cancelAnimationFrame(timerRaf);
        deadline = performance.now() + ROUND_TIME * 1000;
        const fill = $("timer-fill");
        const tick = (t) => {
            const left = Math.max(0, deadline - t) / (ROUND_TIME * 1000);
            fill.style.transform = `scaleX(${left})`;
            fill.classList.toggle("low", left < 0.3);
            if (left <= 0) { answer(null); return; }
            if (!locked) timerRaf = requestAnimationFrame(tick);
        };
        timerRaf = requestAnimationFrame(tick);
    }

    function countUp(el, target, done) {
        const t0 = performance.now(), dur = 700;
        const step = (t) => {
            const p = Math.min(1, (t - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            const v = target * eased;
            el.textContent = euro(target % 1 ? Math.round(v * 100) / 100 : Math.round(v));
            if (p < 1) requestAnimationFrame(step); else { el.textContent = euro(target); done && done(); }
        };
        requestAnimationFrame(step);
    }

    function answer(guess) {
        if (locked) return;
        locked = true;
        cancelAnimationFrame(timerRaf);
        const secsLeft = Math.max(0, (deadline - performance.now()) / 1000);
        const isHigher = b.price >= a.price;
        const right = guess !== null && ((guess === "up" && isHigher) || (guess === "down" && !isHigher));
        const cardB = $("card-b");
        $("choices").classList.add("hide");
        cardB.classList.add("reveal");

        countUp($("b-price"), b.price, () => {
            if (right) {
                streak++; correct++;
                bestStreak = Math.max(bestStreak, streak);
                const pts = Math.round((10 + Math.ceil(secsLeft / 2)) * multiplier());
                score += pts;
                $("score").textContent = score;
                cardB.classList.add("good");
                $("toast").textContent = `Goed! +${pts}`;
                sfxGood();
            } else {
                streak = 0; lives--;
                renderLives();
                cardB.classList.add("bad");
                $("toast").textContent = guess === null ? "Te laat!" : "Helaas, fout!";
                sfxBad();
            }
            renderCombo();
            setTimeout(() => {
                if (lives <= 0) return gameOver();
                round++;
                a = b;
                b = pickNext(a);
                newRound(false);
            }, 1200);
        });
    }

    function gameOver() {
        const isRecord = score > best;
        if (isRecord) { best = score; localStorage.setItem("hl-best", String(best)); }
        $("final-score").textContent = score;
        $("stat-rounds").textContent = correct;
        $("stat-streak").textContent = bestStreak;
        $("stat-best").textContent = best;
        $("best-start").textContent = best;
        $("new-record").hidden = !isRecord;
        $("over-kicker").textContent = isRecord ? "Wat een score!" : "Game over";
        show("over");
        if (isRecord && score > 0) { sfxRecord(); confetti(); }
        track("Hoger Lager klaar", { score, rondes: correct, record: isRecord ? "ja" : "nee" });
    }

    /* ---------- confetti on a new record ---------- */
    function confetti() {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const c = $("confetti"), ctx = c.getContext("2d");
        c.width = innerWidth; c.height = innerHeight;
        const colors = ["#8f9cff", "#b8a6ff", "#6ee7c4", "#ffd166", "#ff6b7a"];
        const bits = Array.from({ length: 140 }, () => ({
            x: Math.random() * c.width, y: -20 - Math.random() * c.height * 0.4,
            vx: (Math.random() - 0.5) * 4, vy: 2 + Math.random() * 4,
            r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
            w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, col: colors[Math.floor(Math.random() * colors.length)],
        }));
        const t0 = performance.now();
        const frame = (t) => {
            ctx.clearRect(0, 0, c.width, c.height);
            bits.forEach((p) => {
                p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.r += p.vr;
                ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
                ctx.fillStyle = p.col; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
            });
            if (t - t0 < 3500) requestAnimationFrame(frame); else ctx.clearRect(0, 0, c.width, c.height);
        };
        requestAnimationFrame(frame);
    }

    /* ---------- input ---------- */
    $("start-btn").addEventListener("click", startGame);
    $("again-btn").addEventListener("click", startGame);
    $("higher").addEventListener("click", () => answer("up"));
    $("lower").addEventListener("click", () => answer("down"));
    window.addEventListener("keydown", (e) => {
        if (!screens.game.hidden) {
            if (e.key === "ArrowUp" || e.key.toLowerCase() === "h") { e.preventDefault(); answer("up"); }
            if (e.key === "ArrowDown" || e.key.toLowerCase() === "l") { e.preventDefault(); answer("down"); }
        } else if (e.key === "Enter" && (!screens.start.hidden || !screens.over.hidden)) {
            startGame();
        }
    });

    $("best-start").textContent = best;
    lives = 3;
    renderLives();
    window.addEventListener("load", () => setTimeout(() => track("Game geopend", { game: "Hoger Lager" }), 1200));
})();
