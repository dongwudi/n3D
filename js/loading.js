!function (window, func) {
    'function' == typeof define && define.amd ? define(func) : 'object' == typeof exports ? module.exports = func() : window.resLoader = func(window);
}(window, function () {
    function loading(options) {
        // this.option = {    resourceType: "images",baseUrl: "./",resources: [],onStart: null,onProgress: null,onComplete: null}
        // 并且为传入options时，弹出提示信息"参数错误！"；
        if (this.option = {
                resourceType: "images/",
                baseUrl: "./",
                resources: [],
                onStart: null,
                onProgress: null,
                onComplete: null
            } , !options) {
            return void alert("参数错误！");
        }
        // 自定义option 中 key 的 value 值
        for (var option in options) {
            this.option[option] = options[option];
        }
        // 状态
        this.status = 0;
        // 总的资源数
        this.total = this.option.resources.length || 0;
        // 目前加载的资源的下标
        this.currentIndex = 0
    }

    // 判断是否有这个函数
    var flag = function (func) {
        return "function" == typeof func;
    };

    loading.prototype.start = function () {
        this.status = 1; // 开始后状态变为true
        // 是否输入的正式图片地址，不是就拼接资源地址 ,然后加载图片
        for (var self = this, baseUrl = this.option.baseUrl, i = 0, num = this.option.resources.length; i < num; i++) {
            var source = this.option.resources[i];
            var url = '';
            url =   0 === source.indexOf('http://') ||   0 === source.indexOf('https://')  ? source :( baseUrl + this.option.resourceType + source);
            var img = new Image();
            // 这里的this 是 img ，用 self 执行 loading实例
            img.onload = function () {
                self.loaded();
            };
            img.onerror = function () {
                self.loaded();
            };
            img.src = url;
        }
        // 有onStart就执行
        flag(this.option.onStart) && this.option.onStart(this.total)
    };
    // 每加载一张图片（失败，成功）都调用一次
    loading.prototype.loaded = function () {
        flag(this.option.onProgress) && this.option.onProgress(++this.currentIndex, this.total);
        this.currentIndex === this.total && flag(this.option.onComplete) && this.option.onComplete(this.total);
    };

    // 返回loading 函数
    return loading;
});

// 传入图片
var loading  = new resLoader({
   resources:['loading.png','sc1.jpg','sc2.jpg'],
   onStart : function () {
       console.log('onStart');
   },
    onProgress:function (currentIndex,total) {
        console.log('currentIndex--' + currentIndex + 'total---' + total);
        console.log(Math.ceil((currentIndex / total) * 100) + '%');
        document.getElementById('progress').innerHTML = Math.ceil(( currentIndex / total) * 100 )+ '%';
    },
    onComplete:function (total) {
        console.log('over--'+total);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('canvas').style.display = 'block';
        // canvas
        init();
    }
});

loading.start();
