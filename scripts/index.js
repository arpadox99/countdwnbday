// ======================================================
// 1. AMBIL ELEMENT DARI HTML
// ======================================================

const count = document.getElementById('count');
const head = document.getElementById('head');
const giftbox = document.getElementById('merrywrap');
const canvasC = document.getElementById('c');

// ======================================================
// 2. CONFIG ULANG TAHUN
// ======================================================

const config = {
  birthdate: 'Jun 16, 2026',
  name: 'DEA SAFANA'
};

// ======================================================
// 3. SEMBUNYIKAN SEMUA ELEMENT SAAT AWAL
// ======================================================

function hideEverything() {
  head.style.display = 'none';
  count.style.display = 'none';
  giftbox.style.display = 'none';
  canvasC.style.display = 'none';
}

hideEverything();

// ======================================================
// 4. CONFETTI BACKGROUND
// ======================================================

if (window.ConfettiGenerator) {
  const confettiSettings = { target: 'confetti' };
  const confetti = new window.ConfettiGenerator(confettiSettings);
  confetti.render();
}

// ======================================================
// 5. SETTING WAKTU COUNTDOWN
// ======================================================

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

const countDown = new Date(`${config.birthdate} 00:00:00`).getTime();

let birthdayStarted = false;

// ======================================================
// 6. JALANKAN COUNTDOWN
// ======================================================

let x = setInterval(updateCountdown, second);
updateCountdown();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = countDown - now;

  // Jika tanggal ulang tahun belum tiba
  if (distance > 0) {
    head.style.display = 'initial';
    count.style.display = 'initial';
    giftbox.style.display = 'none';
    canvasC.style.display = 'none';

    document.getElementById('day').innerText = Math.floor(distance / day);

    document.getElementById('hour').innerText = Math.floor(
      (distance % day) / hour
    );

    document.getElementById('minute').innerText = Math.floor(
      (distance % hour) / minute
    );

    document.getElementById('second').innerText = Math.floor(
      (distance % minute) / second
    );

    return;
  }

  // Jika tanggal ulang tahun sudah tiba
  clearInterval(x);

  head.style.display = 'none';
  count.style.display = 'none';
  giftbox.style.display = 'initial';

  if (!birthdayStarted) {
    birthdayStarted = true;
    prepareGiftBox();
  }
}

// ======================================================
// 7. BAGIAN GIFT BOX / KADO
// ======================================================

function prepareGiftBox() {
  const merrywrap = document.getElementById('merrywrap');
  const box = merrywrap.getElementsByClassName('giftbox')[0];

  let step = 1;

  // Durasi setiap step buka kado
  const stepMinutes = [2000, 2000, 1000, 1000];

  let fireworksStarted = false;

  function init() {
    box.addEventListener('click', openBox, false);
    box.addEventListener('click', showFireworks, false);
  }

  function stepClass(step) {
    merrywrap.className = 'merrywrap step-' + step;
  }

  function openBox() {
    if (step === 1) {
      box.removeEventListener('click', openBox, false);
    }

    stepClass(step);

    if (step === 4) {
      return;
    }

    setTimeout(openBox, stepMinutes[step - 1]);
    step++;
  }

  function showFireworks() {
    if (fireworksStarted) return;

    fireworksStarted = true;
    canvasC.style.display = 'initial';

    // Delay sebelum animasi teks muncul
    setTimeout(startFireworksAnimation, 1500);
  }

  init();
}

// ======================================================
// 8. ANIMASI FIREWORKS + TEKS HAPPY BIRTHDAY
// ======================================================

function startFireworksAnimation() {
  let w = (canvasC.width = window.innerWidth);
  let h = (canvasC.height = window.innerHeight);

  const ctx = canvasC.getContext('2d');

  let hw = w / 2;
  let hh = h / 2;

  let letters = [];
  let opts;
  let calc;

  const Tau = Math.PI * 2;
  const TauQuarter = Tau / 4;

  // ======================================================
  // 9. SETTING RESPONSIVE UNTUK DESKTOP, TABLET, DAN HP
  // ======================================================

  function createResponsiveOptions() {
    const textStrings = ['HAPPY', 'BIRTHDAY!', `🎂 ${config.name} 🎉`];

    // Hitung jumlah karakter terpanjang
    // Array.from dipakai agar emoji tidak pecah
    const longestTextLength = Math.max(
      ...textStrings.map(text => Array.from(text).length)
    );

    // Lebar maksimal teks agar tidak keluar layar HP
    const maxTextWidth = w <= 480 ? w * 0.76 : w * 0.86;

    // Jarak antar huruf otomatis mengecil di layar HP
    const responsiveCharSpacing = Math.min(
      w <= 480 ? 23 : w <= 768 ? 32 : 40,
      maxTextWidth / Math.max(longestTextLength - 1, 1)
    );

    // Ukuran huruf otomatis mengikuti layar
    const responsiveCharSize = Math.max(
      w <= 480 ? 18 : 24,
      Math.min(w <= 480 ? 22 : w <= 768 ? 26 : 30, responsiveCharSpacing * 0.88)
    );

    // Jarak antar baris
    const responsiveLineHeight = responsiveCharSize * 1.45;

    // Jarak khusus antara BIRTHDAY! dan nama
    const responsiveNameGap = w <= 480 ? 18 : w <= 768 ? 26 : 35;

    return {
      // ======================================================
      // TEKS UTAMA
      // Baris 1 dan 2 = warna pelangi
      // Baris 3 = nama warna navy + light gold
      // ======================================================

      strings: textStrings,

      charSize: responsiveCharSize,
      charSpacing: responsiveCharSpacing,
      lineHeight: responsiveLineHeight,
      nameExtraGap: responsiveNameGap,

      // Warna khusus nama
      nameColor: '#ffd700', // gold
      nameLightColor: '#001f3f', // navy

      cx: w / 2,
      cy: h / 2,

      // ======================================================
      // SETTING FIREWORKS
      // ======================================================

      fireworkPrevPoints: 10,
      fireworkBaseLineWidth: 5,
      fireworkAddedLineWidth: 8,
      fireworkSpawnTime: 200,

      // Dibuat lebih lambat agar transisi tidak terlalu cepat
      fireworkBaseReachTime: 80,
      fireworkAddedReachTime: 60,

      fireworkCircleBaseSize: 20,
      fireworkCircleAddedSize: 10,

      // Fade in dibuat lebih smooth
      fireworkCircleBaseTime: 80,
      fireworkCircleAddedTime: 60,

      // Fade out dibuat lebih lambat
      fireworkCircleFadeBaseTime: 80,
      fireworkCircleFadeAddedTime: 50,

      fireworkBaseShards: 5,
      fireworkAddedShards: 5,
      fireworkShardPrevPoints: 3,
      fireworkShardBaseVel: 4,
      fireworkShardAddedVel: 2,
      fireworkShardBaseSize: 3,
      fireworkShardAddedSize: 3,

      gravity: 0.1,
      upFlow: -0.1,

      // Durasi teks diam sebelum berubah menjadi balon
      letterContemplatingWaitTime: 520,

      // ======================================================
      // SETTING BALON HURUF
      // Dibuat responsive agar tidak terlalu besar di HP
      // ======================================================

      balloonSpawnTime: 20,
      balloonBaseInflateTime: 60,
      balloonAddedInflateTime: 40,

      balloonBaseSize: w <= 480 ? 14 : 20,
      balloonAddedSize: w <= 480 ? 12 : 20,

      balloonBaseVel: 0.4,
      balloonAddedVel: 0.4,
      balloonBaseRadian: -(Math.PI / 2 - 0.5),
      balloonAddedRadian: -1
    };
  }

  // ======================================================
  // 10. FONT CANVAS
  // Font emoji ditambahkan agar 🎂 dan 🎉 muncul
  // ======================================================

  function setCanvasFont() {
    ctx.font = `${opts.charSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Twemoji Mozilla", Verdana, sans-serif`;
  }

  // ======================================================
  // 11. HITUNG LEBAR TEKS
  // ======================================================

  function updateTextCalculation() {
    calc = {
      totalWidth:
        opts.charSpacing *
        Math.max(
          ...opts.strings.map(str => Math.max(Array.from(str).length - 1, 1))
        )
    };
  }

  // ======================================================
  // 12. CLASS HURUF
  // Setiap huruf punya animasi sendiri
  // ======================================================

  function Letter(char, x, y, row) {
    this.char = char;
    this.x = x;
    this.y = y;
    this.row = row;

    // Baris ke-3 adalah nama
    this.isNameRow = row === 2;

    this.dx = -ctx.measureText(char).width / 2;
    this.dy = +opts.charSize / 2;

    this.fireworkDy = this.y - hh;

    // ======================================================
    // WARNA KHUSUS UNTUK NAMA
    // Navy sebagai warna utama
    // Gold sebagai light / efek terang
    // ======================================================

    if (this.isNameRow) {
      this.color = opts.nameColor;
      this.lightColor = opts.nameLightColor;

      // Gold transparan untuk efek fade
      this.lightAlphaColor = 'rgba(255, 215, 0, alp)';

      // Navy transparan untuk garis/firework
      this.alphaColor = 'rgba(0, 31, 63, alp)';
    }

    // ======================================================
    // WARNA PELANGI UNTUK HAPPY DAN BIRTHDAY
    // ======================================================
    else {
      const normalizedX = (x + calc.totalWidth / 2) / calc.totalWidth;
      const hue = normalizedX * 360;

      this.color = `hsl(${hue}, 80%, 50%)`;
      this.lightAlphaColor = `hsla(${hue}, 80%, light%, alp)`;
      this.lightColor = `hsl(${hue}, 80%, light%)`;
      this.alphaColor = `hsla(${hue}, 80%, 50%, alp)`;
    }

    this.reset();
  }

  // ======================================================
  // 13. RESET ANIMASI HURUF
  // ======================================================

  Letter.prototype.reset = function () {
    this.phase = 'firework';
    this.tick = 0;
    this.spawned = false;

    this.spawningTime = (opts.fireworkSpawnTime * Math.random()) | 0;

    this.reachTime =
      (opts.fireworkBaseReachTime +
        opts.fireworkAddedReachTime * Math.random()) |
      0;

    this.lineWidth =
      opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth * Math.random();

    this.prevPoints = [[0, hh, 0]];
  };

  // ======================================================
  // 14. STEP ANIMASI SETIAP HURUF
  // ======================================================

  Letter.prototype.step = function () {
    // ======================================================
    // 14A. FASE FIREWORK
    // ======================================================

    if (this.phase === 'firework') {
      if (!this.spawned) {
        ++this.tick;

        if (this.tick >= this.spawningTime) {
          this.tick = 0;
          this.spawned = true;
        }
      } else {
        ++this.tick;

        const linearProportion = this.tick / this.reachTime;
        const armonicProportion = Math.sin(linearProportion * TauQuarter);

        const x = linearProportion * this.x;
        const y = hh + armonicProportion * this.fireworkDy;

        if (this.prevPoints.length > opts.fireworkPrevPoints) {
          this.prevPoints.shift();
        }

        this.prevPoints.push([x, y, linearProportion * this.lineWidth]);

        const lineWidthProportion = 1 / (this.prevPoints.length - 1);

        for (let i = 1; i < this.prevPoints.length; ++i) {
          const point = this.prevPoints[i];
          const point2 = this.prevPoints[i - 1];

          ctx.strokeStyle = this.alphaColor.replace(
            'alp',
            i / this.prevPoints.length
          );

          ctx.lineWidth = point[2] * lineWidthProportion * i;

          ctx.beginPath();
          ctx.moveTo(point[0], point[1]);
          ctx.lineTo(point2[0], point2[1]);
          ctx.stroke();
        }

        if (this.tick >= this.reachTime) {
          this.phase = 'contemplate';

          this.circleFinalSize =
            opts.fireworkCircleBaseSize +
            opts.fireworkCircleAddedSize * Math.random();

          this.circleCompleteTime =
            (opts.fireworkCircleBaseTime +
              opts.fireworkCircleAddedTime * Math.random()) |
            0;

          this.circleCreating = true;
          this.circleFading = false;

          this.circleFadeTime =
            (opts.fireworkCircleFadeBaseTime +
              opts.fireworkCircleFadeAddedTime * Math.random()) |
            0;

          this.tick = 0;
          this.tick2 = 0;

          this.shards = [];

          const shardCount =
            (opts.fireworkBaseShards +
              opts.fireworkAddedShards * Math.random()) |
            0;

          const angle = Tau / shardCount;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);

          let x = 1;
          let y = 0;

          for (let i = 0; i < shardCount; ++i) {
            const x1 = x;

            x = x * cos - y * sin;
            y = y * cos + x1 * sin;

            this.shards.push(new Shard(this.x, this.y, x, y, this.alphaColor));
          }
        }
      }
    }

    // ======================================================
    // 14B. FASE TEKS MUNCUL / DIAM
    // ======================================================
    else if (this.phase === 'contemplate') {
      ++this.tick;

      // Fade in lingkaran sebelum huruf muncul
      if (this.circleCreating) {
        ++this.tick2;

        const proportion = this.tick2 / this.circleCompleteTime;
        const armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;

        ctx.beginPath();

        ctx.fillStyle = this.lightAlphaColor
          .replace('light', 50 + 50 * proportion)
          .replace('alp', proportion);

        ctx.arc(this.x, this.y, armonic * this.circleFinalSize, 0, Tau);
        ctx.fill();

        if (this.tick2 > this.circleCompleteTime) {
          this.tick2 = 0;
          this.circleCreating = false;
          this.circleFading = true;
        }
      }

      // Fade out lingkaran dan huruf mulai terlihat
      else if (this.circleFading) {
        ctx.fillStyle = this.lightColor.replace('light', 70);
        ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

        ++this.tick2;

        const proportion = this.tick2 / this.circleFadeTime;
        const armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;

        ctx.beginPath();

        ctx.fillStyle = this.lightAlphaColor
          .replace('light', 100)
          .replace('alp', 1 - armonic);

        ctx.arc(this.x, this.y, this.circleFinalSize, 0, Tau);
        ctx.fill();

        if (this.tick2 >= this.circleFadeTime) {
          this.circleFading = false;
        }
      }

      // Huruf tampil diam beberapa saat
      else {
        ctx.fillStyle = this.lightColor.replace('light', 70);
        ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
      }

      // Pecahan fireworks kecil
      for (let i = 0; i < this.shards.length; ++i) {
        this.shards[i].step();

        if (!this.shards[i].alive) {
          this.shards.splice(i, 1);
          --i;
        }
      }

      // Setelah teks cukup lama tampil, berubah menjadi balon
      if (this.tick > opts.letterContemplatingWaitTime) {
        this.phase = 'balloon';

        this.tick = 0;
        this.spawning = true;

        this.spawnTime = (opts.balloonSpawnTime * Math.random()) | 0;

        this.inflating = false;

        this.inflateTime =
          (opts.balloonBaseInflateTime +
            opts.balloonAddedInflateTime * Math.random()) |
          0;

        this.size =
          (opts.balloonBaseSize + opts.balloonAddedSize * Math.random()) | 0;

        const rad =
          opts.balloonBaseRadian + opts.balloonAddedRadian * Math.random();

        const vel = opts.balloonBaseVel + opts.balloonAddedVel * Math.random();

        this.vx = Math.cos(rad) * vel;
        this.vy = Math.sin(rad) * vel;
      }
    }

    // ======================================================
    // 14C. FASE BALON
    // ======================================================
    else if (this.phase === 'balloon') {
      ctx.strokeStyle = this.lightColor.replace('light', 80);

      // Huruf masih tampil sebelum balon muncul
      if (this.spawning) {
        ++this.tick;

        ctx.fillStyle = this.lightColor.replace('light', 70);
        ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

        if (this.tick >= this.spawnTime) {
          this.tick = 0;
          this.spawning = false;
          this.inflating = true;
        }
      }

      // Balon mulai membesar
      else if (this.inflating) {
        ++this.tick;

        const proportion = this.tick / this.inflateTime;

        const x = (this.cx = this.x);
        const y = (this.cy = this.y - this.size * proportion);

        ctx.fillStyle = this.alphaColor.replace('alp', proportion);

        ctx.beginPath();
        generateBalloonPath(x, y, this.size * proportion);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, this.y);
        ctx.stroke();

        ctx.fillStyle = this.lightColor.replace('light', 70);
        ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

        if (this.tick >= this.inflateTime) {
          this.tick = 0;
          this.inflating = false;
        }
      }

      // Balon terbang ke atas
      else {
        this.cx += this.vx;
        this.cy += this.vy += opts.upFlow;

        ctx.fillStyle = this.color;

        ctx.beginPath();
        generateBalloonPath(this.cx, this.cy, this.size);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.cx, this.cy);
        ctx.lineTo(this.cx, this.cy + this.size);
        ctx.stroke();

        ctx.fillStyle = this.lightColor.replace('light', 70);

        ctx.fillText(
          this.char,
          this.cx + this.dx,
          this.cy + this.dy + this.size
        );

        // Jika sudah keluar layar, animasi huruf selesai
        if (
          this.cy + this.size < -hh ||
          this.cx < -hw ||
          this.cx > hw ||
          this.cy > hh
        ) {
          this.phase = 'done';
        }
      }
    }
  };

  // ======================================================
  // 15. CLASS PECAHAN FIREWORKS
  // ======================================================

  function Shard(x, y, vx, vy, color) {
    const vel =
      opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();

    this.vx = vx * vel;
    this.vy = vy * vel;

    this.x = x;
    this.y = y;

    this.prevPoints = [[x, y]];
    this.color = color;

    this.alive = true;

    this.size =
      opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
  }

  Shard.prototype.step = function () {
    this.x += this.vx;
    this.y += this.vy += opts.gravity;

    if (this.prevPoints.length > opts.fireworkShardPrevPoints) {
      this.prevPoints.shift();
    }

    this.prevPoints.push([this.x, this.y]);

    const lineWidthProportion = this.size / this.prevPoints.length;

    for (let k = 0; k < this.prevPoints.length - 1; ++k) {
      const point = this.prevPoints[k];
      const point2 = this.prevPoints[k + 1];

      ctx.strokeStyle = this.color.replace('alp', k / this.prevPoints.length);

      ctx.lineWidth = k * lineWidthProportion;

      ctx.beginPath();
      ctx.moveTo(point[0], point[1]);
      ctx.lineTo(point2[0], point2[1]);
      ctx.stroke();
    }

    if (this.prevPoints[0][1] > hh) {
      this.alive = false;
    }
  };

  // ======================================================
  // 16. BENTUK BALON
  // ======================================================

  function generateBalloonPath(x, y, size) {
    ctx.moveTo(x, y);

    ctx.bezierCurveTo(
      x - size / 2,
      y - size / 2,
      x - size / 4,
      y - size,
      x,
      y - size
    );

    ctx.bezierCurveTo(x + size / 4, y - size, x + size / 2, y - size / 2, x, y);
  }

  // ======================================================
  // 17. BUAT HURUF SATU PER SATU
  // Array.from dipakai agar emoji tidak hilang / pecah
  // ======================================================

  function buildLetters() {
    letters = [];

    for (let i = 0; i < opts.strings.length; ++i) {
      const chars = Array.from(opts.strings[i]);

      const extraGap = i === 2 ? opts.nameExtraGap : 0;

      const totalHeight =
        opts.strings.length * opts.lineHeight + opts.nameExtraGap;

      // Pakai chars.length - 1 agar posisi teks benar-benar center
      const lineWidth = Math.max(chars.length - 1, 1) * opts.charSpacing;

      for (let j = 0; j < chars.length; ++j) {
        letters.push(
          new Letter(
            chars[j],

            // Posisi X huruf agar center dan tidak keluar layar
            j * opts.charSpacing - lineWidth / 2,

            // Posisi Y huruf
            i * opts.lineHeight +
              opts.lineHeight / 2 +
              extraGap -
              totalHeight / 2,

            // Nomor baris
            i
          )
        );
      }
    }
  }

  // ======================================================
  // 18. SETUP AWAL ANIMASI
  // ======================================================

  function setupAnimation() {
    opts = createResponsiveOptions();
    updateTextCalculation();
    setCanvasFont();
    buildLetters();
  }

  setupAnimation();

  // ======================================================
  // 19. LOOP ANIMASI UTAMA
  // ======================================================

  function anim() {
    window.requestAnimationFrame(anim);

    // Background canvas putih
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);

    ctx.translate(hw, hh);

    let done = true;

    for (let l = 0; l < letters.length; ++l) {
      letters[l].step();

      if (letters[l].phase !== 'done') {
        done = false;
      }
    }

    ctx.translate(-hw, -hh);

    // Jika semua huruf selesai, ulang animasi dari awal
    if (done) {
      for (let l = 0; l < letters.length; ++l) {
        letters[l].reset();
      }
    }
  }

  // ======================================================
  // 20. RESPONSIVE SAAT UKURAN LAYAR BERUBAH
  // ======================================================

  window.addEventListener('resize', function () {
    w = canvasC.width = window.innerWidth;
    h = canvasC.height = window.innerHeight;

    hw = w / 2;
    hh = h / 2;

    setupAnimation();
  });

  // ======================================================
  // 21. MULAI ANIMASI
  // ======================================================

  anim();
}
