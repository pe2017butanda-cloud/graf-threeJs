// Usamos las rutas simplificadas que configuramos en el HTML
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Configuración Inicial (Escena, Cámara, Renderizador)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111); 
scene.fog = new THREE.Fog(0x111111, 10, 30); 

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 8); 

const renderer = new THREE.WebGLRenderer({ antialias: true }); 
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true; 
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Controles para mover la cámara con el ratón
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.05; 

// 2. Iluminación Avanzada
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
scene.add(dirLight);

// Luces de colores enfocando cada cubo para reflejos
const lightGreen = new THREE.PointLight(0x00ff00, 20, 10);
lightGreen.position.set(-3, 2, 2);
scene.add(lightGreen);

const lightBlue = new THREE.PointLight(0x0000ff, 20, 10);
lightBlue.position.set(0, 2, 2);
scene.add(lightBlue);

const lightRed = new THREE.PointLight(0xff0000, 20, 10);
lightRed.position.set(3, 2, 2);
scene.add(lightRed);

// 3. Suelo (Para recibir sombras)
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x222222, 
    roughness: 0.8,
    metalness: 0.2
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1.5;
plane.receiveShadow = true;
scene.add(plane);

// 4. Función para crear cubos con bordes brillantes
function createFancyCube(color, positionX) {
    const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    
    const material = new THREE.MeshPhysicalMaterial({ 
        color: color, 
        metalness: 0.6,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.x = positionX;

    // Añadir bordes blancos
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 }));
    mesh.add(line); 

    return mesh;
}

// 5. Crear los 3 cubos
const cubeGreen = createFancyCube(0x00ff00, -3); 
const cubeBlue  = createFancyCube(0x0000ff, 0);  
const cubeRed   = createFancyCube(0xff0000, 3);  

scene.add(cubeGreen);
scene.add(cubeBlue);
scene.add(cubeRed);

// 6. Animación
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rotaciones con velocidades distintas
    cubeGreen.rotation.x += 0.01;
    cubeGreen.rotation.y += 0.01;

    cubeBlue.rotation.x += 0.03;
    cubeBlue.rotation.y += 0.03;

    cubeRed.rotation.x -= 0.09; 
    cubeRed.rotation.y += 0.09;

    // Efecto de flotación
    cubeGreen.position.y = Math.sin(elapsedTime * 2) * 0.2;
    cubeBlue.position.y  = Math.sin(elapsedTime * 2 + 1) * 0.2;
    cubeRed.position.y   = Math.sin(elapsedTime * 2 + 2) * 0.2;

    controls.update(); 
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// 7. Hacer la ventana responsiva
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});