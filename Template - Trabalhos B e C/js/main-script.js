//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, scene, renderer;

var geometry, material, mesh;

var toro, cone, cube;

var move, moving_obj = [], slow = 0,  fast = 0;


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();


    scene.add(new THREE.AxisHelper(10));
    scene.background = new THREE.Color(0x8888888);


    move = false;
    moving_obj.push(createRobot(0, 0, 0, 10));
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function addBall(obj, material, x, y, z, size) {
    'use strict';

    geometry = new THREE.SphereGeometry( size/5, 16, 16 );
    mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addCube(obj, material, x, y, z, sizeX, sizeY, sizeZ) {
    'use strict';

    geometry = new THREE.BoxGeometry( sizeX, sizeY, sizeZ );
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    obj.add(mesh);
    
}

function createCone(x,y,z, size) {
    'use strict';

    var cone = new THREE.Object3D();
    cone.userData = { jumping: true, step: 0 };

    geometry = new THREE.ConeGeometry(size, size, size);
    mesh = new THREE.Mesh(geometry, material);

    cone.add(mesh);
    cone.position.set(x, y + size/2, z);
    // cone.rotation.x = Math.PI / 2 + (Math.PI)/10;
    // cone.rotation.z = Math.PI / 2;


    scene.add(cone);
    return cone;
}




function addArm(obj, x, y, z, size) {
    'use strict';

    var material  = new THREE.MeshBasicMaterial({ color: 0x660000, wireframe: true });
    addBall(obj, material, x, y, z, size);                                            // center
    addCube(obj, material, x, y+size*1.5, z, size, size*2, size);                     // upper arm
    addCube(obj, material, x, y, z+size, size, size, size*3);                         // lower arm
    
}

function addChest(obj, x, y, z, size) {

    var material = new THREE.MeshBasicMaterial({ color: 0x880000, wireframe: true });
    addBall(obj, material, x, y, z, size);                                            // center
    addCube(obj, material, x, y, z, size, size, size*2);                              // base
    addCube(obj, material, x, y, z+size+size/20, size*3, size, size/10)               // bumper
    addCube(obj, material, x, y+size*1.5, z, size*3, size*2, size*2);                 // windows
    addCube(obj, material, x, y+size, z-size*1.5, size, size*3, size);                // back
    
}

function createRobot(x, y, z, size) {
    'use strict';

    var robot = new THREE.Object3D();

    
    addChest(robot, x, y, z, size);
    
    addArm(robot, size, 0, -size*1.5, size);
    addArm(robot, -size, 0, -size*1.5, size);

    robot.position.set(x, y, z);

    scene.add(robot);
    return robot;
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
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    if (move) {
        fast += 0.1416 * 0.5;                       // TODO : Manter velocidadde independente do desempenho do computador
        slow += 0.1416 * 0.05;                      // TODO : Manter velocidadde independente do desempenho do computador
        var cos = Math.cos(fast);
        var sin = Math.sin(fast);
        var pi = Math.PI;
        
        for (var i = 0; i < moving_obj.length; i++) {
            // moving_obj[i].rotation.x = sin / pi;
            // moving_obj[i].rotation.z = cos / pi;

            moving_obj[i].rotation.y = -slow;

            // moving_obj[i].position.x = 50 * (Math.sin(slow + i * 2 * pi / moving_obj.length) );
            // moving_obj[i].position.z = 50 * (Math.cos(slow + i * 2 * pi / moving_obj.length));
        }
    }
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
        scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.material.wireframe = !node.material.wireframe;
            }
        });
        break;
    case 83:  //S
    case 115: //s
        move = !move;
        break;
    case 69:  //E
    case 101: //e
        scene.traverse(function (node) {
            if (node instanceof THREE.AxisHelper) {
                node.visible = !node.visible;
            }
        });
        break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}