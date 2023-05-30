//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, cameras = [], scene, renderer;
var objects = [];

var geometry, material, mesh;
var wireframe_bool = false;

var slow = 0,  fast = 0;

var clock = new THREE.Clock(), delta;

var house;




/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';
  
    scene = new THREE.Scene();
  
    // Define the gradient colors
    var color1 = new THREE.Color(0x000066); // Starting color
    var color2 = new THREE.Color(0x000000); // Ending color
  
    // Create a gradient texture
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var gradient = context.createLinearGradient(0, 0, 0, window.innerHeight);
    gradient.addColorStop(0, color1.getStyle());
    gradient.addColorStop(1, color2.getStyle());
    context.fillStyle = gradient;
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
  
    // Create a texture from the gradient canvas
    var texture = new THREE.CanvasTexture(canvas);
  
    scene.background = texture;
  
    var axisHelper = new THREE.AxisHelper(10);
    axisHelper.visible = true;
    scene.add(axisHelper);
  
    createHouse(0, 0, 0, 15);
  }
  

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
    scene.positionY -= 50;
    
    var temp;
    
    temp = new THREE.OrthographicCamera(window.innerWidth / - 16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / - 16, 1, 1000);
    temp.position.set(50, 50, 50);
    temp.lookAt(scene.position);
    cameras.push(temp);

    temp = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000);
    temp.position.set(50, 50, 50);
    temp.lookAt(scene.position);
    cameras.push(temp);

    camera = temp;
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createBall(obj, material, x, y, z, size) {
    'use strict';

    geometry = new THREE.SphereGeometry( size/2, 16, 16 );
    mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(x, y, z);
    obj.add(mesh);
    objects.push(mesh);
}

function createCube(obj, material, x, y, z, sizeX, sizeY, sizeZ) {
    'use strict';

    geometry = new THREE.BoxGeometry( sizeX, sizeY, sizeZ );
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    obj.add(mesh);
    objects.push(mesh);
}

function createCilinder(obj, material, x, y, z, diameter, height, rotation) {
    'use strict';

    var cilinder = new THREE.Object3D();
    cilinder.userData = { jumping: true, step: 0 };

    geometry = new THREE.CylinderGeometry(diameter/2, diameter/2, height/2, 16);
    if (rotation)
        cilinder.rotation.z = 0.5*Math.PI;
    mesh = new THREE.Mesh(geometry, material);

    cilinder.add(mesh);
    cilinder.position.set(x, y + diameter/2, z);

    obj.add(cilinder);
    objects.push(mesh);

    return cilinder;
}

function createCone(obj, material, x, y, z, diameter, height, rotation) {
    'use strict';

    var cone = new THREE.Object3D();
    cone.userData = { jumping: true, step: 0 };

    geometry = new THREE.ConeGeometry(diameter/2, height/2, 16);
    if (rotation)
        cone.rotation.z = 0.5*Math.PI;
    mesh = new THREE.Mesh(geometry, material);

    cone.add(mesh);
    cone.position.set(x, y + diameter/2, z);

    obj.add(cone);
    objects.push(mesh);

    return cone;
}


function createHouse(x, y, z, size) {
    'use strict';

    house = new THREE.Object3D();

    var material = new THREE.MeshBasicMaterial({ color: 0x666666, wireframe: wireframe_bool });

    createCilinder(house, material, 0, 0, 0, size, size, false);

    house.position.set(x, y, z);
    scene.add(house);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';
    delta = clock.getDelta();
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();
    
    scene.traverse(function (node) {
        if (node instanceof THREE.AxisHelper) {
            node.visible = false;
        }
    });
    
    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    // if (move) {
    //     fast += 0.1416 * 0.5;
    //     slow += 0.1416 * 0.05;
    //     var cos = Math.cos(fast);
    //     var sin = Math.sin(fast);
    //     var pi = Math.PI;
        
    //     for (var i = 0; i < moving_obj.length; i++) {
    //         // moving_obj[i].rotation.x = sin / pi;
    //         // moving_obj[i].rotation.z = cos / pi;

    //         moving_obj[i].rotation.y = -slow;

    //         // moving_obj[i].position.x = 50 * (Math.sin(slow + i * 2 * pi / moving_obj.length) );
    //         // moving_obj[i].position.z = 50 * (Math.cos(slow + i * 2 * pi / moving_obj.length));
    //     }
    // }
    render();

    requestAnimationFrame(animate);
}
////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
    case 65: //A
    case 97: //a
        wireframe_bool = !wireframe_bool;
        for(var i = 0; i < objects.length; i++){
            objects[i].material.wireframe = wireframe_bool; 
        }
        break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}