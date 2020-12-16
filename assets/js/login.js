$(function() {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });

    // 点击“去登录”的链接
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 自定义校验的函数写法，校验两次密码是否一致
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致!';
            }
        }
    });

    // 监听注册表单的提交事件
    $('#form-reg').on('submit', function(e) {
        e.preventDefault();
        var data = { username: $('#form-reg [name=username]').val(), password: $('#form-reg [name=password]').val() };
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            };
            layer.msg('注册成功,请登录');
            // 模拟点击行为去登录页面
            $('#link_login').click();
        });
    });

    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败!')
                }
                layer.msg('登录成功!');
                // 将登录成功得到的token保存到localStorage中
                localStorage.setItem('token', res.token);
                location.href = '/index.html';
            }
        });
    });
});