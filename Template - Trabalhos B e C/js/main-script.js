//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, cameras = [], scene, renderer;

var geometry, material, mesh;
var wireframe_bool = true;


var rotate, rotation_time = 0;
var rotating_obj = [];

var slow = 0,  fast = 0;
var arms = [], legs = [], head;

var close;



/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();


    scene.add(new THREE.AxisHelper(10));
    scene.background = new THREE.Color(0x8888888);


    rotate = false;
    close = false;
    rotating_obj.push(createRobot(0, 0, 0, 10));
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
    
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(50, 50, 50);
    camera.lookAt(scene.position);
    cameras.push(camera);
    
    var temp = new THREE.OrthographicCamera(window.innerWidth / - 16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / - 16, 1, 1000);
    temp.position.set(50, 0,0);
    temp.lookAt(scene.position);
    cameras.push(temp);
    
    temp = new THREE.OrthographicCamera(window.innerWidth / - 16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / - 16, 1, 1000);
    temp.position.set(0, 50, 0);
    temp.lookAt(scene.position);
    cameras.push(temp);

    temp = new THREE.OrthographicCamera(window.innerWidth / - 16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / - 16, 1, 1000);
    temp.position.set(0, 0, 50);
    temp.lookAt(scene.position);
    cameras.push(temp);
    
    temp = new THREE.OrthographicCamera(window.innerWidth / - 16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / - 16, 1, 1000);
    temp.position.set(50, 50, 50);
    temp.lookAt(scene.position);
    cameras.push(temp);

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
}

function createCube(obj, material, x, y, z, sizeX, sizeY, sizeZ) {
    'use strict';

    geometry = new THREE.BoxGeometry( sizeX, sizeY, sizeZ );
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    obj.add(mesh);
    
}

function createCilinder(obj, material, x, y, z, diameter, height, rotation) {
    'use strict';

    var cilinder = new THREE.Object3D();
    cilinder.userData = { jumping: true, step: 0 };

    geometry = new THREE.CylinderGeometry(diameter, diameter, height, 64);
    if (rotation)
        cilinder.rotation.z = 0.5*Math.PI;
    mesh = new THREE.Mesh(geometry, material);

    cilinder.add(mesh);
    cilinder.position.set(x, y + diameter/2, z);

    obj.add(cilinder);
}


function addChest(robot, x, y, z, size) {
    'use strict';
    
    var chest = new THREE.Object3D();
    
    
    var material = new THREE.MeshBasicMaterial({ color: 0x880000, wireframe: wireframe_bool });
    createBall(chest, material, x, y, z, size/4);                                          // center
    createCube(chest, material, x, y, z, size, size, size*2);                              // base
    createCube(chest, material, x, y-size, z+size+size/20, size*3, size, size/10)          // bumper
    createCube(chest, material, x, y+size*1.5, z, size*3, size*2, size*2);                 // windows
    createCube(chest, material, x, y+size, z-size*1.5, size, size*3, size);                // back
    createCube(chest, material, x, y-size, z, size*2, size, size*2);                       // base for tire and bumper
    
    robot.add(chest);
    return chest;
}

function addArm(robot, x, y, z, size) {
    'use strict';

    var arm = new THREE.Object3D();

    var material  = new THREE.MeshBasicMaterial({ color: 0x660000, wireframe: wireframe_bool });
    createBall(arm, material,       0, 0, 0,             size/4);                                 // center
    createCube(arm, material,       0, size*1.5, 0,      size, size*2, size);                     // upper arm
    createCube(arm, material,       0, 0, size,          size, size, size*3);                     // lower arm
    var x_signal = x/Math.abs(x);
    var material  = new THREE.MeshBasicMaterial({ color: 0x444444, wireframe: wireframe_bool });
    createCilinder(arm, material,   size*0.5*x_signal, size*2, -size*0.5,     size/10, size*3, false);   // escape
    
    arm.position.set(x, y, z);
    
    arms.push(arm);
    robot.add(arm);
    return arm;
}

function addHead(robot, x, y, z, size) {
    'use strict';

    var hed = new THREE.Object3D();

    var material = new THREE.MeshBasicMaterial({ color: 0x000088, wireframe: wireframe_bool });
    createBall(hed, material, 0, 0, 0, size/4);                                            // center
    createBall(hed, material, 0, size, 0, size);                                            // center
    createCilinder(hed, material, 0, size*0.5, 0, size/2, size/2, false);                          // neck

    hed.position.set(x, y-size/2, z-size);

    robot.add(hed);
    head = hed;
    return hed;
}

function addLeg(robot, x, y, z, size) {
    'use strict';

    var leg = new THREE.Object3D();

    var material  = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: wireframe_bool });
    createBall(leg, material,       0, 0, 0,             size/4);                                 // center
    createCube(leg, material,       0, size*1.5, 0,      size, size*2, size);                     // upper arm
    createCube(leg, material,       0, 0, size,          size, size, size*3);                     // lower arm
    
    leg.position.set(x, y, z);
    
    legs.push(leg);
    robot.add(leg);
    return leg;
}

function addTire(robot, x, y, z, size) {
    'use strict';

    var tire = new THREE.Object3D();
    var material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: wireframe_bool });
    createCilinder(tire, material, 0, size*0.5, 0, size/2, size/2, true);  

    tire.position.set(x, y, z);
    
    robot.add(tire);
    return tire;
}

function createRobot(x, y, z, size) {
    'use strict';

    var robot = new THREE.Object3D();

    
    addChest(robot, x, y, z, size);

    addArm(robot, size + size, 0, -size*1.5 + size, size);
    
    addArm(robot, -size - size, 0, -size*1.5 + size, size);

    addHead(robot, x, y+size*2.5, z, size);

    addTire(robot, size*1.25, y - size*2.25, z, size);

    addTire(robot, -size*1.25, y - size*2.25, z, size);

    //addLeg(robot, -size - size, y-size*3, -size*1.5 + size, size);

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
    if (rotate) {

        rotation_time += 0.005;

        for (var i = 0; i < rotating_obj.length; i++) {
            rotating_obj[i].rotation.y = -rotation_time;
        }
        
        
    }
    
    if (close) {
        
        slow += 0.01;
        fast += 0.1;
        
        var slow_int = Math.round(slow);
        console.log(slow_int);

        for (var i = 0; i < arms.length; i++) {
            var x_signal = arms[i].position.x/Math.abs(arms[i].position.x);
            // console.log(x_signal);

            if(slow_int % 5 == 1) {
                // back
                arms[i].position.z -= 0.1;
            }
            else if(slow_int % 5 == 2) {
                // in
                arms[i].position.x -= 0.1 * x_signal;
            }
            else if(slow_int % 5 == 3) {
                // out
                arms[i].position.x += 0.1 * x_signal;
            }
            else if(slow_int % 5 == 4) {
                // front
                arms[i].position.z += 0.1;
            }
        }
        // goes down faster
        if(slow_int % 5 == 1){ // || slow_int % 5 == 2) {
            head.rotation.x += 0.01;
        }
        // goes up faster
        else if(slow_int % 5 == 3){ // || slow_int % 5 == 4) {
            head.rotation.x -= 0.01;
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
        rotate = !rotate;
        break;
    case 69:  //E
    case 101: //e
        scene.traverse(function (node) {
            if (node instanceof THREE.AxisHelper) {
                node.visible = !node.visible;
            }
        });
        break;
    case 49: //1
        camera = cameras[0];
        break;
    case 50: //2
        camera = cameras[1];
        break;
    case 51: //3
        camera = cameras[2];
        break;
    case 52: //4
        camera = cameras[3];
        break;
    case 53: //5
        camera = cameras[4];
        break;
    case 67: //C
    case 99: //c
        close = !close;
        break;
}
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}