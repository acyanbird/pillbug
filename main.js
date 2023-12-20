import * as THREE from "three"

let camera, cameraUpper, CurrentCamera;
let scene, renderer, canvas, controls, ground;
let ambientLight, light;

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

    createLights();
    createStars();
    // createStar();

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
    // smoother surface
    let geometry = new THREE.PlaneGeometry(10, 120, 5, 5);
    // self lighting red
    let material = new THREE.MeshPhongMaterial({color: 0x999999, emissive: 0xff0000, emissiveIntensity: 0.2, side: THREE.DoubleSide});
    let plane = new THREE.Mesh( geometry, material );

    // central point at 0, 0, 0
    plane.position.set(0, 0, 0);
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    scene.add( plane );
}

function createLights() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

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
    // set speed
    let speed = 0.1;

    stars.forEach(star => {
        star.position.z += speed;

        // set star visible range
        if (star.position.z < 0 && star.position.z > -50) {
            star.visible = true;
        } else
        {
            star.visible = false;
        }

        // reset star position
        if (star.position.z > 0) {
            // star.visible = true;
            star.position.x = randomInt(-4, 4);
            star.position.z += randomInt(-90, -40);
        }

    });

    renderer.render(scene, CurrentCamera);
    requestAnimationFrame(animate);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createStar(){
    let geometry = new THREE.SphereGeometry( 0.2, 32, 32 );
    let material = new THREE.MeshPhongMaterial( {color: 0xffff00} );
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