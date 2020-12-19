$(function() {

    // 定义获取文章详情的函数
    function getAtrDetail() {
        initEditor();
        var url = location.search;
        id = url.substr(1);
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('获取文章详情失败')
                }
                var htmlStr = template('tpl-update', res);
                $('#art-update').html(htmlStr);
                initEditor();
                artTailoring();
                form.render();
            }
        })
    }



    var layer = layui.layer;
    var form = layui.form;


    // initCate();

    // 初始化富文本编辑器

    getAtrDetail();
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('初始化文章分类失败')
                }
                // 调用模板引擎渲染下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    };

    // 定义文章封面裁剪
    function artTailoring() {
        // 1. 初始化图片裁剪器
        var $image = $('#image')

        // 2. 裁剪选项
        var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }

        // 3. 初始化裁剪区域
        $image.cropper(options)

        // 为选择封面按钮绑定点击事件
        $('#btnChooseImage').on('click', function() {
            $('#coverFile').click();
        });

        // 监听coverFile的change事件
        $('#coverFile').on('change', function(e) {
            var files = e.target.files;
            if (files.length === 0) {
                return;
            }
            var newImgURL = URL.createObjectURL(files[0]);
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        });
    }

    // 定义文章状态
    var art_state = '已发布';

    // 为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    });

    // 为表单绑定 submit提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();

        // 基于form表单，快速创建一个FormData对象
        var fd = new FormData($(this)[0]);
        fd.append('state', art_state);


        // 将封面裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            // 将 Canvas 画布上的内容，转化为文件对象blob
            .toBlob(function(blob) {
                // 将文件对象blob存储到fd中
                fd.append('cover_img', blob);

                // 发起ajax数据请求
                publishArticle(fd);
            })
    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果向服务器提交的是FormData数据格式,则必须添加以下俩个配置
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功');
                location.href = '/article/art_list.html';
            }
        })
    };
})