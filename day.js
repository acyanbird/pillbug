import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

import grassimg from "./assets/gm.jpg";
import modelpath from "./assets/pill.glb";
import gameover from "./assets/gameover.wav";
import loselife from "./assets/loselife.wav";
import getpoint from "./assets/getpoint.wav";

// collision boxes
let modelBox;

// add model
let loader = new GLTFLoader();
let model;

let speed = 0.16;

let keysPressed = {};


let camera, cameraUpper, CurrentCamera;
let scene, renderer, canvas, controls, ground;
let ambientLight

let life = 3;
let score = 0;
let gameend = false;

// dodecas
let dodeca;
let dodecas = [];

// stars
let star;
let stars = [];

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

    // set background color
    renderer.setClearColor(new THREE.Color("skyblue"));

    createLights();
    createdodecas();
    createStars();
    createTorus("red", -50, 2);
    createTorus("cyan", -20, 1);
    createTorus("yellow", -10, 0.5);

    createModel();

    // Create a plane that receives shadows (but does not cast them)
    createPlane();

    renderer.render(scene, CurrentCamera);

    // if clicked, switch camera
    window.addEventListener('click', function () {
        switchCamera();
    });

    animate();

    // resize window
    window.addEventListener('resize', onWindowResize);

    // model movement
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
    // create texture
    let texture = new THREE.TextureLoader().load(grassimg);

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 12);
    // smoother surface
    let geometry = new THREE.PlaneGeometry(10, 120, 1, 12);
    // self lighting red
    let material = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});
    let plane = new THREE.Mesh(geometry, material);

    plane.position.set(0, 0, -60);
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);
}

function createLights() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 3, 20);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight("orange", 1);
    directionalLight2.position.set(0, 20, -20);
    directionalLight2.castShadow = true;
    scene.add(directionalLight2);

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
        model.scale.set(0.3, 0.3, 0.3);
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
        star.visible = star.position.z < 0 && star.position.z > -100;

        // reset star position
        if (star.position.z > 0) {
            // star.visible = true;
            star.position.x = randomNum(-4, 4);
            star.position.z += randomNum(-110, -60);
        }

        //rotate star
        star.rotation.x += 0.01;
        star.rotation.y += 0.01;

        // detect collision
        let starSphere = new THREE.Sphere(star.position, 0.18);
        if (modelBox && modelBox.intersectsSphere(starSphere)) {
            // reset star position
            star.position.x = randomNum(-4, 4);
            star.position.z += randomNum(-110, -60);
            score += 1;

            document.getElementById("score").innerHTML = scoretext + score;
            // play sound effect
            let audio = new Audio(getpoint);
            audio.play();
        }

    });

    dodecas.forEach(dodeca => {
        // move dodeca
        dodeca.position.z += speed;

        // set dodeca visible range
        dodeca.visible = dodeca.position.z < 0 && dodeca.position.z > -100;

        // reset dodeca position
        if (dodeca.position.z > 0) {
            // dodeca.visible = true;
            dodeca.position.x = randomNum(-4, 4);
            dodeca.position.z += randomNum(-140, -60);
        }

        //rotate dodeca
        dodeca.rotation.x += 0.01;
        dodeca.rotation.y += 0.01;

        // detect collision
        let dodecaSphere = new THREE.Sphere(dodeca.position, 0.35);
        if (modelBox && modelBox.intersectsSphere(dodecaSphere)) {
            // reset dodeca position
            dodeca.position.x = randomNum(-4, 4);
            dodeca.position.z += randomNum(-140, -60);
            life -= 1;
            document.getElementById("life").innerHTML = lifetext+ life;
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

    if (keysPressed['ArrowLeft'] && model.position.x > -3.5) {
        model.position.x -= 0.05
    }
    if (keysPressed['ArrowRight'] && model.position.x < 3.5) {
        model.position.x += 0.05
    }

    renderer.render(scene, CurrentCamera);

    if (!gameend) {
        requestAnimationFrame(animate);
    }
}

function randomNum(min, max) {
    return Math.random() * (max - min) + min;
}

function createdodeca() {
    let geometry = new THREE.DodecahedronGeometry(0.4);
    let material = new THREE.MeshPhongMaterial({color: 0xFFC0CB, transparent: true, opacity: 0.9});
    dodeca = new THREE.Mesh(geometry, material);
    dodeca.castShadow = true;
    dodeca.receiveShadow = true;
    dodeca.rotation.x = Math.PI / 4;
    dodeca.rotation.y = Math.PI / 4;

    scene.add(dodeca);
    return dodeca;
}

function createdodecas() {
    for (let i = 0; i < 5; i += 1) {
        dodeca = createdodeca();
        dodeca.position.set(randomNum(-4, 4), 0.5, randomNum(-140, -60));
        dodecas.push(dodeca);
        scene.add(dodeca);

        // add bounding box
        dodeca.boundingBox = new THREE.Box3().setFromObject(dodeca);
    }
}

function createStar() {
    let geometry = new THREE.SphereGeometry(0.2, 32, 32);
    let material = new THREE.MeshStandardMaterial({color: 0xFFD700, metalness: 0.8, roughness: 0.5});
    star = new THREE.Mesh(geometry, material);
    star.castShadow = true;
    star.receiveShadow = true;
    scene.add(star);
    // add bounding sphere
    star.geometry.computeBoundingSphere();
    star.boundingSphere = star.geometry.boundingSphere;
    return star;
}

function createStars() {
    for (let i = 0; i < 15; i += 1) {
        star = createStar();
        star.position.set(randomNum(-4, 4), 0.2, randomNum(-140, -60));
        stars.push(star);
        scene.add(star);
    }
}

function createTorus(color, z, tube) {
    let geometry = new THREE.TorusGeometry(7, tube, 16, 100);
    let material = new THREE.MeshPhongMaterial({color: color});
    let torus = new THREE.Mesh(geometry, material);
    torus.castShadow = true;
    torus.position.set(0, 0, z)
    scene.add(torus);
}

