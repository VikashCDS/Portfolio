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
