# n3D
three.js  Tween.js --》 仿百度全景，场景切换，粒子效果，点击弹窗，切换缓动

注意 ：
  
  1、OrbitControls 不起作用，最后发现是 camera.position 设置的问题。避免设置为（0,0,0）即可
  
  2、想做一个传送阵的动画效果，网上找了一张传送阵的gif图片，导出了序列帧图片，可以利用ps_cc版本以上的文件--自动--联系表II功能，设置好确定就可以了，ps就会自动帮我们合并图片为我们设置好要求的图片系列大图。

  3、利用CanvasTexture，sprite来做传送阵的特效，结果发现一直没有更新纹理，后来发现必须加 gif_texture.needsUpdate = true; 到animate() 循环方法中，这样每次循环才能更新 canvas 纹理，传送阵的效果也出来了。
  
  4、在two branch 做png贴图更新出来 透明部分变为黑色的问题，解决方法: 在 material 中添加：  alphaTest: 0.5 ;
