import * as THREE from "three"

let camera, cameraUpper, CurrentCamera;
let scene, renderer, canvas, controls, ground;
let ambientLight, light;

let life = 3;
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

    // Create a plane that receives shadows (but does not cast them)
    createPlane();

    renderer.render(scene, CurrentCamera);

    // if press key s, switch camera
    window.addEventListener('click', function () {
        switchCamera();
    });

    animate();
    // 监听窗口变化，如果大小改变则调用onWindowResize函数，没用！
    // window.addEventListener( 'resize', onWindowResize );
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
    // plane.castShadow = true;
    scene.add( plane );
}

function createLights() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
    directionalLight.position.set( 0, 5, 20 );
    directionalLight.castShadow = true;
    scene.add( directionalLight );


    // light = new THREE.PointLight(0xffffff, 0.8, 18);
    // light.position.set(-3,6,-3);
    //
    // light.castShadow = true;
    // Will not light anything closer than 0.1 units or further than 25 units
    // light.shadow.camera.near = 0.1;
    // light.shadow.camera.far = 25;
    // scene.add(light);

}

function onWindowResize() {
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize( width, height );
    renderer.render(scene, camera);
}

function animate() {

     if (gameend) {
         // show end
         document.getElementById("end").style.display = "block";
         return;
     }
    // set speed
    let speed = 0.15;

    stars.forEach(star => {
        star.position.z += speed;

        // set star visible range
        star.visible = star.position.z < 0 && star.position.z > -50;

        // reset star position
        if (star.position.z > 0) {
            // star.visible = true;
            star.position.x = randomInt(-4, 4);
            star.position.z += randomInt(-120, -80);
        }

        //rotate star
        star.rotation.x += 0.01;
        star.rotation.y += 0.01;

    });

    dodecas.forEach(dodeca => {
        dodeca.position.z += speed;

        // set dodeca visible range
        dodeca.visible = dodeca.position.z < 0 && dodeca.position.z > -60;

        // reset dodeca position
        if (dodeca.position.z > 0) {
            // dodeca.visible = true;
            dodeca.position.x = randomInt(-4, 4);
            dodeca.position.z += randomInt(-90, -40);
        }

        //rotate dodeca
        dodeca.rotation.x += 0.01;
        dodeca.rotation.y += 0.01;


    });

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
        dodeca.position.set(randomInt(-4,4), 0.5, randomInt(-10,10));
        dodecas.push(dodeca);
        scene.add(dodeca);
    }
}

function createStar(){
    let geometry = new THREE.SphereGeometry( 0.2, 32, 32 );
    let material = new THREE.MeshStandardMaterial( {color: 0xFFD700, metalness: 0.8, roughness: 0.5} );
    star = new THREE.Mesh( geometry, material );
    star.castShadow = true;
    star.receiveShadow = true;
    scene.add( star );
    return star;
}

function createStars(){
    for (let i = 0; i < 15; i += 1){
        star = createStar();
        star.position.set(randomInt(-4,4), 0.5, randomInt(-10,10));
        stars.push(star);
        scene.add(star);
    }
}