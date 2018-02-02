function init() {
    // webgl兼容检测
    if (!Detector.webgl) return Detector.addGetWebGLMessage(), alert('不支持webgl'), !1;

    function Rand(min,max) {
        return Math.floor(Math.random() * (max - min + 1 )) + min;
    }

    //支持开始脚本：
    var scene, camera, renderer, cameraTarget, raycaster, mesh, geometry, scene1_material, scene2_material,
        textureLoader, scene1, scene2, light, controls;


    // 定义 scene renderer camera light
    // scene
    scene = new THREE.Scene();
    scene.name = 'world';
    // scene.fog = new THREE.Fog(12643071, 300, 1e3);

    // camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 10000);
    camera.position.set(0.1, 0, 0);
    camera.target = new THREE.Vector3(0, 0, 0);

    //renderer
    renderer = new THREE.WebGLRenderer({
        antialias: !0,//是否开启反锯齿
        precision: "highp",//着色精度选择  highp/mediump/lowp
        alpha: !0,//是否可以设置背景色透明
        preserveDrawingBuffer: !1//是否保存绘图缓冲
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.clear();
    document.getElementById('canvas').appendChild(renderer.domElement);

    //light
    light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    //  射线
    raycaster = new THREE.Raycaster;


    // 场景一加载

    textureLoader = new THREE.TextureLoader();
    geometry = new THREE.SphereGeometry(300, 100, 100);
    scene1_material = textureLoader.load('./images/sc1.jpg', function (texture) {
        scene1 = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        mesh = new THREE.Mesh(geometry, scene1);
        mesh.rotation.y -= 0.5;
        scene.add(mesh);//添加到场景
    });


    // controls
    controls = new THREE.OrbitControls(camera);
    controls.enabled = !0;
    controls.enableZoom = !1;
    controls.maxPolarAngle = Math.PI * 3 / 5;
    controls.minPolarAngle = Math.PI / 3;
    controls.enablePan = !1;
    // controls.update();
    // controls.addEventListener('change', animate);


    // 粒子-------------------------------------------------------------------------------
    var spriteConfig = ['./images/flower-1_0596c0f.png',
        './images/flower-4_f9371e9.png',
        './images/flower-3_a7fa5f2.png',
        './images/flower-4_f9371e9.png',
        './images/flower-6_a90e383.png',
        './images/flower-4_f9371e9.png',
        "./images/flower-6_a90e383.png",
        "./images/flower-4_f9371e9.png",
        "./images/flower-9_1332f27.png",
        "./images/flower-1_0596c0f.png"];
    var spriteArray = [];
    for(var i = -20; 20 > i; i += 0.3){
        var map = textureLoader.load(spriteConfig[Math.floor(Math.random()* 10 )]);
        var material = new THREE.SpriteMaterial({
            transparent: !0,
            opacity: Rand(0.6,1),
            map: map
        });
        var sprite = new THREE.Sprite(material);
        sprite.name =  'particle';
        sprite.position.x = 100 * Math.random() - 50;
        sprite.position.y = 10 * Math.random();
        sprite.position.z = i;
        sprite.scale.x = sprite.scale.y = 0.6 * Rand(0.1, 1);
        scene.add(sprite);
        spriteArray.push(sprite);
    }
    var spriteAnim = function () {
        for (var j = 0; j < spriteArray.length; j++) {
            var s = spriteArray[j];
            s.position.y -= j / spriteArray.length / 20;
            s.position.x -= j / spriteArray.length / 40;
            s.rotation.x -= 10;
            s.rotation.y += 10;
            s.rotation.z += 5;
            s.position.y < -7 && (s.position.x = 100 * Math.random() - 50 , s.position.y = 7);
        }
    };
    function spriteAnimRender() {
        spriteAnim();
        renderer.clear();
        renderer.render(scene, camera);
        requestAnimationFrame(spriteAnimRender)
    }
    // -------------------------------------------------------------------------------------------

    // 传送阵做场景跳转-----------------------------------------------------------------------------------
    



    function animate() {
        renderer.render(scene, camera);
        controls.update();
        requestAnimationFrame(animate);
    }
    animate();//场景渲染
    spriteAnimRender();//粒子渲染

    // resize
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}