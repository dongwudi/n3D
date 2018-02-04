function init() {
    // 兼容检测
    if(!Detector.webgl)  return Detector.addGetWebGLMessage(),void alert('您的浏览器不支持webgl,请更换新版本谷歌或火狐浏览器获取更好的浏览体验！'),!1 ;

    // canvas 代码 ：
    var scene,camera,renderer,SphereGeometry_heaven,SphereGeometry_house,scene1_heaven,scene1,scene2_heaven,scene2,ray,controls,time,heaven_sph_R,house_sph_R,textureLoader,radian;

    function _define() {
        radian = Math.PI;
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,1,1000);
        // camera.target = new THREE.Vector3(0, 0, 0);
        camera.position.set(-1,0,0);
        camera.lookAt(0,0,0);
        renderer = new THREE.WebGLRenderer({
            // antialias: !0,
            // precision: "highp",
            // alpha: !0,
            // preserveDrawingBuffer: !1
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        //		renderer.setClearColor(0,1);
        renderer.setSize(window.innerWidth,window.innerHeight);
        $('#canvas').append(renderer.domElement);
        ray = new THREE.Raycaster();
        controls = new THREE.OrbitControls(camera,renderer.domElement);
        // controls.enableDamping = !0;//是否有惯性
        controls.zoomSpeed = 0.5;//缩放速度
        controls.enableZoom = !1;
        controls.enableKeys = !1;//禁止键盘控制
        controls.enablePan = !1;//是否开启右键拖拽
        //		controls.dampingFactor = 0.1;//鼠标拖拽旋转灵敏度
        // controls.rotateSpeed = 0.2;//旋转速度
        //		controls.enabled = !1;//禁用控制器
        //		controls.minDistance = 300;//相机距离原点的最小距离
        //		controls.target.copy(scene.position);//控制器围绕的中心的点
        controls.maxPolarAngle = Math.PI * 2.8/5;
        controls.minPolarAngle = Math.PI / 3;
        time = new THREE.Clock();
        heaven_sph_R = 36;
        house_sph_R = 18;
        textureLoader = new THREE.TextureLoader();
        // scene1_heaven,scene1,scene2_heaven,scene2
    }

    function _cScene() {
        scene1_heaven =  textureLoader.load('./images/heaven.jpg',function (texture) {
            function ani() {
                renderer.clear();
                renderer.render(scene, camera);
                new TWEEN.Tween(mesh.rotation).to({
                    y: mesh.rotation.y + 0.01
                }, 1e3).start();
                window.requestAnimationFrame(ani);
                // TWEEN.update();
            }
            SphereGeometry_heaven = new THREE.SphereGeometry(heaven_sph_R,50,50);
            var sphereMaterial = new THREE.MeshLambertMaterial({
                map: scene1_heaven,
                side: THREE.DoubleSide
            });
            var mesh = new THREE.Mesh(SphereGeometry_heaven, sphereMaterial);
            mesh.position.set(0, 0, 0);
            mesh.name = 'heaven';
            scene.add(mesh);
            ani();// 天空动画 -- 在循环帧动画中TWEEN.update() 就会逐帧更新
            var ambLight = new THREE.AmbientLight(16777215);
            scene.add(ambLight);
        });

        scene1 = textureLoader.load('./images/house2.png',function (texture) {
            SphereGeometry_house = new THREE.SphereGeometry(house_sph_R,50,50);
            var meshMaterial = new THREE.MeshPhongMaterial({
                transparent: !0,
                map: scene1,
                side: THREE.DoubleSide
            });
            var mesh = new THREE.Mesh(SphereGeometry_house, meshMaterial);
            mesh.position.set(0, 0, 0);
            mesh.name = 'house';
            scene.add(mesh);
        })

    }

    function _render() {
        _define();
        _cScene();
    }



    _render();
    function animate() {
        requestAnimationFrame(animate);
        TWEEN.update(); // tween动画更新
        renderer.render(scene,camera);
    }
    animate();
}