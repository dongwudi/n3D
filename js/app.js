function init() {
    // webgl兼容检测
    if(!Detector.webgl) return Detector.addGetWebGLMessage(),alert('不支持webgl'),!1;

    //支持开始脚本：
    var scene,camera,renderer,cameraTarget,ray,mesh,geometry,scene1_material,scene2_material ,textureLoader ,scene1,scene2,light;


    // 定义 scene renderer camera light
    function define() {
        // scene
        scene = new THREE.Scene();
        scene.name = 'world';
        scene.fog = new THREE.Fog(12643071, 300, 1e3);
        // camera
        camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,1,10000);
        camera.position.set(0,0,0);
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
        document.getElementById('canvas').appendChild( renderer.domElement );

        //light
        // light = new THREE.AmbientLight(0xffffff);
        // scene.add(light)
    }

    // 场景一加载
    function init() {
        textureLoader = new THREE.TextureLoader();
        geometry = new THREE.SphereGeometry(200,100,100);
        scene1_material = textureLoader.load('./images/sc1.jpg',function (texture) {
            scene1 = new THREE.MeshBasicMaterial({
                map: texture,
                side:THREE.DoubleSide
            });
            mesh = new THREE.Mesh(geometry, scene1);
            scene.add(mesh);//添加到场景
        })
    }

    function animate() {
        requestAnimationFrame(animate);
        // if(mesh){
        //     mesh.rotation.y += 0.001;
        // }
        renderer.render(scene,camera);
    }

    define();
    init();
    animate();
}