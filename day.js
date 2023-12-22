import * as THREE from "three"
import {GLTFLoader} from "three/addons";
import {Sphere} from "three";

// collision boxes

let modelBox;
let starSphere = [];

// add model
let loader = new GLTFLoader();
let model;

let speed = 0.15;

let keysPressed = {};


let camera, cameraUpper, CurrentCamera;
let scene, renderer, canvas, controls, ground;
let ambientLight, light;

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

    // if press key s, switch camera
    window.addEventListener('click', function () {
        switchCamera();
    });

    animate();
    // 监听窗口变化，如果大小改变则调用onWindowResize函数，没用！
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
    // create texture
    let texture = new THREE.TextureLoader().load( "assets/grass.png" );

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1, 12 );
    // smoother surface
    let geometry = new THREE.PlaneGeometry(10, 120, 5, 5);
    // self lighting red
    let material = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});
    let plane = new THREE.Mesh( geometry, material );

    // central point at 0, 0, 0
    plane.position.set(0, 0, -60);
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    scene.add( plane );
}

function createLights() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set( 0, 3, 20 );
    directionalLight.castShadow = true;
    scene.add( directionalLight );

    const directionalLight2 = new THREE.DirectionalLight( "orange", 0.8 );
    directionalLight2.position.set( 0, 20, -20 );
    directionalLight2.castShadow = true;
    scene.add( directionalLight2 );

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
    loader.load( 'assets/pill02.glb', function ( gltf ) {
        model = gltf.scene;
        model.scale.set(0.3, 0.3, 0.3);
        model.position.set(0, 0.5, -2.5);
        model.castShadow = true;
        model.receiveShadow = true;
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

    // set speed

    stars.forEach(star => {
        star.position.z += speed;

        // set star visible range
        star.visible = star.position.z < 0 && star.position.z > -50;

        // reset star position
        if (star.position.z > 0) {
            // star.visible = true;
            star.position.x = randomInt(-4, 4);
            star.position.z += randomInt(-110, -60);
        }

        //rotate star
        star.rotation.x += 0.01;
        star.rotation.y += 0.01;

        // detect collision
        let starSphere = new Sphere(star.position, 0.18);
        if (modelBox && modelBox.intersectsSphere(starSphere)) {
            // reset star position
            star.position.x = randomInt(-4, 4);
            star.position.z += randomInt(-110, -60);
            score += 1;
            document.getElementById("score").innerHTML ="Score: "+ score;
            // play sound effect
            let audio = new Audio('assets/getpoint.wav');
            audio.play();
        }

    });

    dodecas.forEach(dodeca => {
        dodeca.position.z += speed;

        // set dodeca visible range
        dodeca.visible = dodeca.position.z < 0 && dodeca.position.z > -60;

        // reset dodeca position
        if (dodeca.position.z > 0) {
            // dodeca.visible = true;
            dodeca.position.x = randomInt(-4, 4);
            dodeca.position.z += randomInt(-110, -60);
        }

        //rotate dodeca
        dodeca.rotation.x += 0.01;
        dodeca.rotation.y += 0.01;

        // detect collision
        let dodecaSphere = new Sphere(dodeca.position, 0.35);
        if (modelBox && modelBox.intersectsSphere(dodecaSphere)) {
            // reset dodeca position
            dodeca.position.x = randomInt(-4, 4);
            dodeca.position.z += randomInt(-110, -60);
            life -= 1;
            document.getElementById("life").innerHTML ="Life: "+ life;
            // play sound effect
            if (life !== 0) {
                let audio = new Audio('assets/loselife.wav');
                audio.play();
            }
            else {
                let audio = new Audio('assets/gameover.wav');
                audio.play();
                gameend = true;
                document.getElementById("finalScore").innerHTML ="Final Score: "+ score;
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

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createdodeca(){
    let geometry = new THREE.DodecahedronGeometry( 0.4 );
    let material = new THREE.MeshPhongMaterial( {color: 0xFFC0CB, transparent: true, opacity: 0.9} );
    dodeca = new THREE.Mesh( geometry, material );
    dodeca.castShadow = true;
    dodeca.receiveShadow = true;
    dodeca.rotation.x = Math.PI / 4;
    dodeca.rotation.y = Math.PI / 4;

    scene.add( dodeca );
    return dodeca;
}

function createdodecas(){
    for (let i = 0; i < 5; i += 1){
        dodeca = createdodeca();
        dodeca.position.set(randomInt(-4,4), 0.5, randomInt(-120,-80));
        dodecas.push(dodeca);
        scene.add(dodeca);

        // add bounding box
        dodeca.boundingBox = new THREE.Box3().setFromObject(dodeca);
    }
}

function createStar(){
    let geometry = new THREE.SphereGeometry( 0.2, 32, 32 );
    let material = new THREE.MeshStandardMaterial( {color: 0xFFD700, metalness: 0.8, roughness: 0.5} );
    star = new THREE.Mesh( geometry, material );
    star.castShadow = true;
    star.receiveShadow = true;
    scene.add( star );
    // add bounding sphere
    star.geometry.computeBoundingSphere();
    star.boundingSphere = star.geometry.boundingSphere;
    return star;
}

function createStars(){
    for (let i = 0; i < 15; i += 1){
        star = createStar();
        star.position.set(randomInt(-4,4), 0.5, randomInt(-120,-80));
        stars.push(star);
        scene.add(star);
    }
}

function createTorus(color, z, tube){
    let geometry = new THREE.TorusGeometry( 7, tube, 16, 100 );
    let material = new THREE.MeshPhongMaterial( {color: color} );
    let torus = new THREE.Mesh( geometry, material );
    torus.castShadow = true;
    torus.receiveShadow = true;
    torus.position.set(0, 0, z)
    scene.add( torus );
    return torus;
}

