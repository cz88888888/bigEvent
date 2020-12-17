$(function() {
    // 获取用户基本信息
    getUserInfo();
    var layer = layui.layer
    $('#btnLogout').on('click', function() {
        // 提示用户是否退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 清空本地的token
            localStorage.removeItem('token');
            // 跳转到登录页面
            location.href = '/login.html';
            layer.close(index);
        });
    })
});

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 渲染用户头像
            renderAvatar(res.data)
        },
        // ajax请求，无论成功还是失败，都会调用complete回调
        // complete: function(res) {
        //     console.log(res.responseJSON);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token');
        //         location.href = '/login.html';
        //     }
        // }
    });
};

// 渲染用户头像函数
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;' + name);
    // 按需渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}