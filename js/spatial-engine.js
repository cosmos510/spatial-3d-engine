class SpatialEngine {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = null;
        this.lights = [];
        this.cube = null;
        this.time = 0;
        this.stats = { fps: 0, triangles: 0, lights: 0 };
        this.cameraDistance = 5;
        this.rotationX = 0;
        this.rotationY = 0;
        
        this.init();
        this.setupLighting();
        this.setupGeometry();
        this.setupControls();
        this.animate();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x0a0a0f);
        
        document.getElementById('container').appendChild(this.renderer.domElement);
        
        this.camera.position.set(0, 0, 5);
        this.camera.lookAt(0, 0, 0);
        
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
    }

    setupLighting() {
        // Lumière ambiante
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Lumière directionnelle principale
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
        dirLight.position.set(-5, 8, 5);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        this.scene.add(dirLight);
        this.lights.push(dirLight);

        // Lumière d'accent colorée
        const accentLight = new THREE.PointLight(0x4080ff, 0.3, 100);
        accentLight.position.set(3, -2, 4);
        this.scene.add(accentLight);
        this.lights.push(accentLight);

        this.stats.lights = this.lights.length;
    }

    setupGeometry() {
        // Cube avec matériaux différents par face
        const geometry = new THREE.BoxGeometry(3, 3, 3);
        
        // Matériaux pour chaque face (même couleurs que le code C)
        const materials = [
            new THREE.MeshLambertMaterial({ color: 0xcc3333 }), // Rouge (droite)
            new THREE.MeshLambertMaterial({ color: 0x33cc33 }), // Vert (gauche)
            new THREE.MeshLambertMaterial({ color: 0x3380e6 }), // Bleu (haut)
            new THREE.MeshLambertMaterial({ color: 0xe6cc33 }), // Jaune (bas)
            new THREE.MeshLambertMaterial({ color: 0xe6803d }), // Orange (avant)
            new THREE.MeshLambertMaterial({ color: 0x9933cc })  // Violet (arrière)
        ];

        this.cube = new THREE.Mesh(geometry, materials);
        this.cube.castShadow = true;
        this.cube.receiveShadow = true;
        this.scene.add(this.cube);

        // Plan pour recevoir les ombres
        const planeGeometry = new THREE.PlaneGeometry(20, 20);
        const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -3;
        plane.receiveShadow = true;
        this.scene.add(plane);

        this.stats.triangles = geometry.attributes.position.count / 3;
    }

    setupControls() {
        let mouseDown = false;
        let mouseX = 0, mouseY = 0;

        this.renderer.domElement.addEventListener('mousedown', (e) => {
            mouseDown = true;
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        this.renderer.domElement.addEventListener('mouseup', () => {
            mouseDown = false;
        });

        this.renderer.domElement.addEventListener('mousemove', (e) => {
            if (!mouseDown) return;

            const dx = e.clientX - mouseX;
            const dy = e.clientY - mouseY;

            this.rotationY += dx * 0.01;
            this.rotationX -= dy * 0.01;

            this.rotationX = Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, this.rotationX));

            this.camera.position.x = this.cameraDistance * Math.cos(this.rotationX) * Math.cos(this.rotationY);
            this.camera.position.y = this.cameraDistance * Math.sin(this.rotationX);
            this.camera.position.z = this.cameraDistance * Math.cos(this.rotationX) * Math.sin(this.rotationY);
            this.camera.lookAt(0, 0, 0);

            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Zoom avec molette (met à jour cameraDistance)
        this.renderer.domElement.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomSpeed = 0.3;
            const delta = e.deltaY > 0 ? zoomSpeed : -zoomSpeed;
            
            this.cameraDistance += delta;
            this.cameraDistance = Math.max(1, Math.min(15, this.cameraDistance));
            
            this.camera.position.normalize().multiplyScalar(this.cameraDistance);
        });
    }

    updateLighting() {
        // Animation de la lumière principale
        const angle = this.time * 0.3;
        this.lights[0].position.x = -5 * Math.cos(angle);
        this.lights[0].position.z = 5 * Math.sin(angle);

        // Animation de la lumière d'accent (couleur et intensité)
        this.lights[1].intensity = 0.2 + 0.15 * Math.sin(this.time * 1.5);
        const hue = (this.time * 0.1) % 1;
        this.lights[1].color.setHSL(hue, 0.7, 0.6);
    }

    onKeyDown(event) {
        switch(event.key.toLowerCase()) {
            case 'r':
                // Reset caméra
                this.camera.position.set(0, 0, 5);
                this.camera.lookAt(0, 0, 0);
                this.cameraDistance = 5;
                break;
            case 'l':
                // Toggle éclairage
                this.lights.forEach(light => {
                    light.visible = !light.visible;
                });
                break;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    updateStats() {
        const fps = Math.round(1000 / (performance.now() - this.lastTime));
        this.stats.fps = fps || 60;
        
        document.getElementById('fps').textContent = this.stats.fps;
        document.getElementById('triangles').textContent = this.stats.triangles * 12; // 6 faces * 2 triangles
        document.getElementById('lights').textContent = this.stats.lights;
    }

    animate() {
        this.lastTime = performance.now();
        
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.016; // ~60 FPS
        
        // Animation du cube
        this.cube.rotation.x += 0.005;
        this.cube.rotation.y += 0.01;
        
        // Mise à jour éclairage dynamique
        this.updateLighting();
        
        // Rendu
        this.renderer.render(this.scene, this.camera);
        
        // Stats
        this.updateStats();
    }
}

// Initialisation au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    new SpatialEngine();
});