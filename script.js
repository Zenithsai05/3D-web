$(document).ready(function() {
    gsap.registerPlugin(ScrollTrigger);

    // Custom Cursor Animation
    const cursor = $('.cursor');
    const follower = $('.cursor-follower');
    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;

    $(document).mousemove(function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    gsap.to({}, 0.016, {
        repeat: -1,
        onRepeat: function() {
            posX += (mouseX - posX) / 9;
            posY += (mouseY - posY) / 9;

            gsap.set(cursor, { left: mouseX, top: mouseY });
            gsap.set(follower, { left: posX - 20, top: posY - 20 });
        }
    });

    // Cursor Interaction with Elements
    $('.nav-link, .navbar-brand, .template-card, .about-content, .contact-form, .cta-btn').hover(
        function() {
            gsap.to(cursor, { scale: 2, background: 'radial-gradient(circle, #5e60ce 20%, transparent 80%)' });
            gsap.to(follower, { scale: 1.5, borderColor: '#54f1d2', background: 'rgba(84, 241, 210, 0.1)' });
        },
        function() {
            gsap.to(cursor, { scale: 1, background: 'radial-gradient(circle, #54f1d2 20%, transparent 80%)' });
            gsap.to(follower, { scale: 1, borderColor: '#5e60ce', background: 'rgba(94, 96, 206, 0.1)' });
        }
    );

    // Navbar Scroll Animation
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('navbar-scrolled');
        } else {
            $('.navbar').removeClass('navbar-scrolled');
        }
    });

    gsap.from('.navbar', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    $('.nav-link').each(function(index) {
        gsap.from(this, {
            y: -20,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'power2.out'
        });
    });

    // Three.js Starry Sky with Planets and Cursor Interaction
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Stars
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, transparent: true });
    const starsCount = 5000;
    const positions = new Float32Array(starsCount * 3);
    const starVelocities = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 2000;
        starVelocities[i] = 0;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Planets
    const planet1Geometry = new THREE.SphereGeometry(5, 32, 32);
    const planet1Material = new THREE.MeshPhongMaterial({ color: 0x5e60ce, shininess: 100 });
    const planet1 = new THREE.Mesh(planet1Geometry, planet1Material);
    planet1.position.set(20, 10, -50);
    scene.add(planet1);

    const planet2Geometry = new THREE.SphereGeometry(3, 32, 32);
    const planet2Material = new THREE.MeshPhongMaterial({ color: 0x54f1d2, shininess: 100 });
    const planet2 = new THREE.Mesh(planet2Geometry, planet2Material);
    planet2.position.set(-30, -15, -60);
    scene.add(planet2);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    camera.position.z = 50;

    function animate() {
        requestAnimationFrame(animate);

        // Star movement with cursor interaction
        const positions = starGeometry.attributes.position.array;
        for (let i = 0; i < starsCount * 3; i += 3) {
            const dx = positions[i] - (mouseX - window.innerWidth / 2) / 20;
            const dy = positions[i + 1] - (mouseY - window.innerHeight / 2) / 20;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                starVelocities[i] += dx * 0.001;
                starVelocities[i + 1] += dy * 0.001;
            }

            positions[i] += starVelocities[i];
            positions[i + 1] += starVelocities[i + 1];
            starVelocities[i] *= 0.98;
            starVelocities[i + 1] *= 0.98;

            if (Math.abs(positions[i]) > 1000 || Math.abs(positions[i + 1]) > 1000) {
                positions[i] = (Math.random() - 0.5) * 2000;
                positions[i + 1] = (Math.random() - 0.5) * 2000;
                starVelocities[i] = 0;
                starVelocities[i + 1] = 0;
            }
        }
        starGeometry.attributes.position.needsUpdate = true;

        // Planet animations
        planet1.position.x = 20 * Math.cos(Date.now() * 0.001);
        planet1.position.z = -50 + 20 * Math.sin(Date.now() * 0.001);
        planet1.rotation.y += 0.01;

        planet2.position.x = -30 * Math.cos(Date.now() * 0.0008);
        planet2.position.z = -60 + 15 * Math.sin(Date.now() * 0.0008);
        planet2.rotation.y += 0.015;

        renderer.render(scene, camera);
    }
    animate();

    $(window).resize(function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Scroll Animations
    gsap.from('.display-1', {
        opacity: 0,
        y: 150,
        duration: 1.5,
        ease: 'expo.out'
    });

    gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.5,
        ease: 'expo.out'
    });

    gsap.from('.cta-btn', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.8,
        ease: 'expo.out'
    });

    $('.content-section').each(function() {
        gsap.from($(this).find('.section-title'), {
            scrollTrigger: {
                trigger: this,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            x: -100,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from($(this).find('.template-card, .about-content, .contact-form'), {
            scrollTrigger: {
                trigger: this,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 100,
            duration: 1,
            delay: 0.3,
            stagger: 0.2,
            ease: 'power3.out'
        });
    });

    gsap.to(planet1.position, {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1
        },
        y: -20,
        ease: 'none'
    });

    gsap.to(planet2.position, {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1
        },
        y: 15,
        ease: 'none'
    });

    // Contact Form Handling
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();

        // Bootstrap validation
        const form = this;
        if (!form.checkValidity()) {
            e.stopPropagation();
            $(form).addClass('was-validated');
            return;
        }

        // Simulate form submission (replace with actual backend logic)
        const formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            message: $('#message').val()
        };

        // Simple client-side validation
        if (!formData.name || !formData.email || !formData.message) {
            $('#formMessage').removeClass('success').addClass('error').text('Please fill out all fields.');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            $('#formMessage').removeClass('success').addClass('error').text('Please enter a valid email address.');
            return;
        }

        // Simulate successful submission
        $('#formMessage').removeClass('error').addClass('success').text('Message sent successfully!');
        form.reset();
        $(form).removeClass('was-validated');

        // Clear message after 3 seconds
        setTimeout(() => {
            $('#formMessage').text('');
        }, 3000);
    });
});