function init() {
    // 兼容检测
    if(!Detector.webgl)  return Detector.addGetWebGLMessage(),void alert('您的浏览器不支持webgl,请更换新版本谷歌或火狐浏览器获取更好的浏览体验！'),!1 ;

    // canvas 代码 ：
    var scene,camera,renderer,SphereGeometry_heaven,SphereGeometry_house,scene1_heaven,scene1,scene2_heaven,scene2,gif_texture,raycaster,controls,time,heaven_sph_R,house_sph_R,textureLoader,radian,mouse = new THREE.Vector2();

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
        raycaster = new THREE.Raycaster();
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

        scene1_house = textureLoader.load('./images/zzc.png',function (texture) {
            SphereGeometry_house = new THREE.SphereGeometry(house_sph_R,50,50);
            var meshMaterial = new THREE.MeshBasicMaterial({
                transparent: !0,
                map: scene1_house,
                side: THREE.DoubleSide
            });
            var mesh = new THREE.Mesh(SphereGeometry_house, meshMaterial);
            mesh.position.set(0, 0, 0);
            mesh.name = 'house';
            scene.add(mesh);
        });

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

        gif_texture = new THREE.CanvasTexture(document.getElementById('gif'));
        canvasGif().render(document.getElementById('gif'), "./images/gogif.png", 16, 24, -1, function () {
        });
        var gif_material = new THREE.SpriteMaterial({map: gif_texture, needsUpdate: !0, side: THREE.FrontSide});
        // gif_material.map.magFilter = THREE.NearestFilter, gif_material.map.minFilter = THREE.NearestFilter;
        var gif_mesh = new THREE.Sprite(gif_material);
        gif_mesh.name = 'gif';
        gif_mesh.scale.set(2, 2, 2);
        gif_mesh.position.set(0, 0, -10);
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

        function changeScene(go,ev) {
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

                var t1 = new TWEEN.Tween(camera.rotation).to({
                    x: -0.037,
                    y: 0.57,
                    z: 0.02
                }, 800);

                var t2 = new TWEEN.Tween(camera).to({
                    fov: 50
                }, 500).onUpdate(function () {
                    camera.updateProjectionMatrix();
                }).onComplete(function () {
                    // // 纹理
                    textureLoader.load('./images/zzc1.png', function (texture) {
                        scene2_heaven = new THREE.MeshLambertMaterial({
                            map: texture,
                            side: THREE.DoubleSide
                        });
                        scene.getObjectByName('heaven').material = scene2_heaven;
                    });
                    textureLoader.load('./images/house2.png', function (texture) {
                        scene2_house = new THREE.MeshBasicMaterial({
                            map: texture,
                            side: THREE.DoubleSide,
                            // depthTest: true, // 深度测试为false ，png 黑色
                            alphaTest: 0.5  // 解决png 黑色的问题
                        });
                        scene.getObjectByName('house').transparent = !0;
                        scene.getObjectByName('house').material = scene2_house;
                        // scene.updateMatrixWorld(true);
                        camera.fov = 60;
                        camera.aspect = window.innerWidth / window.innerHeight;
                        camera.updateProjectionMatrix();
                        gif_mesh.visible = false;

                    });
                });

                t1.chain(t2).start();// 开启移动镜头，拉近镜头动画
            }
        }
    }

    function _render() {
        _define();
        _cScene();
    }



    _render();
    function animate() {
        requestAnimationFrame(animate);
        TWEEN.update(); // tween动画更新
        gif_texture.needsUpdate = true;
        renderer.render(scene,camera);
    }
    animate();

    // resize
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}