import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

import modelpath from "./assets/pill.glb";
import gameover from "./assets/gameover.wav";
import loselife from "./assets/loselife.wav";
import getpoint from "./assets/getpoint.wav";
import starbgsquare from "./assets/starbackgroundsquare.jpg";

// collision boxes
let modelBox;

// add model
let loader = new GLTFLoader();
let model;

let speed = 0.18;

let keysPressed = {};


let camera, cameraUpper, CurrentCamera;
let scene, renderer, canvas, controls, ground;
let ambientLight, directionalLight;

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
let aspect = window.innerWidth / window.innerHeight;

let lifetext = "Life: "
let scoretext = "Score: "
let endtext = "Game Over"
let finaltext = "Final Score: "

function main() {

    let lang = new URLSearchParams(window.location.search).get('lang');

    if (lang === "zh") {
        lifetext = "生命: "
        scoretext = "分数: "
        endtext = "游戏结束"
        finaltext = "最终得分: "

        document.getElementById("score").innerHTML = scoretext + 0;
        document.getElementById("life").innerHTML = lifetext + 3;
        document.getElementById("endText").innerHTML = endtext;
        document.getElementById("restart").innerHTML = "点击这里回到主菜单"
        document.getElementById("restart").href = "index-zh.html"

    }

    canvas = document.getElementById("gl-canvas");
    // apply antialias to give better effect
    renderer = new THREE.WebGLRenderer({canvas, antialias: true});

    camera = createCamera(3);
    cameraUpper = createCamera(5);
    // set init camera
    CurrentCamera = camera;

    scene = new THREE.Scene();

    // fit screen size
    renderer.setSize(width, height);

    // Enable Shadows in the Renderer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // create background
    createBackground();

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
    window.addEventListener('resize', onWindowResize);

    window.addEventListener('keydown', function (event) {
        keysPressed[event.key] = true;
    });

    window.addEventListener('keyup', function (event) {
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
    newcamera.lookAt(new THREE.Vector3(0, 0, -10));
    return newcamera;
}

function createPlane() {
    // smoother surface
    let geometry = new THREE.PlaneGeometry(13, 60, 2, 10);
    // self lighting red
    let material = new THREE.MeshPhongMaterial({
        color: 0x999999,
        emissive: 0xff0000,
        emissiveIntensity: 0.2,
        side: THREE.DoubleSide
    });
    let plane = new THREE.Mesh(geometry, material);

    plane.position.set(0, 0, -30);
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);
}

function createLights() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(0, 5, -50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

}

function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    aspect = window.innerWidth / window.innerHeight;

    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.render(scene, camera);
}

function createModel() {
    loader.load(modelpath, function (gltf) {
        model = gltf.scene;
        model.scale.set(0.35, 0.35, 0.35);
        model.position.set(0, 0, -3);
        gltf.scene.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
            }
        });
        scene.add(model);

        // add bounding box
        modelBox = new THREE.Box3().setFromObject(model);

    }, undefined, function (error) {
        console.error(error);
    });
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
        // move star
        star.position.z += speed;

        // set star visible range
        star.visible = star.position.z < 0 && star.position.z > -60;

        // reset star position
        if (star.position.z > 0) {
            // star.visible = true;
            star.position.x = randomNum(-5, 5);
            star.position.z += randomNum(-90, -40);
        }

        // detect collision
        let starSphere = new THREE.Sphere(star.position, 0.18);
        if (modelBox && modelBox.intersectsSphere(starSphere)) {
            // reset star position
            star.position.x = randomNum(-5, 5);
            star.position.z += randomNum(-90, -40);
            score += 1;
            document.getElementById("score").innerHTML = scoretext + score;
            // play sound effect
            let audio = new Audio(getpoint);
            audio.play();
        }

    });

    cubes.forEach(cube => {
        // move cube
        cube.position.z += speed;

        // set cube visible range
        cube.visible = cube.position.z < 0 && cube.position.z > -60;

        // reset cube position
        if (cube.position.z > 0) {
            // cube.visible = true;
            cube.position.x = randomNum(-5, 5);
            cube.position.z += randomNum(-90, -40);
        }

        //rotate cube
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        let cubeBox = new THREE.Box3().setFromObject(cube);
        console.log(cubeBox);
        if (modelBox && modelBox.intersectsBox(cubeBox)) {
            // reset cube position
            cube.position.x = randomNum(-5, 5);
            cube.position.z += randomNum(-90, -40);
            life -= 1;
            document.getElementById("life").innerHTML = lifetext + life;
            // play sound effect
            if (life !== 0) {
                let audio = new Audio(loselife);
                audio.play();
            } else {
                let audio = new Audio(gameover);
                audio.play();
                gameend = true;
                document.getElementById("finalScore").innerHTML = finaltext + score;
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
    }
}

function randomNum(min, max) {
    return Math.random() * (max - min) + min;
}

function createStar() {
    let geometry = new THREE.SphereGeometry(0.2, 32, 32);
    let material = new THREE.MeshMatcapMaterial({color: 0xffff00});
    star = new THREE.Mesh(geometry, material);
    star.castShadow = true;
    star.receiveShadow = true;
    scene.add(star);
    return star;
}

function createStars() {
    for (let i = 0; i < 15; i += 1) {
        star = createStar();
        star.position.set(randomNum(-5, 5), 0.5, randomNum(-90, -40));
        stars.push(star);
        scene.add(star);
    }
}

function createBackground() {
    // Adds a background of stars to a skybox
    const cubeloader = new THREE.CubeTextureLoader();
    let cubetexture = cubeloader.load([
        starbgsquare, // right
        starbgsquare, // left
        starbgsquare, // top
        starbgsquare, // bottom
        starbgsquare, // front
        starbgsquare  // back
    ]);
    scene.background = cubetexture;
}

function createcube() {
    let geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    let material = new THREE.MeshPhongMaterial({color: 0xff0000, transparent: true, opacity: 0.6});
    cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.rotation.x = Math.PI / 4;
    cube.rotation.y = Math.PI / 4;

    scene.add(cube);
    return cube;
}

function createcubes() {
    for (let i = 0; i < 5; i += 1) {
        cube = createcube();
        cube.position.set(randomNum(-5, 5), 0.5, randomNum(-90, -40));
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
    crystal1.position.set(-3, 4, -5);
    crystal1.castShadow = true;
    crystal1.rotation.y = Math.PI / 4;

    crystal2 = new THREE.Mesh(geometry, material);
    crystal2.position.set(3, 3.5, -6);
    crystal2.castShadow = true;
    crystal2.rotation.y = Math.PI / 4;

    scene.add(crystal1, crystal2);

    let spotlight1 = new THREE.SpotLight(0x5e2e68, 18);
    spotlight1.position.set(-3, 5, -5);
    spotlight1.target = crystal1;
    spotlight1.castShadow = true;

    let spotlight2 = new THREE.SpotLight(0x1e8fac, 18);
    spotlight2.position.set(3, 4.5, -6);
    spotlight2.target = crystal2;
    scene.add(spotlight1, spotlight2);
}