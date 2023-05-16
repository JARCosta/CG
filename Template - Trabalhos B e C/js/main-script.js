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
    
    moving_obj.push(createChess(0, 0, 0, 15));
    // moving_obj.push(createTable(0, 0, 0, 1));
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

function addTableLeg(obj, x, y, z, size) {
    'use strict';

    geometry = new THREE.BoxGeometry(2 * size, 6 * size, 2 * size);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y - 3, z);
    obj.add(mesh);
}

function addTableTop(obj, x, y, z, size) {
    'use strict';
    geometry = new THREE.BoxGeometry(60 * size, 2 * size, 20 * size);
    // (width, height, depth)
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createTable(x, y, z, size) {
    'use strict';

    var table = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addTableTop(table, 0, 0, 0, size);
    addTableLeg(table, -25, -1, -8, size);
    addTableLeg(table, -25, -1, 8, size);
    addTableLeg(table, 25, -1, 8, size);
    addTableLeg(table, 25, -1, -8, size);

    scene.add(table);

    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
}

function addBall(obj, x, y, z, size) {
    'use strict';

    geometry = new THREE.SphereGeometry( size/5, 16, 16 );
    mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addCube(obj, x, y, z, sizeX, sizeY, sizeZ) {
    'use strict';

    geometry = new THREE.BoxGeometry( sizeX, sizeY, sizeZ );
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    obj.add(mesh);
    
}


function addGrill(obj, x, y, z, size) {
    'use strict';

    // addBall(obj, x, y, z, size);
    addCube(obj, x, y, z, size, size, size*2);
}

function addBumper(obj, x, y, z, size) {
    'use strict';

    // addBall(obj, x, y, z, size);
    addCube(obj, x, y, z, size*3, size, size/10);
}

function addWindows(obj, x, y, z, size) {
    'use strict';

    // addBall(obj, x, y, z, size);
    addCube(obj, x, y, z, size*3, size*2, size*2);

}

function addBack(obj, x, y, z, size) {
    'use strict';

    // addBall(obj, x, y, z, size);
    addCube(obj, x, y, z, size, size*3, size);

}

function addArm(obj, x, y, z, size) {
    'use strict';

    addBall(obj, x, y, z, size);
    addCube(obj, x, y, z+size, size, size, size*3);
    addCube(obj, x, y+size*1.5, z, size, size*2, size);
    
}


function createChess(x,y,z, size) {
    'use strict';

    var chess = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

    addBall(chess, x, y, z, size);
    addGrill(chess, 0, 0, 0, size);
    addBumper(chess, 0, 0, size+size/20, size)
    addWindows(chess, 0, size*1.5, 0, size);
    addBack(chess, 0, size, -size*1.5, size);

    addArm(chess, size, 0, -size*1.5, size);
    addArm(chess, -size, 0, -size*1.5, size);

    chess.position.set(x, y, z);
    
    scene.add(chess);
    return chess;
}

function createCone(x,y,z, size) {
    'use strict';

    var cone = new THREE.Object3D();
    cone.userData = { jumping: true, step: 0 };

    material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    geometry = new THREE.ConeGeometry(size, size, size);
    mesh = new THREE.Mesh(geometry, material);

    cone.add(mesh);
    cone.position.set(x, y + size/2, z);
    // cone.rotation.x = Math.PI / 2 + (Math.PI)/10;
    // cone.rotation.z = Math.PI / 2;


    scene.add(cone);
    return cone;
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
        fast += 0.1416 * 0.5;
        slow += 0.1416 * 0.05;
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