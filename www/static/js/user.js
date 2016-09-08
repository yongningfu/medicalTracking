/**
 * Created by Administrator on 2016/09/08.
 */

$(function () {


    /**
     * 密码 用户名简单的非空判断
     * */




    /**
     * 登录监听
     * */


        $("#login_in").click(function(event) {

            event.preventDefault();
            var name = $(".login_container  input[name='name']").val();
            var password = $(".login_container input[name='password']").val();
            $.post('/login/dologin', {name: name, password: password}, function(data) {

                console.log(data);
                if (data.errno > 0) {
                    alert(data.errmsg);
                } else {
                   window.location.href = '/';
                }
            });
        });
});