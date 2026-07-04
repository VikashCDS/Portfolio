// ===================== NEURAL NETWORK BACKGROUND =====================
(function () {
    var canvas = document.getElementById('neural-bg');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, nodes = [], animId;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function initNodes() {
        nodes = [];
        var count = Math.min(80, Math.floor((W * H) / 14000));
        for (var i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 2 + 1
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        var MAX_DIST = 160;
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > W) n.vx *= -1;
            if (n.y < 0 || n.y > H) n.vy *= -1;
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,200,255,0.55)';
            ctx.fill();
            for (var j = i + 1; j < nodes.length; j++) {
                var m = nodes[j];
                var dx = n.x - m.x, dy = n.y - m.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    var alpha = (1 - dist / MAX_DIST) * 0.35;
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(m.x, m.y);
                    ctx.strokeStyle = 'rgba(0,200,255,' + alpha + ')';
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
        animId = requestAnimationFrame(draw);
    }

    resize();
    initNodes();
    draw();
    window.addEventListener('resize', function () {
        cancelAnimationFrame(animId);
        resize();
        initNodes();
        draw();
    });
})();

// ===================== TYPEWRITER =====================
(function () {
    var el = document.getElementById('typewriter');
    if (!el) return;
    var words = ['LLM Pipelines', 'RAG Architectures', 'ML Models', 'Data Science Solutions', 'AI Applications', 'NLP Systems'];
    var wi = 0, ci = 0, deleting = false;

    function tick() {
        var word = words[wi];
        if (!deleting) {
            el.textContent = word.slice(0, ++ci);
            if (ci === word.length) { deleting = true; setTimeout(tick, 1800); return; }
        } else {
            el.textContent = word.slice(0, --ci);
            if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
        }
        setTimeout(tick, deleting ? 55 : 90);
    }
    setTimeout(tick, 800);
})();

// ===================== MOBILE MENU =====================
(function () {
    var icon   = document.getElementById('menu-icon');
    var navbar = document.getElementById('navbar');
    if (!icon || !navbar) return;

    icon.addEventListener('click', function () {
        navbar.classList.toggle('open');
        icon.classList.toggle('bx-x');
    });

    navbar.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
            navbar.classList.remove('open');
            icon.classList.remove('bx-x');
        });
    });
})();

// ===================== ACTIVE NAV + HEADER SHADOW =====================
(function () {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.navbar a:not(.nav-dl-btn)');
    var header   = document.getElementById('header');

    window.addEventListener('scroll', function () {
        var y = window.scrollY;
        var current = '';
        sections.forEach(function (s) {
            if (y >= s.offsetTop - 160) current = s.id;
        });
        navLinks.forEach(function (a) {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + current) a.classList.add('active');
        });
        if (header) {
            header.style.boxShadow = y > 10 ? '0 2px 24px rgba(0,200,255,0.1)' : 'none';
        }
    });
})();

// ===================== SCROLL REVEAL =====================
(function () {
    var items = document.querySelectorAll('[data-aos]');
    if (!items.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e, i) {
            if (e.isIntersecting) {
                setTimeout(function () { e.target.classList.add('visible'); }, i * 80);
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });

    items.forEach(function (el) { observer.observe(el); });
})();

// ===================== HERO IMAGE 3D TILT =====================
(function () {
    var wrap = document.getElementById('heroImg');
    var img  = wrap && wrap.querySelector('#hero-photo');
    if (!wrap || !img) return;

    wrap.addEventListener('mousemove', function (e) {
        var r = wrap.getBoundingClientRect();
        var x = e.clientX - r.left  - r.width  / 2;
        var y = e.clientY - r.top   - r.height / 2;
        img.style.transform  = 'scale(1.05) rotateX(' + ((y / r.height) * 14) + 'deg) rotateY(' + (-(x / r.width) * 14) + 'deg)';
        img.style.transition = 'transform 0.12s ease';
    });

    wrap.addEventListener('mouseleave', function () {
        img.style.transform  = '';
        img.style.transition = 'transform 0.5s ease';
    });
})();

// ===================== RESUME DOWNLOAD TRACKING =====================
function trackDownload(source) {
    showToast('Someone just downloaded your resume!');

    console.log('[VKS Portfolio] Resume downloaded from: ' + source + ' | Time: ' + new Date().toLocaleString());

    var payload = {
        name: 'Portfolio Bot',
        _replyto: 'vks8405074264@gmail.com',
        subject: 'Resume Download Alert - VKS Portfolio',
        message: 'Your resume was just downloaded!\n\nSource: ' + source + '\nTime: ' + new Date().toLocaleString() + '\nUser Agent: ' + navigator.userAgent
    };

    fetch('https://formspree.io/f/mjkeqpwy', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(function () {});
}

function showToast(message) {
    var toast = document.getElementById('dl-toast');
    var msg   = document.getElementById('dl-toast-msg');
    if (!toast || !msg) return;
    msg.textContent = message || 'Someone just downloaded your resume!';
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 6000);
}

// ===================== SECTION TRANSITION ANIMATIONS =====================
(function () {
    var sections = document.querySelectorAll('section:not(.home)');
    if (!sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    sections.forEach(function (s) { observer.observe(s); });
})();

// ===================== ANIMATED GRADIENT MESH BACKGROUND TOGGLE =====================
(function () {
    var toggleBtn = document.getElementById('bg-toggle');
    var meshBg    = document.getElementById('mesh-bg');
    var neuralBg  = document.getElementById('neural-bg');
    if (!toggleBtn || !meshBg || !neuralBg) return;

    var STORAGE_KEY = 'vks-bg-mode';

    function applyMode(mode) {
        if (mode === 'mesh') {
            meshBg.classList.add('active');
            neuralBg.style.opacity = '0';
            toggleBtn.querySelector('i').className = 'bx bx-network-chart';
            toggleBtn.setAttribute('title', 'Switch to neural network background');
        } else {
            meshBg.classList.remove('active');
            neuralBg.style.opacity = '';
            toggleBtn.querySelector('i').className = 'bx bx-planet';
            toggleBtn.setAttribute('title', 'Switch to gradient mesh background');
        }
    }

    var saved = 'neural';
    try { saved = window.localStorage.getItem(STORAGE_KEY) || 'neural'; } catch (e) {}
    applyMode(saved);

    toggleBtn.addEventListener('click', function () {
        var current = meshBg.classList.contains('active') ? 'mesh' : 'neural';
        var next     = current === 'mesh' ? 'neural' : 'mesh';
        applyMode(next);
        try { window.localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
})();

// ===================== KONAMI CODE EASTER EGG =====================
(function () {
    var toast   = document.getElementById('konami-toast');
    var confCvs = document.getElementById('konami-confetti');
    if (!toast || !confCvs) return;

    var sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    var progress = 0;

    function launchConfetti() {
        var ctx = confCvs.getContext('2d');
        var W = confCvs.width  = window.innerWidth;
        var H = confCvs.height = window.innerHeight;
        var colors = ['#00c8ff', '#7b5ea7', '#00ff9d', '#ffffff'];
        var pieces = [];
        var count  = 160;

        for (var i = 0; i < count; i++) {
            pieces.push({
                x: Math.random() * W,
                y: -20 - Math.random() * H * 0.5,
                w: 6 + Math.random() * 6,
                h: 8 + Math.random() * 10,
                vx: (Math.random() - 0.5) * 3,
                vy: 2 + Math.random() * 3,
                rot: Math.random() * Math.PI * 2,
                vrot: (Math.random() - 0.5) * 0.3,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        confCvs.classList.add('active');
        var start = Date.now();
        var durationMs = 3200;

        function frame() {
            ctx.clearRect(0, 0, W, H);
            var elapsed = Date.now() - start;
            pieces.forEach(function (p) {
                p.x   += p.vx;
                p.y   += p.vy;
                p.rot += p.vrot;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });

            if (elapsed < durationMs) {
                requestAnimationFrame(frame);
            } else {
                confCvs.classList.remove('active');
                ctx.clearRect(0, 0, W, H);
            }
        }
        requestAnimationFrame(frame);
    }

    function triggerEasterEgg() {
        toast.classList.add('show');
        launchConfetti();
        setTimeout(function () { toast.classList.remove('show'); }, 6000);
    }

    document.addEventListener('keydown', function (e) {
        var key = e.key;
        var expected = sequence[progress];
        if (key === expected || key.toLowerCase() === expected) {
            progress++;
            if (progress === sequence.length) {
                progress = 0;
                triggerEasterEgg();
            }
        } else {
            progress = (key === sequence[0]) ? 1 : 0;
        }
    });
})();

// ===================== SCROLL PROGRESS BAR =====================
(function () {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;

    function update() {
        var scrollTop    = window.scrollY;
        var docHeight    = document.documentElement.scrollHeight - window.innerHeight;
        var pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width  = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
})();

// ===================== BACK TO TOP =====================
(function () {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 500) btn.classList.add('show');
        else btn.classList.remove('show');
    }, { passive: true });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ===================== ANIMATED STAT COUNTERS =====================
(function () {
    var counters = document.querySelectorAll('.count-up');
    if (!counters.length) return;

    function animateCounter(el) {
        var target   = parseFloat(el.getAttribute('data-target')) || 0;
        var suffix   = el.getAttribute('data-suffix') || '';
        var duration = 1400;
        var start    = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased    = 1 - Math.pow(1 - progress, 3);
            var value    = Math.round(eased * target);
            el.textContent = value + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
})();

// ===================== PROJECT FILTERS =====================
(function () {
    var filterBar = document.getElementById('project-filters');
    if (!filterBar) return;
    var buttons = filterBar.querySelectorAll('.filter-btn');
    var cards   = document.querySelectorAll('.project-card');

    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            buttons.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var filter = btn.getAttribute('data-filter');

            cards.forEach(function (card) {
                var category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('filtered-out');
                } else {
                    card.classList.add('filtered-out');
                }
            });
        });
    });
})();

// ===================== LIVE GITHUB STATS =====================
(function () {
    var grid = document.getElementById('gh-stats-grid');
    var note = document.getElementById('gh-stats-note');
    if (!grid || !note) return;

    var GH_USERNAME = 'VikashCDS';
    var loaded = false;

    function animateValue(el, target) {
        var duration = 1200, start = null;
        function step(ts) {
            if (!start) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            el.textContent = Math.round(progress * target);
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function loadStats() {
        if (loaded) return;
        loaded = true;

        fetch('https://api.github.com/users/' + GH_USERNAME)
            .then(function (res) {
                if (!res.ok) throw new Error('GitHub API error: ' + res.status);
                return res.json();
            })
            .then(function (data) {
                animateValue(document.getElementById('gh-repos'), data.public_repos || 0);
                animateValue(document.getElementById('gh-followers'), data.followers || 0);
                animateValue(document.getElementById('gh-following'), data.following || 0);
                animateValue(document.getElementById('gh-gists'), data.public_gists || 0);
                note.innerHTML = '<i class="bx bx-check-circle"></i> Live data pulled directly from github.com/' + GH_USERNAME;
            })
            .catch(function () {
                note.innerHTML = '<i class="bx bx-error-circle"></i> Could not fetch live GitHub data right now.';
                note.classList.add('error');
            });
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                loadStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    var target = document.getElementById('github-stats');
    if (target) observer.observe(target);
})();

// ===================== CONTACT FORM =====================
(function () {
    var form     = document.getElementById('contact-form');
    var messages = document.getElementById('form-messages');
    if (!form || !messages) return;

    var btn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        messages.textContent = '';
        if (!form.checkValidity()) {
            messages.style.color = '#ff5f5f';
            messages.textContent = 'Please fill out all required fields.';
            return;
        }
        btn.disabled   = true;
        btn.innerHTML  = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';

        fetch('https://formspree.io/f/mjkeqpwy', {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
        })
        .then(function (res) {
            btn.disabled  = false;
            btn.innerHTML = '<i class="bx bx-send"></i> Send Message';
            if (res.ok) {
                form.reset();
                messages.style.color = '#00ff9d';
                messages.textContent = 'Message sent! I\'ll get back to you soon.';
            } else {
                messages.style.color = '#ff5f5f';
                messages.textContent = 'Something went wrong. Please try again.';
            }
        })
        .catch(function () {
            btn.disabled  = false;
            btn.innerHTML = '<i class="bx bx-send"></i> Send Message';
            messages.style.color = '#ff5f5f';
            messages.textContent = 'Network error. Check your connection.';
        });
    });
})();
