//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, cameras = [], scene, renderer;

var geometry, material, mesh;
var wireframe_bool = false;


var rotate, rotation_time = 0;
var rotating_obj = [];

var slow = 0,  fast = 0;
var arms = [], legs = [], head, feet = [];
var couplings = [];

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
    createRobot(0, 5, 10, 10);
    createTrailer(0, 5, 10, 10);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
    scene.positionY -= 50;
    
    var temp = new THREE.OrthographicCamera(window.innerWidth / - 16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / - 16, 1, 1000);
    temp.position.set(0, 0, 50);
    temp.lookAt(scene.position);
    cameras.push(temp);
    
    var temp = new THREE.OrthographicCamera(window.innerWidth / - 10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / - 10, 1, 1000);
    temp.position.set(50, 0, 0);
    temp.lookAt(scene.position);
    cameras.push(temp);

    temp = new THREE.OrthographicCamera(window.innerWidth / - 16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / - 16, 1, 1000);
    temp.position.set(0, 50, 0);
    temp.lookAt(scene.position);
    cameras.push(temp);

    
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

    geometry = new THREE.CylinderGeometry(diameter/2, diameter/2, height/2, 64);
    if (rotation)
        cilinder.rotation.z = 0.5*Math.PI;
    mesh = new THREE.Mesh(geometry, material);

    cilinder.add(mesh);
    cilinder.position.set(x, y + diameter/2, z);

    obj.add(cilinder);
    return cilinder;
}

function createCone(obj, material, x, y, z, diameter, height, rotation) {
    'use strict';

    var cone = new THREE.Object3D();
    cone.userData = { jumping: true, step: 0 };

    geometry = new THREE.ConeGeometry(diameter/2, height/2, 64);
    if (rotation)
        cone.rotation.z = 0.5*Math.PI;
    mesh = new THREE.Mesh(geometry, material);

    cone.add(mesh);
    cone.position.set(x, y + diameter/2, z);

    obj.add(cone);
    return cone;
}


function addChest(robot, x, y, z, size) {
    'use strict';
    
    var chest = new THREE.Object3D();
    
    
    var material = new THREE.MeshBasicMaterial({ color: 0x880000, wireframe: wireframe_bool });
    createBall(chest, material, x, y, z, size/4);                                          // center
    createCube(chest, material, x, y, z, size, size, size*2);                              // base
    createCube(chest, material, x, y-size*0.75, z+size+size/20, size*3, size, size/10)          // bumper
    createCube(chest, material, x, y+size*1.5, z, size*3, size*2, size*2);                 // windows
    createCube(chest, material, x, y+size*0.5, z-size*1.5, size, size*2, size);                // back
    var material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, wireframe: wireframe_bool });
    createCube(chest, material, x, y-size*0.75, z+size+size/10, size*1.25, size/1.8, size/10)      // plate
    
    addCoupling(chest, x, y-size*0.25, z-size*2, size);
    // var material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: wireframe_bool });

    // createCilinder(chest, material, size*1.5, -size*0.75, 0, size, size, true);            // left wheel
    // createCilinder(chest, material, -size*1.5, -size*0.75, 0, size, size, true);           // right wheel

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
    createCilinder(arm, material,   size*0.5*x_signal, size*2, -size*0.5,     size/5, size*5, false);   // exaust
    
    arm.position.set(x, y, z);
    
    arms.push(arm);
    robot.add(arm);
    return arm;
}

function addHead(robot, x, y, z, size) {
    'use strict';

    var hed = new THREE.Object3D();

    var material = new THREE.MeshBasicMaterial({ color: 0x000066, wireframe: wireframe_bool });
    createBall(hed, material, 0, 0, 0, size/4);                                            // center
    // createBall(hed, material, 0, size, 0, size);                                            // center
    // createCilinder(hed, material, 0, size*0.25, 0, size, size, false);                          // neck
    createCube(hed, material, 0, size, 0, size*1, size*1, size*1);                 // head

    // eye
    var material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, wireframe: wireframe_bool });
    createCube(hed, material, -size*0.25, size*1.25, size*0.5, size*0.25, size*0.25, size*0.25);
    createCube(hed, material, size*0.25, size*1.25, size*0.5, size*0.25, size*0.25, size*0.25);

    // eye pupil
    var material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: wireframe_bool });
    createCube(hed, material, -size*0.25, size*1.25, size*0.6, size*0.125, size*0.125, size*0.125);
    createCube(hed, material, size*0.25, size*1.25, size*0.6, size*0.125, size*0.125, size*0.125);

    // cone ears
    var material = new THREE.MeshBasicMaterial({ color: 0x000044, wireframe: wireframe_bool });
    createCone(hed, material, -size*0.25, size*1.5, 0, size*0.25, size*0.5, false);
    createCone(hed, material, size*0.25, size*1.5, 0, size*0.25, size*0.5, false);

    hed.position.set(x, y-size/2, z-size);

    robot.add(hed);
    head = hed;
    return hed;
}

function addFoot(obj, x, y, z, size) {
    'use strict';

    var foot = new THREE.Object3D();

    var material  = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: wireframe_bool });
    createBall(foot, material,       0, 0, 0,             size/4);                                 // center

    createCube(foot, material,       0, size*0.5, -size*0.875,            size*1.25, size*1, size*1.75);                      // foot

    foot.position.set(x, y, z);
    foot.rotation.x = -Math.PI/2;
    feet.push(foot);
    obj.add(foot);
    return foot;
}

function addLegs(robot, x, y, z, size) {
    'use strict';

    var leg = new THREE.Object3D();

    var material  = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: wireframe_bool });
    createBall(leg, material,       0, 0, 0,             size/4);                                 // center
    createCube(leg, material, 0, 0, -size*0.5, size*2, size, size*2);                       // base for tire and bumper
    
    addTire(leg, size*1.6, -size*1.35, -size*0.15, size);
    addTire(leg, -size*1.6, -size*1.35, -size*0.15, size);
    
    createCube(leg, material, size*0.75, 0, -size*1.5, size, size, size*1.5);                     // left leg
    createCube(leg, material, -size*0.75, 0, -size*1.5, size, size, size*1.5);                     // right leg
    
    material = new THREE.MeshBasicMaterial({ color: 0x000088, wireframe: wireframe_bool });
    createCube(leg, material, size*0.75, 0, -size*3,      size*1.25, size*1.25, size*4);                     // left lower leg
    createCube(leg, material, -size*0.75, 0, -size*3,     size*1.25, size*1.25, size*4);                     // right lower leg
                 
    addTire(leg, size*1.6, -size*1.35, -size*4, size);                                                     // left wheel
    addTire(leg, size*1.6, -size*1.35, -size*2.5, size);                                                   // left wheel
              
    addTire(leg, -size*1.6, -size*1.35, -size*4, size);                                                     // right wheel
    addTire(leg, -size*1.6, -size*1.35, -size*2.5, size);                                                   // right wheel

    addFoot(leg,  size*0.75, size*0.25, -size*5, size);
    addFoot(leg, -size*0.75, size*0.25, -size*5, size);
    
    leg.position.set(x, y, z);
    leg.rotateX(-Math.PI/2);
    
    legs.push(leg);
    robot.add(leg);
    return leg;
}

function addTire(robot, x, y, z, size) {
    'use strict';

    var tire = new THREE.Object3D();
    var material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: wireframe_bool });
    createCilinder(tire, material, 0, size*0.5, 0, size*1.2, size, true);  

    tire.position.set(x, y, z);
    
    robot.add(tire);
    return tire;
}

function addCoupling(obj, x, y, z, size) {
    'use strict';

    var coupling = new THREE.Object3D();

    var material  = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: wireframe_bool });

    createCube(coupling, material, 0, 0, 0, size*0.5, size*0.5, size*0.5);                     // coupling

    coupling.position.set(x, y, z);

    obj.add(coupling);
    couplings.push(coupling);
    return coupling;
}

function createRobot(x, y, z, size) {
    'use strict';

    var robot = new THREE.Object3D();

    
    addChest(robot, x, y, z, size);

    addArm(robot, size + size, size*0.5, -size*0.5, size);
    addArm(robot, -size - size, size*0.5, -size*0.5, size);

    addHead(robot, x, y+size*2.5, z+size*0.5, size);

    addLegs(robot, x, y - size, z - size*0.5, size);

    //addLegs(robot, -size - size, y-size*3, -size*1.5 + size, size);

    robot.position.set(x, y, z);

    scene.add(robot);
    return robot;
}

function createTrailer(x, y, z, size) {
    'use strict';

    var trailer = new THREE.Object3D();
    
    var material = new THREE.MeshBasicMaterial({ color: 0x0000A0, wireframe: wireframe_bool });
    createCube(trailer, material, x, y+size*1.3, -z-size*5, size*3, size*3, size*10); 
    var material = new THREE.MeshBasicMaterial({ color: 0x000088, wireframe: wireframe_bool }); 
    createCube(trailer, material, x, y-size*0.85, -z-size*8, size*2.75 /*right size - dont touch*/, size*1.3, size*3);

    addTire(trailer, size*1.6, -size*1.85, -size*8.25, size);                                                     // left wheel
    addTire(trailer, size*1.6, -size*1.85, -size*9.75, size);                                                   // left wheel
              
    addTire(trailer, -size*1.6, -size*1.85, -size*8.25, size);                                                     // right wheel
    addTire(trailer, -size*1.6, -size*1.85, -size*9.75, size);                                                   // right wheel


    trailer.position.set(x, y, z);

    scene.add(trailer);
    return trailer;
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

    // if(clock.getdelta >= 10/0.001)
    //    atualiza

    // angulo += velocidade
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

    // cloxk = new

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

    
    // velocidade = delta

    // ARMS
    case 69: //E
    case 101: //e
        // console.log(arms[0].position.x);
        for(var i = 0; i < arms.length; i++) {
            var pos_abs = Math.abs(arms[i].position.x);
            var pos_sig = arms[i].position.x/pos_abs;
            if(pos_abs < 20) {
                arms[i].position.x += 0.2 * pos_sig;
            }
        }
        break;
    case 68: //D
    case 100: //d
        // console.log(arms[0].position.x);
        for(var i = 0; i < arms.length; i++) {
            var pos_abs = Math.abs(arms[i].position.x);
            var pos_sig = arms[i].position.x/pos_abs;
            if(pos_abs > 10) {
                arms[i].position.x -= 0.2 * pos_sig;
            }
        }
        break;

    // HEAD
    case 82: //R
    case 114: //r
        // console.log(head.rotation.x);
        if(head.rotation.x < 0) {
            head.rotation.x += 0.05;
        }
        else {
            head.rotation.x = 0;
        }
        break;
        case 70: //F
        case 102: //f
        // console.log(head.rotation.x);
        if(head.rotation.x > -Math.PI/2) {
            head.rotation.x -= 0.05;
        }
        else {
            head.rotation.x = -Math.PI/2;
        }
        break;
    case 87: //W
    case 119: //w
        for(var i = 0; i < legs.length; i++) {
            console.log(legs[i].rotation.x);
            if(legs[i].rotation.x - 0.05 > -Math.PI/2) {
                legs[i].rotation.x -= 0.05;
            }
            else {
                legs[i].rotation.x = -Math.PI/2;
            }
        }
        break;
    case 83: //S
    case 115: //s
        for(var i = 0; i < legs.length; i++) {
            console.log(legs[i].rotation.x);
            if(legs[i].rotation.x + 0.05 < 0) {
                legs[i].rotation.x += 0.05;
            }
            else {
                legs[i].rotation.x = 0;
            }
        }
        break;
    case 81: //Q
    case 113: //q
        for(var i = 0; i < feet.length; i++) {
            console.log(feet[i].rotation.x);
            if(feet[i].rotation.x - 0.05 > -Math.PI/2) {
                feet[i].rotation.x -= 0.05;
            }
            else {
                feet[i].rotation.x = -Math.PI/2;
            }
        }
        break;
    case 65: //A
    case 97: //a
        for(var i = 0; i < feet.length; i++) {
            console.log(feet[i].rotation.x);
            if(feet[i].rotation.x + 0.05 < 0) {
                feet[i].rotation.x += 0.05;
            }
            else {
                feet[i].rotation.x = 0;
            }
        }
}
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}