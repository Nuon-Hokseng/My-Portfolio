"use client";

import { useScrollAnimation } from "hooks/useScrollAnimation";
import { useEffect, useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";

/*
 * Tiny zero-dependency platformer with a scrolling camera and enemies.
 * Tiles: X/= solid · o coin · ^ spike · E enemy · P start · G goal
 * Levels are wider than the screen; the camera follows the player.
 * ponytail: per-axis AABB collision, naive but correct on a tile grid.
 */

const TILE = 30;
const ROWS = 18;
const VIEW_COLS = 32; // visible columns
const W = VIEW_COLS * TILE; // 960
const H = ROWS * TILE; // 540

// floaty feel: low gravity + matching jump so the arc is slow, not snappy
const GRAVITY = 0.34;
// Mario-like walk: ease up to a modest top speed, then friction back down
const MAXWALK = 2.4;
const ACCEL = 0.32;
const FRICTION = 0.28;
const JUMP = -10.2;
const FALL_MAX = 11;
const PW = 22;
const PH = 28;
const EW = 24;
const EH = 22;
const ESPEED = 0.8;

type Spec = {
  width: number;
  start: [number, number];
  goal: [number, number];
  ground: [number, number][]; // inclusive [startCol, endCol] floor segments on row 17
  platforms: [number, number, number][]; // [row, startCol, length]
  coins: [number, number][]; // [col, row]
  spikes: [number, number][]; // [col, row]
  enemies: [number, number][]; // [col, row]
};

function buildLevel(s: Spec): string[] {
  const grid: string[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: s.width }, () => " "),
  );
  for (const [a, b] of s.ground) for (let c = a; c <= b; c++) grid[17][c] = "X";
  for (const [r, c, len] of s.platforms) for (let i = 0; i < len; i++) grid[r][c + i] = "=";
  for (const [c, r] of s.coins) grid[r][c] = "o";
  for (const [c, r] of s.spikes) grid[r][c] = "^";
  for (const [c, r] of s.enemies) grid[r][c] = "E";
  grid[s.start[1]][s.start[0]] = "P";
  grid[s.goal[1]][s.goal[0]] = "G";
  return grid.map((row) => row.join(""));
}

const SPECS: Spec[] = [
  // Level 1 — warm up
  {
    width: 56,
    start: [1, 16],
    goal: [53, 16],
    ground: [[0, 18], [22, 55]], // pit cols 19-21 (3 wide)
    platforms: [[14, 8, 4], [14, 28, 4], [14, 44, 5]],
    coins: [[4, 16], [9, 13], [10, 13], [15, 16], [29, 13], [30, 13], [34, 16], [40, 16], [45, 13], [46, 13]],
    spikes: [[30, 16]],
    enemies: [[12, 16], [37, 16]],
  },
  // Level 2 — mind the gaps
  {
    width: 64,
    start: [1, 16],
    goal: [61, 16],
    ground: [[0, 15], [19, 33], [37, 63]], // pits 16-18 and 34-36
    platforms: [[14, 10, 4], [14, 24, 4], [14, 46, 5], [11, 40, 4]],
    coins: [[5, 16], [11, 13], [12, 13], [25, 13], [41, 10], [42, 10], [47, 13], [48, 13], [54, 16], [58, 16]],
    spikes: [[26, 16], [52, 16]],
    enemies: [[13, 16], [28, 16], [44, 16]],
  },
  // Level 3 — spikes, pits & a mob
  {
    width: 72,
    start: [1, 16],
    goal: [69, 16],
    ground: [[0, 11], [15, 27], [31, 45], [49, 71]], // pits 12-14, 28-30, 46-48
    platforms: [[14, 6, 3], [14, 20, 3], [14, 36, 4], [11, 54, 4], [14, 58, 4]],
    coins: [[7, 13], [21, 13], [37, 13], [38, 13], [55, 10], [56, 10], [59, 13], [60, 13], [33, 16], [64, 16]],
    spikes: [[9, 16], [24, 16], [42, 16], [55, 16]],
    enemies: [[17, 16], [34, 16], [40, 16], [62, 16]],
  },
];

const LEVELS = SPECS.map(buildLevel);

type Box = { x: number; y: number; vx: number; vy: number; onGround: boolean };
type Enemy = Box & { dir: number; alive: boolean };
type Particle = { x: number; y: number; vy: number; life: number; max: number; text: string; color: string };

function isSolid(map: string[], col: number, row: number) {
  if (col < 0 || col >= map[0].length) return true; // level edges are walls
  if (row < 0 || row >= ROWS) return false;
  const ch = map[row]?.[col];
  return ch === "X" || ch === "=";
}

function countCoins(map: string[]) {
  return map.reduce((n, row) => n + [...row].filter((c) => c === "o").length, 0);
}

// per-axis AABB resolution against solid tiles
function resolve(map: string[], b: Box, horizontal: boolean, w: number, h: number) {
  const c0 = Math.floor(b.x / TILE);
  const c1 = Math.floor((b.x + w - 1) / TILE);
  const r0 = Math.floor(b.y / TILE);
  const r1 = Math.floor((b.y + h - 1) / TILE);
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      if (!isSolid(map, c, r)) continue;
      if (horizontal) {
        if (b.vx > 0) b.x = c * TILE - w;
        else if (b.vx < 0) b.x = (c + 1) * TILE;
        b.vx = 0;
      } else {
        if (b.vy > 0) {
          b.y = r * TILE - h;
          b.onGround = true;
        } else if (b.vy < 0) {
          b.y = (r + 1) * TILE;
        }
        b.vy = 0;
      }
    }
  }
}

function spawnEnemies(map: string[]): Enemy[] {
  const list: Enemy[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < map[r].length; c++) {
      if (map[r][c] === "E") {
        list.push({
          x: c * TILE + (TILE - EW) / 2,
          y: r * TILE + (TILE - EH),
          vx: 0,
          vy: 0,
          onGround: false,
          dir: -1,
          alive: true,
        });
      }
    }
  }
  return list;
}

export default function GameSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState<"idle" | "playing" | "won">("idle");
  const [level, setLevel] = useState(0);
  const [coins, setCoins] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [sound, setSound] = useState(false);

  const keys = useRef({ left: false, right: false, jump: false });
  const statusRef = useRef(status);
  const levelRef = useRef(level);
  const player = useRef({ x: 0, y: 0, vx: 0, vy: 0, onGround: false, jumpLatch: false, face: 1 });
  const enemies = useRef<Enemy[]>([]);
  const collected = useRef<Set<string>>(new Set());
  const mapRef = useRef<string[]>(LEVELS[0]);
  const particles = useRef<Particle[]>([]);
  const soundRef = useRef(false);
  const audioRef = useRef<AudioContext | null>(null);

  statusRef.current = status;
  levelRef.current = level;
  soundRef.current = sound;

  // short WebAudio blip (muted unless the player turns sound on)
  const blip = (freq: number, dur = 0.08, type: OscillatorType = "square") => {
    const ac = audioRef.current;
    if (!soundRef.current || !ac) return;
    const o = ac.createOscillator();
    const gain = ac.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.connect(gain);
    gain.connect(ac.destination);
    gain.gain.setValueAtTime(0.05, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
    o.start();
    o.stop(ac.currentTime + dur);
  };

  // floating bit of text (e.g. "+1") that pops and fades
  const pop = (x: number, y: number, text: string, color: string) => {
    particles.current.push({ x, y, vy: -1.4, life: 36, max: 36, text, color });
  };

  const loadLevel = (idx: number) => {
    const map = LEVELS[idx];
    mapRef.current = map;
    collected.current = new Set();
    particles.current = [];
    setCoins(0);
    enemies.current = spawnEnemies(map);
    let sx = 1,
      sy = 16;
    for (let r = 0; r < ROWS; r++) {
      const c = map[r].indexOf("P");
      if (c >= 0) {
        sx = c;
        sy = r;
        break;
      }
    }
    player.current = {
      x: sx * TILE + (TILE - PW) / 2,
      y: sy * TILE + (TILE - PH),
      vx: 0,
      vy: 0,
      onGround: false,
      jumpLatch: false,
      face: 1,
    };
  };

  const start = () => {
    // create the audio context on this user gesture so sound can work later
    try {
      audioRef.current ??= new AudioContext();
      audioRef.current.resume();
    } catch {
      /* audio unsupported — game still runs silently */
    }
    setLevel(0);
    setDeaths(0);
    loadLevel(0);
    setStatus("playing");
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (statusRef.current !== "playing") return;
      const k = e.key.toLowerCase();
      if (["arrowleft", "a"].includes(k)) keys.current.left = true;
      else if (["arrowright", "d"].includes(k)) keys.current.right = true;
      else if (["arrowup", "w", " "].includes(k)) keys.current.jump = true;
      else return;
      e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["arrowleft", "a"].includes(k)) keys.current.left = false;
      else if (["arrowright", "d"].includes(k)) keys.current.right = false;
      else if (["arrowup", "w", " "].includes(k)) keys.current.jump = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    if (status !== "playing") return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    let raf = 0;

    const die = () => {
      blip(140, 0.25, "sawtooth");
      setDeaths((d) => d + 1);
      loadLevel(levelRef.current);
      raf = requestAnimationFrame(step);
    };

    const win = () => {
      blip(660, 0.12, "triangle");
      const next = levelRef.current + 1;
      if (next < LEVELS.length) {
        setLevel(next);
        loadLevel(next);
        raf = requestAnimationFrame(step);
      } else {
        setStatus("won");
      }
    };

    const step = () => {
      const map = mapRef.current;
      const worldW = map[0].length * TILE;
      const p = player.current;

      // ── player horizontal (accelerate, then friction — Mario-style) ──
      const dir = (keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0);
      if (dir !== 0) {
        p.vx = Math.max(-MAXWALK, Math.min(MAXWALK, p.vx + dir * ACCEL));
        p.face = dir;
      } else if (p.vx > 0) {
        p.vx = Math.max(0, p.vx - FRICTION);
      } else if (p.vx < 0) {
        p.vx = Math.min(0, p.vx + FRICTION);
      }
      p.x += p.vx;
      resolve(map, p, true, PW, PH);

      // ── player jump + gravity ──
      if (keys.current.jump && p.onGround && !p.jumpLatch) {
        p.vy = JUMP;
        p.jumpLatch = true;
        blip(420, 0.07, "square");
      }
      if (!keys.current.jump) p.jumpLatch = false;
      p.vy = Math.min(p.vy + GRAVITY, FALL_MAX);
      p.onGround = false;
      p.y += p.vy;
      resolve(map, p, false, PW, PH);

      // ── enemies ──
      for (const e of enemies.current) {
        if (!e.alive) continue;
        e.vx = e.dir * ESPEED;
        e.x += e.vx;
        resolve(map, e, true, EW, EH);
        if (e.vx === 0) e.dir *= -1; // hit a wall
        if (e.onGround) {
          const aheadCol = Math.floor((e.x + (e.dir > 0 ? EW + 1 : -1)) / TILE);
          const belowRow = Math.floor((e.y + EH + 2) / TILE);
          if (!isSolid(map, aheadCol, belowRow)) e.dir *= -1; // don't walk off ledges
        }
        e.vy = Math.min(e.vy + GRAVITY, FALL_MAX);
        e.onGround = false;
        e.y += e.vy;
        resolve(map, e, false, EW, EH);

        // collision with player
        if (p.x < e.x + EW && p.x + PW > e.x && p.y < e.y + EH && p.y + PH > e.y) {
          if (p.vy > 0 && p.y + PH - e.y < 18) {
            e.alive = false; // stomp
            p.vy = -7;
            p.jumpLatch = true;
            blip(300, 0.1, "square");
            pop(e.x + EW / 2, e.y, "+1", "#a78bfa");
          } else {
            die();
            return;
          }
        }
      }

      // ── tile interactions ──
      const c0 = Math.floor(p.x / TILE);
      const c1 = Math.floor((p.x + PW - 1) / TILE);
      const r0 = Math.floor(p.y / TILE);
      const r1 = Math.floor((p.y + PH - 1) / TILE);
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const ch = map[r]?.[c];
          if (ch === "o") {
            const key = `${c},${r}`;
            if (!collected.current.has(key)) {
              collected.current.add(key);
              setCoins(collected.current.size);
              blip(880, 0.07, "triangle");
              pop(c * TILE + TILE / 2, r * TILE, "+1", "#fbbf24");
            }
          } else if (ch === "^") {
            die();
            return;
          } else if (ch === "G") {
            win();
            return;
          }
        }
      }
      if (p.y > H + 40) {
        die();
        return;
      }

      // ── particles ──
      const ps = particles.current;
      for (let i = ps.length - 1; i >= 0; i--) {
        ps[i].y += ps[i].vy;
        ps[i].vy += 0.06;
        ps[i].life--;
        if (ps[i].life <= 0) ps.splice(i, 1);
      }

      // ── camera ──
      const camX = Math.max(0, Math.min(p.x + PW / 2 - W / 2, worldW - W));
      draw(ctx, map, p, collected.current, camX, enemies.current, ps);
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [status]);

  return (
    <section
      id="game"
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20 bg-linear-to-b from-background to-card/20"
    >
      <div className="max-w-4xl w-full space-y-8">
        <div
          className={`text-center space-y-4 transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-balance">
            Mini <span className="text-accent">Arcade</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Guide little me across 3 levels to the flag. Grab coins, dodge
            spikes, and <strong>stomp</strong> enemies from above. Arrows / A-D
            move · Space / W / ↑ jump.
          </p>
        </div>

        <div
          className={`relative mx-auto rounded-2xl border border-muted overflow-hidden shadow-xl bg-[#1b1830] transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "150ms", aspectRatio: `${W} / ${H}` }}
        >
          <canvas ref={canvasRef} width={W} height={H} className="block w-full h-full" />

          {status === "playing" && (
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-sm font-semibold text-white pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                Level {level + 1} / {LEVELS.length}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                🪙 {coins} / {countCoins(mapRef.current)}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                💀 {deaths}
              </span>
            </div>
          )}

          {status === "playing" && (
            <button
              onClick={() => setSound((s) => !s)}
              className="absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
              aria-label={sound ? "Mute sound" : "Unmute sound"}
            >
              {sound ? "🔊" : "🔇"}
            </button>
          )}

          {status === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/55 backdrop-blur-sm text-center px-6">
              <div className="text-6xl">🎮</div>
              <h3 className="text-2xl font-bold text-white">Ready, Player One?</h3>
              <p className="text-white/70 max-w-md">
                3 scrolling levels of jump-and-run. Stomp the enemies and try to
                grab every coin.
              </p>
              <button
                onClick={start}
                className="px-8 py-3 rounded-xl bg-accent text-accent-foreground font-bold text-lg hover:opacity-90 transition-opacity"
              >
                ▶ Start Game
              </button>
            </div>
          )}

          {status === "won" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/65 backdrop-blur-sm text-center px-6">
              <div className="text-6xl">🏆</div>
              <h3 className="text-3xl font-bold text-white">You beat all 3 levels!</h3>
              <p className="text-white/80">
                {coins} coins collected · {deaths} death{deaths === 1 ? "" : "s"}.
                Legend. 🫡
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={start}
                  className="px-6 py-3 rounded-xl bg-accent text-accent-foreground font-bold hover:opacity-90 transition-opacity"
                >
                  Play again 🔁
                </button>
                <a
                  href="#contact"
                  className="px-6 py-3 rounded-xl border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Let's connect →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* PlayStation-style gamepad (phones / tablets) */}
        {status === "playing" && (
          <div className="lg:hidden flex items-center justify-between gap-3 rounded-3xl border border-muted bg-card/70 backdrop-blur-sm p-4 select-none touch-none">
            <div className="relative w-36 h-36 shrink-0">
              <div className="absolute left-12 top-12 w-12 h-12 bg-muted/60 rounded" />
              <PadButton className="left-12 top-0 w-12 h-12 rounded-xl bg-background border border-muted text-foreground text-lg" onPress={(v) => (keys.current.jump = v)}>
                ▲
              </PadButton>
              <PadButton className="left-0 top-12 w-12 h-12 rounded-xl bg-background border border-muted text-foreground text-lg" onPress={(v) => (keys.current.left = v)}>
                ◀
              </PadButton>
              <PadButton className="left-24 top-12 w-12 h-12 rounded-xl bg-background border border-muted text-foreground text-lg" onPress={(v) => (keys.current.right = v)}>
                ▶
              </PadButton>
              <PadButton className="left-12 top-24 w-12 h-12 rounded-xl bg-background border border-muted text-muted-foreground text-lg" onPress={() => {}}>
                ▼
              </PadButton>
            </div>

            <div className="relative w-36 h-36 shrink-0">
              <PadButton className="left-12 top-0 w-12 h-12 rounded-full bg-background border-2 border-emerald-400 text-emerald-400 text-xl" onPress={(v) => (keys.current.jump = v)}>
                △
              </PadButton>
              <PadButton className="left-0 top-12 w-12 h-12 rounded-full bg-background border-2 border-pink-400 text-pink-400 text-xl" onPress={(v) => (keys.current.jump = v)}>
                □
              </PadButton>
              <PadButton className="left-24 top-12 w-12 h-12 rounded-full bg-background border-2 border-red-400 text-red-400 text-xl" onPress={(v) => (keys.current.jump = v)}>
                ○
              </PadButton>
              <PadButton className="left-12 top-24 w-12 h-12 rounded-full bg-sky-500 border-2 border-sky-400 text-white text-xl font-bold shadow-lg shadow-sky-500/30" onPress={(v) => (keys.current.jump = v)}>
                ✕
              </PadButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function PadButton({
  className,
  onPress,
  children,
}: {
  className: string;
  onPress: (v: boolean) => void;
  children: ReactNode;
}) {
  const stop = (v: boolean) => (e: ReactPointerEvent) => {
    e.preventDefault();
    onPress(v);
  };
  return (
    <button
      onPointerDown={stop(true)}
      onPointerUp={stop(false)}
      onPointerLeave={stop(false)}
      onPointerCancel={stop(false)}
      className={`absolute flex items-center justify-center font-bold leading-none touch-none select-none active:scale-90 active:brightness-110 transition-transform ${className}`}
    >
      {children}
    </button>
  );
}

function draw(
  ctx: CanvasRenderingContext2D,
  map: string[],
  p: { x: number; y: number; face: number; vx: number },
  collected: Set<string>,
  camX: number,
  enemies: Enemy[],
  particles: Particle[],
) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#2a2350");
  g.addColorStop(1, "#1b1830");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const startCol = Math.floor(camX / TILE);
  const endCol = startCol + VIEW_COLS + 1;
  for (let r = 0; r < ROWS; r++) {
    for (let c = startCol; c <= endCol; c++) {
      const ch = map[r]?.[c];
      if (!ch || ch === " ") continue;
      const x = c * TILE - camX;
      const y = r * TILE;
      if (ch === "X" || ch === "=") {
        ctx.fillStyle = "#6d5efc";
        ctx.fillRect(x, y, TILE, TILE);
        ctx.fillStyle = "#8b7dff";
        ctx.fillRect(x, y, TILE, 5);
        ctx.fillStyle = "rgba(0,0,0,0.12)";
        ctx.fillRect(x, y + TILE - 4, TILE, 4);
      } else if (ch === "o") {
        if (collected.has(`${c},${r}`)) continue;
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(x + TILE / 2, y + TILE / 2, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fde68a";
        ctx.beginPath();
        ctx.arc(x + TILE / 2 - 2, y + TILE / 2 - 2, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (ch === "^") {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.moveTo(x + 3, y + TILE);
        ctx.lineTo(x + TILE / 2, y + 6);
        ctx.lineTo(x + TILE - 3, y + TILE);
        ctx.closePath();
        ctx.fill();
      } else if (ch === "G") {
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(x + TILE / 2 - 2, y - TILE, 4, TILE * 2);
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.moveTo(x + TILE / 2 + 2, y - TILE);
        ctx.lineTo(x + TILE / 2 + 22, y - TILE + 8);
        ctx.lineTo(x + TILE / 2 + 2, y - TILE + 16);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  for (const e of enemies) if (e.alive) drawEnemy(ctx, e.x - camX, e.y, e.dir);
  drawMario(ctx, p.x - camX, p.y, p.face, p.vx);

  // floating "+1" pops
  ctx.font = "bold 15px sans-serif";
  ctx.textAlign = "center";
  for (const pt of particles) {
    ctx.globalAlpha = Math.max(0, pt.life / pt.max);
    ctx.fillStyle = pt.color;
    ctx.fillText(pt.text, pt.x - camX, pt.y);
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
}

function drawEnemy(ctx: CanvasRenderingContext2D, x: number, y: number, dir: number) {
  // little angry Goomba-ish blob
  ctx.fillStyle = "#7a4a1e";
  ctx.beginPath();
  ctx.moveTo(x + 2, y + EH - 4);
  ctx.lineTo(x + 2, y + 10);
  ctx.arc(x + EW / 2, y + 10, EW / 2 - 2, Math.PI, 0);
  ctx.lineTo(x + EW - 2, y + EH - 4);
  ctx.closePath();
  ctx.fill();
  // feet
  ctx.fillStyle = "#3f2410";
  ctx.fillRect(x + 2, y + EH - 4, 8, 4);
  ctx.fillRect(x + EW - 10, y + EH - 4, 8, 4);
  // eyes
  ctx.fillStyle = "#fff";
  ctx.fillRect(x + 6, y + 8, 5, 6);
  ctx.fillRect(x + EW - 11, y + 8, 5, 6);
  ctx.fillStyle = "#1b1830";
  const ed = dir > 0 ? 2 : 0;
  ctx.fillRect(x + 7 + ed, y + 10, 2, 3);
  ctx.fillRect(x + EW - 10 + ed, y + 10, 2, 3);
  // angry brows
  ctx.fillStyle = "#3f2410";
  ctx.fillRect(x + 5, y + 6, 6, 2);
  ctx.fillRect(x + EW - 11, y + 6, 6, 2);
}

// Mario-style sprite drawn with primitives, mirrored by facing direction.
function drawMario(ctx: CanvasRenderingContext2D, px: number, py: number, face: number, vx: number) {
  const RED = "#e52521";
  const SKIN = "#ffb27a";
  const HAIR = "#5a3210";
  const BLUE = "#2b5fd6";
  const SHOE = "#6b3f1d";
  const YELLOW = "#ffd34e";

  const walking = vx !== 0;
  const stepBack = walking && Math.floor(px / 6) % 2 === 0;

  ctx.save();
  ctx.translate(Math.round(px + PW / 2), Math.round(py));
  if (face < 0) ctx.scale(-1, 1);
  // local coords: x ∈ [-11, 11], y ∈ [0, 28]

  ctx.fillStyle = BLUE;
  ctx.fillRect(-7, 22, 5, 4);
  ctx.fillRect(2, 22, 5, 4);
  ctx.fillStyle = SHOE;
  ctx.fillRect(stepBack ? -9 : -7, 26, 6, 2);
  ctx.fillRect(stepBack ? 2 : 4, 26, 6, 2);

  ctx.fillStyle = BLUE;
  ctx.fillRect(-7, 16, 14, 7);
  ctx.fillStyle = RED;
  ctx.fillRect(-7, 14, 14, 3);
  ctx.fillStyle = BLUE;
  ctx.fillRect(-5, 14, 2, 3);
  ctx.fillRect(3, 14, 2, 3);
  ctx.fillStyle = YELLOW;
  ctx.fillRect(-1, 18, 2, 2);

  ctx.fillStyle = RED;
  ctx.fillRect(-9, 15, 3, 5);
  ctx.fillRect(6, 15, 3, 5);
  ctx.fillStyle = SKIN;
  ctx.fillRect(-9, 20, 3, 2);
  ctx.fillRect(6, 20, 3, 2);

  ctx.fillStyle = SKIN;
  ctx.fillRect(-6, 6, 12, 9);
  ctx.fillStyle = HAIR;
  ctx.fillRect(-6, 9, 3, 5);
  ctx.fillRect(-3, 12, 8, 2);
  ctx.fillStyle = "#f0935f";
  ctx.fillRect(4, 10, 3, 3);
  ctx.fillStyle = "#1b1830";
  ctx.fillRect(1, 8, 2, 3);

  ctx.fillStyle = RED;
  ctx.fillRect(-7, 3, 13, 4);
  ctx.fillRect(-5, 0, 9, 3);
  ctx.fillRect(5, 5, 6, 2);
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-1, 4, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = RED;
  ctx.font = "bold 4px sans-serif";
  ctx.fillText("M", -2.4, 5.6);

  ctx.restore();
}
