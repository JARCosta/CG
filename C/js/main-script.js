//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, cameras = [], scene, renderer;
var objects = [];

var geometry, material, mesh;
var wireframe_bool = false;

var slow = 0,  fast = 0;

var clock = new THREE.Clock(), delta;

var house, ovni, subreiro;




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
  
    var size = 10;
    createHouse(0, 0, 0, size);
    createOVNI(0, size * 6, 0, 10);
    createSubreiro(size * 6, 0, 0, size);
    createSubreiro(-size * 6, 0, 0, size);
    createSubreiro(0, 0, size * 6, size);
    createSubreiro(0, 0, -size * 6, size);
  }
  

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
    scene.positionY -= 50;
    
    var temp;
    
    temp = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    temp.position.set(0, 150, 0);
    temp.lookAt(scene.position);
    cameras.push(temp);
    
    temp = new THREE.OrthographicCamera(window.innerWidth / - 16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / - 16, 1, 1000);
    temp.position.set(150, 150, 150);
    temp.lookAt(scene.position);
    cameras.push(temp);

    temp = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    temp.position.set(150, 150, 150);
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
    cilinder.rotation.z = rotation;
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

function addWalls(obj, x, y, z, size) {
    'use strict';

    var window_height = size/2;

    const vertices = new Float32Array([
        // base
        -size*2.5       ,-size         ,-size,                          // down left away      0
        -size*2.5       ,-size         , size,                          // down left close     1
         size*2.5       ,-size         ,-size,                          // down right away     2
         size*2.5       ,-size         , size,                          // down right close    3

        // those who touch the roof
        -size*2.5       , size         ,-size,                          // up left away        4
        -size*2.5       , size         , size,                          // up left close       5
         size*2.5       , size         ,-size,                          // up right away       6
         size*2.5       , size         , size,                          // up right close      7
        
        // roof
         size*2.5       , size*1.5     , 0,                             // right               8
        -size*2.5       , size*1.5     , 0,                             // left                9

        // door frame
        -size*0.5       ,-size         , size,                          // down left           10
        -size*0.5       , size         , size,                          // up left             11
         size*0.5       ,-size         , size,                          // down right          12
         size*0.5       , size         , size,                          // up right            13

        // wall over the door
         size*0.5       , size*0.6   , size,                            // down left           14
        -size*0.5       , size*0.6   , size,                            // down right          15

        // right window
        1.5*size-size*0.35       ,-size*0.35   , size,                  // down left           16
        1.5*size+size*0.35       ,-size*0.35   , size,                  // down right          17
        1.5*size-size*0.35       , size*0.35   , size,                  // up left             18
        1.5*size+size*0.35       , size*0.35   , size,                  // up right            19

        // right window frame
        1.5*size-size*0.35       ,-size*1   , size,                     // down left           20
        1.5*size+size*0.35       ,-size*1   , size,                     // down right          21
        1.5*size-size*0.35       , size*1   , size,                     // down left           22
        1.5*size+size*0.35       , size*1   , size,                     // down right          23


        // left window
        -1.5*size-size*0.35       ,-size*0.35   , size,                 // down left           24
        -1.5*size+size*0.35       ,-size*0.35   , size,                 // down right          25
        -1.5*size-size*0.35       , size*0.35   , size,                 // up left             26
        -1.5*size+size*0.35       , size*0.35   , size,                 // up right            27

        // left window frame
        -1.5*size-size*0.35       ,-size*1   , size,                    // down left           28
        -1.5*size+size*0.35       ,-size*1   , size,                    // down right          29
        -1.5*size-size*0.35       , size*1   , size,                    // up left             30
        -1.5*size+size*0.35       , size*1   , size,                    // up right            31

    ]);

    const indices = [
        // left wall
        0, 1, 4,
        4, 1, 5,

        // right wall
        6, 3, 2,
        7, 3, 6,

        // back wall
        6, 2, 0,
        4, 6, 0,

        // front wall
            // door left
                // window right
                    // 1, 10, 11,
                    // 5, 1, 11,
                    10, 31, 29,
                    11, 31, 10,
                // window left
                    5, 1, 30,
                    1, 28, 30,
                // window top
                    31, 26, 27,
                    31, 30, 26,
                // window bottom
                    28, 29, 24,
                    29, 25, 24,
        
            // door right
                // window right
                    3, 23, 21,
                    7, 23, 3,
                // window left
                    13, 12, 22,
                    12, 20, 22,
                // window top
                    20, 21, 16,
                    16, 21, 17,
                // window bottom
                    23, 22, 18,
                    23, 18, 19,

        // left roof
        4, 5, 9,

        // right roof
        6, 8, 7,

        // wall over the door
        15, 14, 13,
        15, 13, 11,

        // window
        // 16, 17, 19,
        // 16, 19, 18,


    ];

    geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.setIndex( indices );
    
    var material = new THREE.MeshBasicMaterial({ color: 0x666666, wireframe: wireframe_bool });
    
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    obj.add(mesh);
    objects.push(mesh);

    return mesh;
}

function addRoof(obj, x, y, z, size) {
    'use strict';

    const vertices2 = new Float32Array([
        // those who touch the roof
        -size*2.5       , size          , -size,
        -size*2.5       , size          , size,
        size*2.5        , size          , -size,
        size*2.5        , size          , size,

        // roof
        size*2.5            , size*1.5      , 0,
        -size*2.5           , size*1.5      , 0
    ]);

    const indices2 = [
        // front roof
        5, 1, 4,
        4, 1, 3,

        // back roof
        2, 0, 4,
        4, 0, 5,
        
    ];

    geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices2, 3 ) );
    geometry.setIndex( indices2 );

    var material = new THREE.MeshBasicMaterial({ color: 0x662222, wireframe: wireframe_bool });
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    obj.add(mesh);
    objects.push(mesh);

    return mesh;
}

function addWindow( obj, x, y, z, size ) {
    'use strict';

    const vertices3 = new Float32Array([
        // left window
        -size*1.5+size*0.35       ,-size*0.35   , size,                 // down left           0
        -size*1.5+size*0.35       , size*0.35   , size,                 // up left             1
        -size*1.5-size*0.35       ,-size*0.35   , size,                 // down left           2
        -size*1.5-size*0.35       , size*0.35   , size,                 // up left             3

        // right window
        size*1.5+size*0.35        ,-size*0.35   , size,                 // down right          4
        size*1.5+size*0.35        , size*0.35   , size,                 // up right            5
        size*1.5-size*0.35        ,-size*0.35   , size,                 // down right          6
        size*1.5-size*0.35        , size*0.35   , size,                 // up right            7

        // door
        +size*0.5       ,-size*1   , size,                              // down left           8
        +size*0.5       , size*0.6   , size,                            // up left             9
        -size*0.5       ,-size*1   , size,                              // down left           10
        -size*0.5       , size*0.6   , size,                            // up left             11
    ]);

    const indices3 = [
        // left window
        0, 1, 3,
        0, 3, 2,

        // right window
        4, 5, 7,
        4, 7, 6,

        // door
        8, 9, 11,
        8, 11, 10,
    ];

    geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices3, 3 ) );
    geometry.setIndex( indices3 );

    var material = new THREE.MeshBasicMaterial({ color: 0xaaaaff, wireframe: wireframe_bool });
    mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(x, y, z);
    obj.add(mesh);
    objects.push(mesh);

    return mesh;
}

function createHouse(x, y, z, size) {
    'use strict';

    house = new THREE.Object3D();
    
    addWalls(house, 0, 0, 0, size);
    addRoof(house, 0, 0, 0, size);
    addWindow(house, 0, 0, 0, size);

    house.position.set(x, y, z);
    scene.add(house);
}

function createOVNI(x, y, z, size) {
    'use strict';

    ovni = new THREE.Object3D();

    geometry = new THREE.SphereGeometry(size, 32, 32);



    var material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, wireframe: wireframe_bool });
    mesh = new THREE.Mesh(geometry, material);
    
    mesh.scale.set(1, 0.5, 1);

    mesh.position.set(x, y, z);
    ovni.add(mesh);
    objects.push(mesh);


    // ovni.position.set(x, y, z);
    scene.add(ovni);
}


function createSubreiro(x, y, z, size) {
    'use strict';

    subreiro = new THREE.Object3D();

    // geometry = new THREE.CylinderGeometry(size, size, size*2, 32);
    material = new THREE.MeshBasicMaterial({ color: 0x8b4513, wireframe: wireframe_bool });
    // mesh = new THREE.Mesh(geometry, material);

    // mesh.position.set(x, y, z);
    // subreiro.add(mesh);
    // objects.push(mesh);

    createCilinder(subreiro, material, 0, 0, 0, size*1, size*5, Math.PI/16);
    createCilinder(subreiro, material, size*0.5, size*1.5, 0, size*0.75, size*3, Math.PI/16 - Math.PI/4);
    createCilinder(subreiro, material, -size*0.5, size*1.5, 0, size*0.75, size*3, Math.PI/16 + Math.PI/8);

    material = new THREE.MeshBasicMaterial({ color: 0x004400, wireframe: wireframe_bool });
    createBall(subreiro, material, size*1.75, size*3, 0, size*2.5);
    createBall(subreiro, material, -size*1.75, size*3, 0, size*2.5);

    // var material = new THREE.MeshBasicMaterial({ color: 0x006400, wireframe: wireframe_bool });

    subreiro.position.set(x, y, z);
    scene.add(subreiro);
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
    
    // rotate house
    scene.rotation.y += 0.01;

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

    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}