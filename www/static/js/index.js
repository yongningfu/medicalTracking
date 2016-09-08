/**
 * Created by Administrator on 2016/09/08.
 */

$(function() {

    var accessToken = $.cookie("accessToken");

    $("#showMyRoute").click(function(event) {

        $(this).css("background-image", "url(/static/img/waitting.gif)");
        var that = this;

        $.get("/api/position", {accessToken: accessToken}, function(serverData) {

            //var serverData =  {"data":[{"longitude":113.3884,"latitude":23.07084},{"longitude":113.388007,"latitude":23.071061},{"longitude":113.385994,"latitude":23.070578},{"longitude":113.385994,"latitude":23.070578},{"longitude":113.385954,"latitude":23.070497},{"longitude":113.385801,"latitude":23.069113},{"longitude":113.386714,"latitude":23.068403},{"longitude":113.386714,"latitude":23.068403},{"longitude":113.386714,"latitude":23.068403},{"longitude":113.385978,"latitude":23.066582},{"longitude":113.385978,"latitude":23.066582},{"longitude":113.385978,"latitude":23.066582},{"longitude":113.38586,"latitude":23.065136},{"longitude":113.38586,"latitude":23.065136},{"longitude":113.38506,"latitude":23.062839},{"longitude":113.385866,"latitude":23.062231},{"longitude":113.386879,"latitude":23.060999},{"longitude":113.386879,"latitude":23.060999},{"longitude":113.379189,"latitude":23.067319}]};

//            console.log(serverData);

            var bm = new BMap.Map("allmap");
            var points = serverData.data.map(function(element) {
                return new BMap.Point(element.longitude, element.latitude);
            });

            //console.log(points);

            //选中间点为显示
            var centerPosition = points[parseInt((points.length - 1) / 2)];
            console.log(centerPosition);
            bm.centerAndZoom(new BMap.Point(centerPosition.lng, centerPosition.lat), 16);
            /**
             * 渲染地图
             * */
            renderBaiduMap(points, bm, function() {
                $(that).css("background-image", "");
            });

        });

    });



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



