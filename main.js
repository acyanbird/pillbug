import * as THREE from "three"

let camera, scene, renderer, canvas, controls, ground;
let ambientLight, light;

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;
let ASPECT_RATIO = window.innerWidth/window.innerHeight;
function main() {
    canvas = document.getElementById( "gl-canvas" );
    renderer = new THREE.WebGLRenderer({canvas});

    camera = new THREE.PerspectiveCamera(90, ASPECT_RATIO, 0.1, 1000);
    scene = new THREE.Scene();

    camera.position.set(0, 3, -3);
    camera.lookAt(new THREE.Vector3(0,1,1));

    // fit screen size
    renderer.setSize(WIDTH, HEIGHT);

    // Enable Shadows in the Renderer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    createLights();

    // Create a plane that receives shadows (but does not cast them)
    createPlane();

    renderer.render(scene, camera)

    // 监听窗口变化，如果大小改变则调用onWindowResize函数
    window.addEventListener( 'resize', onWindowResize );
}

main();

function createPlane(){
    const geometry = new THREE.PlaneGeometry(10, 100, 10, 10);
    // self lighting red
    const material = new THREE.MeshPhongMaterial({color: 0x999999, emissive: 0xff0000, emissiveIntensity: 0.1, side: THREE.DoubleSide});
    ground = new THREE.Mesh( geometry, material );

    ground.rotation.x = Math.PI / 2;
    ground.receiveShadow = true;
    scene.add( ground );
}

function createLights() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    light = new THREE.PointLight(0xffffff, 0.8, 18);
    light.position.set(-3,6,-3);

    light.castShadow = true;
    // Will not light anything closer than 0.1 units or further than 25 units
    // light.shadow.camera.near = 0.1;
    // light.shadow.camera.far = 25;
    scene.add(light);

}

function onWindowResize() {


    camera.aspect = ASPECT_RATIO;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render(scene, camera);

}