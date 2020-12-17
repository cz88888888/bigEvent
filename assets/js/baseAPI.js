// 注意:每次调用$.get()或者$.post()或者$.ajax()的时候，都会先调用ajaxPrefilter这个函数
$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // 统一为有权限的接口，设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载complete回调函数
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    }
})