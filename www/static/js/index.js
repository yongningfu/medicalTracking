/**
 * Created by Administrator on 2016/09/08.
 */

$(function() {

    var accessToken = $.cookie("accessToken");

    $("#showMyRoute").click(function(event) {

        $("#showMyRoute span").addClass("dotting");
        $("#showMyRoute").addClass("btn-success");
        $("#showheapMap").removeClass("btn-success");
        var that = this;
        $.get("/api/position", {accessToken: accessToken}, function(serverData) {

            //var serverData =  {"data":[{"longitude":113.3884,"latitude":23.07084},{"longitude":113.388007,"latitude":23.071061},{"longitude":113.385994,"latitude":23.070578},{"longitude":113.385994,"latitude":23.070578},{"longitude":113.385954,"latitude":23.070497},{"longitude":113.385801,"latitude":23.069113},{"longitude":113.386714,"latitude":23.068403},{"longitude":113.386714,"latitude":23.068403},{"longitude":113.386714,"latitude":23.068403},{"longitude":113.385978,"latitude":23.066582},{"longitude":113.385978,"latitude":23.066582},{"longitude":113.385978,"latitude":23.066582},{"longitude":113.38586,"latitude":23.065136},{"longitude":113.38586,"latitude":23.065136},{"longitude":113.38506,"latitude":23.062839},{"longitude":113.385866,"latitude":23.062231},{"longitude":113.386879,"latitude":23.060999},{"longitude":113.386879,"latitude":23.060999},{"longitude":113.379189,"latitude":23.067319}]};

            var bm = new BMap.Map("allmap");
            var points = serverData.data.map(function(element) {
                return new BMap.Point(element.longitude, element.latitude);
            });

            //console.log(points);

            //选中间点为显示
            var centerPosition = points[parseInt((points.length - 1) / 2)];
            console.log(centerPosition);
            bm.centerAndZoom(new BMap.Point(centerPosition.lng, centerPosition.lat), 16);


            var pointsWithCount = points.map(function (element) {
                return {"lng":element.lng,"lat":element.lat,"count":50}
            });

            // showHeadMap(bm, BMapLib, pointsWithCount);

            /**
             * 渲染地图
             * */
            renderBaiduMapbyAllPeople(serverData, bm, BMapLib, function() {
                $("#showMyRoute span").removeClass("dotting");
            })

        });

    });


    $("#showheapMap").click(function(event) {

        $("#showheapMap span").addClass("dotting");
        $("#showheapMap").addClass("btn-success");
        $("#showMyRoute").removeClass("btn-success");
        $.get("/api/position", {accessToken: accessToken}, function(serverData) {

            //var serverData =  {"data":[{"longitude":113.3884,"latitude":23.07084},{"longitude":113.388007,"latitude":23.071061},{"longitude":113.385994,"latitude":23.070578},{"longitude":113.385994,"latitude":23.070578},{"longitude":113.385954,"latitude":23.070497},{"longitude":113.385801,"latitude":23.069113},{"longitude":113.386714,"latitude":23.068403},{"longitude":113.386714,"latitude":23.068403},{"longitude":113.386714,"latitude":23.068403},{"longitude":113.385978,"latitude":23.066582},{"longitude":113.385978,"latitude":23.066582},{"longitude":113.385978,"latitude":23.066582},{"longitude":113.38586,"latitude":23.065136},{"longitude":113.38586,"latitude":23.065136},{"longitude":113.38506,"latitude":23.062839},{"longitude":113.385866,"latitude":23.062231},{"longitude":113.386879,"latitude":23.060999},{"longitude":113.386879,"latitude":23.060999},{"longitude":113.379189,"latitude":23.067319}]};
            var bm = new BMap.Map("allmap");
            var points = serverData.data.map(function(element) {
                return new BMap.Point(element.longitude, element.latitude);
            });

            //选中间点为显示
            var centerPosition = points[parseInt((points.length - 1) / 2)];
            console.log(centerPosition);
            bm.centerAndZoom(new BMap.Point(centerPosition.lng, centerPosition.lat), 16);


            var pointsWithCount = points.map(function (element) {
                return {"lng":element.lng,"lat":element.lat,"count":50}
            });

            showHeadMap(bm, BMapLib, pointsWithCount, function () {
                $("#showheapMap span").removeClass("dotting");
            });

        });
    })

});


/**
 * 把一个数组进行分组 每一组为n
 * */
function splitArrayToGroup(array, n) {
    if (n == undefined || n <= 0) return [];
    var start = 0;
    var end  = n;
    var group = [];
    while (true) {

        //标记结束
        if (end >= array.length) {
            end = array.length;
            //防止空数组
            if (end > start) {
                group.push(array.slice(start, end));
            }
            break;
        } else {
            group.push(array.slice(start, end));
            start = end;
            end = end + n;
        }
    }
    return group;
}


/**
 * 封装promise操作函数
 * bmapPoints 为需要转换的点数组
 * convertor  为百度提供的转化接口
 * @return promise
 * */

function translatePromiseLib(bmapPoints, convertor) {
    var promise = new Promise(function(resolve, reject) {
        convertor.translate(bmapPoints, 1, 5, function(data) {
            if (data.status === 0) {
                resolve(data);
            } else {
                reject(data.status);
            }
        });
    });
    return promise;
}


/**
 * 得到数据后 渲染函数
 * @param points 为具体的需要转化的bmap点  array类型
 * @bm  BMap.Map 具体的Map对象
 * @callback 渲染完后的操作
 * todo 后面可以改写成热插播的模式--就是分离集体的操作
 * */


function renderBaiduMap(points, bm, callback) {

    if (points.length !== 0) {

        var convertor = new BMap.Convertor();

        //每10个一组  生成promise数组
        var groupArray = splitArrayToGroup(points, 10);
        var promiseArray = [];
        groupArray.forEach(function(element) {
            promiseArray.push(translatePromiseLib(element, convertor));
        });

        //promise管理流程
        Promise.all(promiseArray).then(function(data) {


            //描绘线
            var allTransPointArray = [];
            data.forEach(function(element) {
                allTransPointArray = allTransPointArray.concat(element.points);
            });

            //console.log(allTransPointArray);

            var curve = new BMapLib.CurveLine(allTransPointArray, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5});
            bm.addOverlay(curve); //添加到地图中
            curve.enableEditing(); //开启编辑功能
            callback();

        }, function (err) {
            console.log("get data err, number", err);
        });

    } else {
        alert("没有定位数据");
    }

}

/**
 * 把服务器按位置的发起人分组  返回一个map key为发起人的id  值为数组， 数组元素为BMap.Point
 * */

function splitServerTOMap(serverData) {
    var result = {};
    var data = serverData.data;
    if (data.length == 0) {
        return result;
    }

    for (var i = 0; i < data.length; i++) {
        var tempLauncherKey = "" + data[i].launcher_id;
        if (result[tempLauncherKey] == null) {
            result[tempLauncherKey] = []
        }
        var element = data[i];
        result[tempLauncherKey].push(new BMap.Point(element.longitude, element.latitude))
    }
    return result;
}

/**
 * 根据颜色 和 一个点数组 把先添加到地图
 * @param pointArray点数据
 * @color 线颜色
 * @text 先开头文本
 * */
function addLineToMap(bm, BMapLib, pointsArray, color, text) {

    //添加头
    var vectorFCArrow = new BMap.Marker(pointsArray[0], {
        // 初始化方向向上的闭合箭头
        icon: new BMap.Symbol(BMap_Symbol_SHAPE_PLANE, {
            scale: 2,
            strokeWeight: 1,
            rotation: 0,//顺时针旋转30度
            fillColor: color,
            fillOpacity: 0.8
        })
    });
    var label = new BMap.Label("起点", {offset:new BMap.Size(10, -10)});
    vectorFCArrow.setLabel(label);
    bm.addOverlay(vectorFCArrow);

    var curve = new BMapLib.CurveLine(pointsArray, {strokeColor:color, strokeWeight:3, strokeOpacity:1});
    bm.addOverlay(curve); //添加到地图中
}

/**
 * 生成颜色
 * */

function generateRandomColor() {
    var r = parseInt(Math.random()*16);
    var g = parseInt(Math.random()*16);
    var b = parseInt(Math.random()*16);
    //转换为十六进制,使用 int.toString(16)即可.
    //相应的，还可以使用toString(10) , toString(8), toString(2)来转化为十进制，八进制，二进制等。
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    //拼接成颜色的RGB值
    var color = '#'+r+g+b;
    return color;
}


/**
 * 渲染地图v2 不进行大规模进行转化(服务器传递过来的已经是转化好的)
 * 不同的人给定一条线
 * */


function renderBaiduMapbyAllPeople(serverData, bm, BMapLib, callback) {
    var data = splitServerTOMap(serverData);

    for (key in data) {
        var color = generateRandomColor();
        addLineToMap(bm, BMapLib, data[key], color);
    }

    if (callback != null) callback();
}

/**
 * 显示热力图 points格式为  {"lng":116.418261,"lat":39.921984,"count":50},
 * */
function showHeadMap(bm, BMapLib, pointsWithCount, callback) {
    var heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
    bm.addOverlay(heatmapOverlay);
    heatmapOverlay.setDataSet({data:pointsWithCount,max:100});
    heatmapOverlay.show();
    if (callback != null) callback();
}








