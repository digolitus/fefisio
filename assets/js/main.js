(function () {
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var temIO = 'IntersectionObserver' in window;
  if (!reduz && temIO) root.classList.add('anim');

  // Divide títulos em palavras para a entrada em cascata
  function dividir(el) {
    var i = 0;
    (function andar(n) {
      Array.prototype.slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            var w = document.createElement('span'); w.className = 'w';
            var s = document.createElement('span'); s.textContent = p; s.style.setProperty('--i', i++);
            w.appendChild(s); frag.appendChild(w);
          });
          c.parentNode.replaceChild(frag, c);
        } else if (c.nodeType === 1) andar(c);
      });
    })(el);
    el.classList.add('dividido');
  }
  document.querySelectorAll('.hero h1, .contato h2').forEach(dividir);

  // Marca os elementos que entram com a rolagem
  function marcar(sel, tipo) {
    document.querySelectorAll(sel).forEach(function (el, i, todos) {
      el.setAttribute('data-r', tipo || '');
      el.style.setProperty('--i', el.parentNode === (todos[0] && todos[0].parentNode) ? i : 0);
    });
  }
  marcar('.hero .eyebrow, .hero p.lead, .hero .acoes, .hero .registro');
  marcar('.cab > *');
  marcar('.sobre-texto > *', 'esq');
  marcar('.trat', 'zoom');
  marcar('.tratamentos .aviso');
  marcar('.hc-intro > *', 'esq');
  marcar('.hc-lista li');
  marcar('.processo li');
  marcar('.diferenciais > div');
  marcar('.contato-texto > *:not(h2)');
  marcar('dl.dados > div');

  var alvos = document.querySelectorAll('[data-r], .dividido, .retrato');
  if (temIO) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    alvos.forEach(function (el) { io.observe(el); });
  } else alvos.forEach(function (el) { el.classList.add('in'); });

  // Navegação lateral
  var secoes = [['inicio-hero', 'Início'], ['sobre', 'A Dra. Fernanda'], ['tratamentos', 'Tratamentos'], ['home-care', 'Home Care'], ['atendimento', 'Como funciona'], ['contato', 'Contato']];
  var trilha = document.createElement('nav'); trilha.className = 'trilha'; trilha.setAttribute('aria-label', 'Navegação por seções');
  secoes.forEach(function (s) {
    var a = document.createElement('a'); a.href = '#' + s[0]; a.innerHTML = '<i></i><span>' + s[1] + '</span>'; a.setAttribute('aria-label', s[1]);
    trilha.appendChild(a);
  });
  document.body.appendChild(trilha);
  var pontos = trilha.querySelectorAll('a');
  var elsSec = secoes.map(function (s) { return document.getElementById(s[0]); });

  // Faixa em movimento
  var faixa = document.querySelector('.pilares .faixa');
  if (faixa) faixa.innerHTML += faixa.innerHTML;
  var fx = 0;

  var header = document.querySelector('header.topo');
  var hero = document.querySelector('.hero');
  var retrato = document.querySelector('.retrato');
  var proc = document.querySelector('.processo');
  var passos = proc ? proc.querySelectorAll('li') : [];
  if (proc) { var fio = document.createElement('div'); fio.className = 'fio'; fio.setAttribute('aria-hidden', 'true'); proc.insertBefore(fio, proc.firstChild); }
  var contato = document.querySelector('.contato');
  var ultimoY = window.scrollY, vel = 0;

  function quadro() {
    var y = window.scrollY, vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    header.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    header.classList.toggle('compacto', y > 40);

    // seção ativa
    var ativa = 0;
    elsSec.forEach(function (el, i) { if (el && el.getBoundingClientRect().top < vh * 0.45) ativa = i; });
    pontos.forEach(function (p, i) { p.classList.toggle('ativo', i === ativa); });

    if (!reduz) {
      var hs = Math.min(1, Math.max(0, y / (hero.offsetHeight || 1)));
      hero.style.setProperty('--hs', hs.toFixed(3));
      if (retrato) {
        var r = retrato.getBoundingClientRect();
        retrato.style.setProperty('--py', ((r.top + r.height / 2 - vh / 2) * -0.06).toFixed(1) + 'px');
      }
      if (contato) {
        var c = contato.getBoundingClientRect();
        contato.style.setProperty('--cy', (c.top * -0.25).toFixed(1) + 'px');
      }
      if (proc) {
        var pr = proc.getBoundingClientRect();
        var lp = Math.min(1, Math.max(0, (vh * 0.85 - pr.top) / (vh * 0.45)));
        proc.style.setProperty('--lp', lp.toFixed(3));
        passos.forEach(function (li, i) { li.classList.toggle('aceso', lp >= i / Math.max(1, passos.length - 1) - 0.001 && lp > 0); });
      }
      vel = vel * 0.9 + (y - ultimoY) * 0.1;
    }
    ultimoY = y;
  }

  function laco() {
    quadro();
    if (faixa && !reduz) {
      fx -= 0.45 + Math.min(6, Math.abs(vel) * 0.25);
      var metade = faixa.scrollWidth / 2;
      if (-fx >= metade) fx += metade;
      faixa.style.transform = 'translate3d(' + fx.toFixed(2) + 'px,0,0)';
    }
    requestAnimationFrame(laco);
  }
  if (reduz) { window.addEventListener('scroll', quadro, { passive: true }); quadro(); }
  else requestAnimationFrame(laco);

  if (reduz) { if (proc) proc.style.setProperty('--lp', 1); passos.forEach(function (li) { li.classList.add('aceso'); }); }

  // Logo com inclinação 3D seguindo o mouse
  var giro = document.querySelector('.hero-logo .giro');
  if (giro) { var li = giro.querySelector('img'); if (li) giro.style.setProperty('--logo', 'url("' + li.src + '")'); }
  if (giro && !reduz && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('pointermove', function (e) {
      var r = giro.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      giro.style.setProperty('--rx', (dx * 10).toFixed(2) + 'deg');
      giro.style.setProperty('--ry', (dy * -10).toFixed(2) + 'deg');
    });
    hero.addEventListener('pointerleave', function () { giro.style.setProperty('--rx', '0deg'); giro.style.setProperty('--ry', '0deg'); });
  }

  // Holofote nos cartões de tratamento
  document.querySelectorAll('.trat').forEach(function (t) {
    t.addEventListener('pointermove', function (e) {
      var r = t.getBoundingClientRect();
      t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    t.addEventListener('pointerleave', function () { t.style.setProperty('--mx', '-999px'); t.style.setProperty('--my', '-999px'); });
  });

  // Poeira dourada no hero (constelação discreta)
  var cv = document.querySelector('.poeira');
  if (cv && !reduz) {
    var ctx = cv.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1), W, H, pts = [], visivel = true;
    function medir() {
      W = cv.offsetWidth; H = cv.offsetHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(70, W * H / 16000));
      pts = []; for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + .4, vx: (Math.random() - .5) * .15, vy: -Math.random() * .25 - .05, a: Math.random() * .5 + .2 });
    }
    medir(); window.addEventListener('resize', medir);
    new IntersectionObserver(function (es) { visivel = es[0].isIntersecting; }).observe(cv);
    (function desenhar() {
      if (visivel) {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < pts.length; i++) {
          var p = pts[i]; p.x += p.vx; p.y += p.vy;
          if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
          if (p.x < -5) p.x = W + 5; if (p.x > W + 5) p.x = -5;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fillStyle = 'rgba(163,94,38,' + p.a + ')'; ctx.fill();
          for (var j = i + 1; j < pts.length; j++) {
            var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
            if (d < 9000) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.strokeStyle = 'rgba(163,94,38,' + (0.14 * (1 - d / 9000)).toFixed(3) + ')'; ctx.lineWidth = .6; ctx.stroke(); }
          }
        }
      }
      requestAnimationFrame(desenhar);
    })();
  }
})();
