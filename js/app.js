function init() {
    // webgl兼容检测
    if (!Detector.webgl) return Detector.addGetWebGLMessage(), alert('不支持webgl'), !1;

    function Rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //支持开始脚本：
    var scene, camera, renderer, cameraTarget, raycaster, mesh, geometry, scene1_material, scene2_material,
        textureLoader, scene1, scene2, light, controls, clock, mouse;


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
        // preserveDrawingBuffer: !1//是否保存绘图缓冲
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

    // clock
    clock = new THREE.Clock();

    // mouse
    mouse = new THREE.Vector2();

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
    // controls.addEventListener('change', updateControls);
    // function updateControls() {
    //     controls.update();
    // }


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
    for (var i = -20; 20 > i; i += 0.3) {
        var map = textureLoader.load(spriteConfig[Math.floor(Math.random() * 10)]);
        var material = new THREE.SpriteMaterial({
            transparent: !0,
            opacity: Rand(0.6, 1),
            needsUpdate: !0,
            map: map
        });
        var sprite = new THREE.Sprite(material);
        sprite.name = 'particle';
        sprite.position.x = 100 * Math.random() - 50;
        sprite.position.y = 10 * Math.random();
        sprite.position.z = i;
        sprite.scale.x = sprite.scale.y = 0.6 * Rand(0.1, 1);
        scene.add(sprite);
        spriteArray.push(sprite);
    }
    var spriteAnim = function () {
        for (var j = 0; j < spriteArray.length; j++) {
            var that = spriteArray[j];
            that.position.y -= j / spriteArray.length / 20;
            that.position.x -= j / spriteArray.length / 40;
            that.rotation.x -= 10;
            that.rotation.y += 10;
            that.rotation.z += 5;
            that.position.y < -7 && (that.position.x = 100 * Math.random() - 50 , that.position.y = 7);
        }
    };

    // -------------------------------------------------------------------------------------------
    // 传送阵做场景跳转----------------------------------------------------------------------------
    function canvasGif() {
        return {
            canvas: null,
            context: null,
            fps: 30,
            loopCount: 1,
            tempCount: 0,
            img_obj: {source: null, current: 0, total_frames: 0, width: 0, height: 0},
            // ele : $(".peoplecvs")[0]  --> canvas
            // url : src 图片地址
            // frames : 多少帧一次循环，即多少张缩略小图
            // fps : 24  fps
            // i : -1  循环次数
            // a : fn() // 后续扩展函数
            init: function (ele, url, frames, fps, i, fn) {
                var canvas_gif = this;
                canvas_gif.canvas = ele;
                canvas_gif.context = ele.getContext('2d');
                canvas_gif.fps = fps || 30;
                canvas_gif.loopCount = i || 1; //
                var img = new Image;
                img.src = url;
                // canvas_gif  -- this
                img.onload = function () {
                    canvas_gif.img_obj.source = img;
                    canvas_gif.img_obj.total_frames = frames;
                    canvas_gif.img_obj.width = this.width / frames;
                    canvas_gif.img_obj.height = this.height;
                    canvas_gif.loopDraw(fn);
                };
            },
            draw_anim: function (ctx, img_obj) {
                null != img_obj.source && (ctx.drawImage(img_obj.source, img_obj.width * img_obj.current, 0, img_obj.width, img_obj.height, 0, 0, img_obj.width, img_obj.height), img_obj.current = (img_obj.current + 1) % img_obj.total_frames, -1 != this.loopCount && img_obj.current == img_obj.total_frames - 1 && this.tempCount++)
            },
            render: function (ele, url, frames, fps, i, fn) {
                this.init(ele, url, frames, fps, i, fn)
            },
            loopDraw: function (fn) {
                var that = this, ctx = that.context, img_obj = that.img_obj, width = that.canvas.width,
                    height = that.canvas.height;
                var timer = setInterval(function () {
                    ctx.clearRect(0, 0, width, height);
                    that.draw_anim(ctx, img_obj);
                    -1 != that.loopCount && that.tempCount == that.loopCount && (that.tempCount = 0, clearInterval(timer) , ctx.clearRect(0, 0, width, height), "function" == typeof fn && fn())
                }, 1e3 / this.fps)
            }
        }
    }

    var gif_texture = new THREE.CanvasTexture(document.getElementById('gif'));
    canvasGif().render(document.getElementById('gif'), "./images/gogif.png", 16, 24, -1, function () {
    });
    var gif_material = new THREE.SpriteMaterial({map: gif_texture, needsUpdate: !0, side: THREE.FrontSide});
    // gif_material.map.magFilter = THREE.NearestFilter, gif_material.map.minFilter = THREE.NearestFilter;
    var gif_mesh = new THREE.Sprite(gif_material);
    gif_mesh.name = 'gif';
    gif_mesh.scale.set(50, 50, 50);
    gif_mesh.position.set(-150, 0, -230);
    scene.add(gif_mesh);

    // -------------------------------------------------------------------------------------------

    // 射线判断------------------------------------------------------------------------------------
    function mouseMove(e) {
        e.preventDefault();
        var ele = document.getElementById('canvas');
        mouse.x = ((e.pageX - $(ele).offset().left) / ele.offsetWidth) * 2 - 1;
        mouse.y = -((e.pageY - $(ele).offset().top) / ele.offsetHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);//相机和鼠标点连线
        //相交点
        //光线穿透物体
        var intersects = raycaster.intersectObjects(scene.children);
        if (0 != intersects.length && intersects.length > 0) {
            var cur = intersects[0].object;
            ele.style.cursor = cur.name === 'gif' ? 'pointer' : 'default';
        }
    }

    function mouseClick(e) {
        e.preventDefault();
        raycaster.setFromCamera(mouse, camera);//相机和鼠标点连线
        var intersects = raycaster.intersectObjects(scene.children);//相交的物体  scene.children
        if (0 != intersects.length && intersects.length > 0) {
            var cur = intersects[0].object;
            cur.name === 'gif' ? changeScene(1, e) : '';
        }
    }

    document.addEventListener('mousemove', mouseMove, false);
    document.addEventListener('click', mouseClick, false);

    // -------------------------------------------------------------------------------------------
    // 切换到第二个场景---------------------------------------------------------------------------
    function changeScene(go, ev) {
        if (go) {
            // 拉近镜头
            var factor = 3;
            var WIDTH = window.innerWidth;
            var HEIGHT = window.innerHeight;
            //将鼠标的屏幕坐标转换为NDC坐标
            var mX = (ev.clientX / WIDTH) * 2 - 1;
            var mY = -(ev.clientY / HEIGHT) * 2 + 1;
            //这里定义深度值为0.5，深度值越大，意味着精度越高
            var vector = new THREE.Vector3(mX, mY, 0.5);
            //将鼠标坐标转换为3D空间坐标
            vector.unproject(camera);
            //获得从相机指向鼠标所对应的3D空间点的射线（归一化）
            // vector.sub(camera.position).normalize();
            // camera.position.x += vector.x * factor;
            // camera.position.y += vector.y * factor;
            // camera.position.z += vector.z * factor;
            // camera.rotation.x  = -0.037;
            // camera.rotation.y  = 0.57;
            // camera.rotation.z  = 0.02;
            // camera.updateProjectionMatrix();
            // controls.target.x += vector.x * factor;
            // controls.target.y += vector.y * factor;
            // controls.target.z += vector.z * factor;
            // console.log(vector.x * factor);
            // console.log(vector.y * factor);
            // console.log(vector.z * factor);

            new TWEEN.Tween(camera.rotation).to({
                x: -0.037,
                y: 0.57,
                z: 0.02
            }, 500).onComplete(function () {
                console.log(controls.target);
                // // 纹理
                textureLoader.load('./images/sc2.jpg', function (texture) {
                    scene2 = new THREE.MeshBasicMaterial({
                        map: texture,
                        side: THREE.DoubleSide
                    });
                    mesh.material = scene2;
                    gif_mesh.visible = false;
                });
            }).start()
        }
    }


    // -------------------------------------------------------------------------------------------

    function animate() {
        var delta = clock.getDelta();

        // update material
        gif_texture.needsUpdate = true; // 必须在这里设置为true, 这样传送阵才能更新

        // controls.update();
        renderer.render(scene, camera);
        spriteAnim();//粒子动画
        requestAnimationFrame(animate);
        TWEEN.update();
    }

    animate();//场景渲染

    // resize
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}