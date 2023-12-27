import * as THREE from "three"
import {GLTFLoader} from "three/addons";

// collision boxes
let modelBox;

// add model
let loader = new GLTFLoader();
let model;

let speed = 0.15;

let keysPressed = {};


let camera, cameraUpper, CurrentCamera;
let scene, renderer, canvas, controls, ground;
let ambientLight, light;

let gameend = false;
let life = 3;
let score = 0;

// stars
let star;
let stars = [];

// cubes
let cube;
let cubes = [];

// crystal
let crystal1, crystal2;

let width = window.innerWidth;
let height = window.innerHeight;
let aspect = window.innerWidth/window.innerHeight;
function main() {
    canvas = document.getElementById( "gl-canvas" );
    renderer = new THREE.WebGLRenderer({canvas});

    camera = createCamera(3);
    cameraUpper = createCamera(5);
    // set init camera
    CurrentCamera = camera;

    scene = new THREE.Scene();

    // fit screen size
    renderer.setSize(width, height);

    // Enable Shadows in the Renderer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    // create background
    let background = createBackground();
    scene.add(background);

    // add fog
    scene.fog = new THREE.FogExp2(0x090912, 0.035);

    createCrystal();

    createLights();
    createStars();
    createcubes();
    createModel();


    // Create a plane that receives shadows (but does not cast them)
    createPlane();

    renderer.render(scene, CurrentCamera);

    // if press key s, switch camera
    window.addEventListener('click', function () {
           switchCamera();
    });

    animate();
    // 监听窗口变化，如果大小改变则调用onWindowResize函数
    window.addEventListener( 'resize', onWindowResize );

    window.addEventListener('keydown', function(event) {
        keysPressed[event.key] = true;
    });

    window.addEventListener('keyup', function(event) {
        keysPressed[event.key] = false;
    });
}

main();

function switchCamera() {
    if (CurrentCamera === camera) {
        CurrentCamera = cameraUpper;
    } else {
        CurrentCamera = camera;
    }
    renderer.render(scene, CurrentCamera);
}
function createCamera(y) {
    let newcamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    newcamera.position.y = y;
    newcamera.lookAt(new THREE.Vector3(0,0,-10));
    return newcamera;
}

function createPlane(){
    // smoother surface
    let geometry = new THREE.PlaneGeometry(13, 120, 5, 5);
    // self lighting red
    let material = new THREE.MeshPhongMaterial({color: 0x999999, emissive: 0xff0000, emissiveIntensity: 0.2, side: THREE.DoubleSide});
    let plane = new THREE.Mesh( geometry, material );

    // central point at 0, 0, 0
    plane.position.set(0, 0, 0);
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    // plane.castShadow = true;
    scene.add( plane );
}

function createLights() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
    directionalLight.position.set( 0, 5, -50 );
    directionalLight.castShadow = true;
    scene.add( directionalLight );

}

function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    aspect = window.innerWidth/window.innerHeight;

    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize( width, height );
    renderer.render(scene, camera);
}

function createModel(){
    loader.load( './assets/pill.glb', function ( gltf ) {
        model = gltf.scene;
        model.scale.set(0.3, 0.3, 0.3);
        model.position.set(0, 0.2, -3);
        gltf.scene.traverse(function(node) {
            if (node.isMesh) {
                node.castShadow = true;
            }
        });
        scene.add( model );

        // add bounding box
        modelBox = new THREE.Box3().setFromObject(model);

    }, undefined, function ( error ) {
        console.error( error );
    } );
}



function animate() {
    if (gameend) {
        // show end
        document.getElementById("end").style.display = "block";
        return;
    }

    // update bounding box for model
    if (model) {
        modelBox.setFromObject(model);
    }
    stars.forEach(star => {
        star.position.z += speed;

        // set star visible range
        star.visible = star.position.z < 0 && star.position.z > -50;

        // reset star position
        if (star.position.z > 0) {
            // star.visible = true;
            star.position.x = randomInt(-5, 5);
            star.position.z += randomInt(-90, -40);
        }

        // detect collision
        let starSphere = new THREE.Sphere(star.position, 0.18);
        if (modelBox && modelBox.intersectsSphere(starSphere)) {
            // reset star position
            star.position.x = randomInt(-5, 5);
            star.position.z += randomInt(-90, -40);
            score += 1;
            document.getElementById("score").innerHTML ="Score: "+ score;
            // play sound effect
            let audio = new Audio('./assets/getpoint.wav');
            audio.play();
        }

    });

    cubes.forEach(cube => {
        cube.position.z += speed;

        // set cube visible range
        cube.visible = cube.position.z < 0 && cube.position.z > -60;

        // reset cube position
        if (cube.position.z > 0) {
            // cube.visible = true;
            cube.position.x = randomInt(-5, 5);
            cube.position.z += randomInt(-90, -40);
        }

        //rotate cube
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        let cubeBox = new THREE.Box3().setFromObject(cube);
        console.log(cubeBox);
        if (modelBox && modelBox.intersectsBox(cubeBox)) {
            // reset cube position
            cube.position.x = randomInt(-5, 5);
            cube.position.z += randomInt(-90, -40);
            life -= 1;
            document.getElementById("life").innerHTML ="Life: "+ life;
            // play sound effect
            if (life !== 0) {
                let audio = new Audio('./assets/loselife.wav');
                audio.play();
            }
            else {
                let audio = new Audio('./assets/gameover.wav');
                audio.play();
                gameend = true;
                document.getElementById("finalScore").innerHTML ="Final Score: "+ score;
                document.getElementById("end").style.display = "block";
            }
        }

    });

    // move model while in range

    if (keysPressed['ArrowLeft'] && model.position.x > -4.5) {
        model.position.x -= 0.065
    }
    if (keysPressed['ArrowRight'] && model.position.x < 4.5) {
        model.position.x += 0.065
    }

    // rotate crystal
    crystal1.rotation.x += 0.01;
    crystal1.rotation.y += 0.01;

    crystal2.rotation.x += 0.01;
    crystal2.rotation.y += 0.01;


    renderer.render(scene, CurrentCamera);

    if (!gameend) {
        requestAnimationFrame(animate);
    }}

function randomInt(min, max) {
    return Math.random() * (max - min) + min;
}

function createStar(){
    let geometry = new THREE.SphereGeometry( 0.2, 32, 32 );
    let material = new THREE.MeshMatcapMaterial( {color: 0xffff00} );
    star = new THREE.Mesh( geometry, material );
    star.castShadow = true;
    star.receiveShadow = true;
    scene.add( star );
    return star;
}

function createStars(){
    for (let i = 0; i < 15; i += 1){
        star = createStar();
        star.position.set(randomInt(-5,5), 0.5, randomInt(-70,-50));
        stars.push(star);
        scene.add(star);
    }
}

function createBackground() {
    // Adds a background of stars to a sphere to visualize space
    let texture = new THREE.TextureLoader().load("./assets/backgroundstar.jpg");
    let material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
    });
    let sphere = new THREE.SphereGeometry(40, 64, 64);
    return new THREE.Mesh(sphere, material);
}

function createcube(){
    let geometry = new THREE.BoxGeometry( 0.6, 0.6, 0.6 );
    let material = new THREE.MeshPhongMaterial( {color: 0xff0000, transparent: true, opacity: 0.6} );
    cube = new THREE.Mesh( geometry, material );
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.rotation.x = Math.PI / 4;
    cube.rotation.y = Math.PI / 4;

    scene.add( cube );
    return cube;
}

function createcubes(){
    for (let i = 0; i < 5; i += 1){
        cube = createcube();
        cube.position.set(randomInt(-5, 5), 0.5, randomInt(-70,-50));
        cubes.push(cube);
        scene.add(cube);
    }
}

function createCrystal() {
    let geometry = new THREE.OctahedronGeometry(0.4);
    let material = new THREE.MeshPhysicalMaterial({
        color: "white", // Purple color
        transparent: true,
        opacity: 0.5,
        roughness: 0.3,
        reflectivity: 0.7,
        clearcoat: 0.8
    });
    crystal1 = new THREE.Mesh(geometry, material);
    crystal1.position.set(-3, 4, -5); // 设置水晶的位置
    crystal1.castShadow = true;
    crystal1.rotation.y = Math.PI / 4;

    crystal2 = new THREE.Mesh(geometry, material);
    crystal2.position.set(3, 3.5, -6); // 设置水晶的位置
    crystal2.castShadow = true;
    crystal2.rotation.y = Math.PI / 4;

    scene.add(crystal1, crystal2);

    let spotlight1 = new THREE.SpotLight("red", 8);
    spotlight1.position.set(-3, 5, -5);
    spotlight1.target = crystal1;
    spotlight1.castShadow = true;

    let spotlight2 = new THREE.SpotLight("blue", 8);
    spotlight2.position.set(3, 4.5, -6);
    spotlight2.target = crystal2;
    scene.add(spotlight1, spotlight2);
}