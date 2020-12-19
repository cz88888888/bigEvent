$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义一个查询参数的对象
    var q = {
        pagenum: 1, // 页码值,默认请求第一页数据
        pagesize: 2, // 每页显示几条数据,默认每页显示2条数据
        cate_id: '', // 文章分类的Id
        state: '' //文章的发布状态
    };

    initTable();
    initCate();

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('获取文章列表失败')
                }
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

                // 调用渲染页面的方法
                renderPage(res.total);
            }
        })
    };

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通知layui重新渲染表单区域的UI结构
                form.render();
            }
        })
    };

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();

        // 为查询参数q对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;

        // 根据最新的筛选条件筛选表单数据
        initTable();
    })

    // 渲染分页的函数
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', // 分页容器的id
            count: total, // 数据总条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, //设置默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 触发jump回调函数的方式:
            // 1. 点击页码的时候会触发jump回调
            // 2. 调用laypage.render()方法,会触发jump回调
            jump: function(obj, first) { //分页发生切换时候，触发jump的函数
                // 把最新的页码值赋值到q查询对象中
                q.pagenum = obj.curr;
                // 把最新的条目数赋值到q的pagesize属性中
                q.pagesize = obj.limit;
                // 根据新的q获取对应的数据列表并渲染表格
                // 通过first的值来判断jump回调触发的方式
                if (!first) {
                    initTable();
                }
            }
        })
    };

    // 通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length;

        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功');
                    // 当数据删除完成后，需要判断当前页是否还有数据
                    // 如果当前页没数据了，则让页码值减去1
                    if (len === 1) {
                        // 如果len的值为1，则证明当前页面没数据了
                        // 页码值最小必须为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    });

    // 通过代理形式为编辑按钮绑定点击事件

    $('tbody').on('click', function() {
        var id = $('.btn-edit').attr('data-id');
        location.href = '/article/art_update.html?' + id;
    })

});