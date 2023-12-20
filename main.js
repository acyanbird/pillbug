import * as THREE from "three"

let camera, cameraUpper, CurrentCamera;
let scene, renderer, canvas, controls, ground;
let ambientLight, light;

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

    // Create a plane that receives shadows (but does not cast them)
    createPlane();

    renderer.render(scene, CurrentCamera);

    // if press key s, switch camera
    window.addEventListener('click', function () {
           switchCamera();
    });

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
    let geometry = new THREE.PlaneGeometry(10, 100, 5, 5);
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