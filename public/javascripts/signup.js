$(function() {

    var currentNum = 0;
    $('#imgAdd').click(function() {
        if ($("input[name='img1']").val() == '') {
            $("input[name='img1']").click();
        } else if ($("input[name='img2']").val() == '') {
            $("input[name='img2']").click();
        } else if ($("input[name='img3']").val() == '') {
            $("input[name='img3']").click();
        } else {
            alert('最多上传三封家书！');
        }
    });

    $("input[name*='img'").change(function() {
        var num = $(this).attr('name').charAt($(this).attr('name').length - 1);

        var filePath = $(this).val();
        var objUrl = getObjectURL(this.files[0]);
        var extStart = filePath.lastIndexOf(".");
        var ext = filePath.substring(extStart, filePath.length).toUpperCase();

        if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
            this.value = "";
            return false;
        } else {
            var prevSelector = "#prev" + num;
            $('.preview').show();
            $(prevSelector).attr('src', objUrl).show();
        }

        function getObjectURL(file) {
            var url = null;
            if (window.createObjectURL != undefined) { // basic
                url = window.createObjectURL(file);
            } else if (window.URL != undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            }
            //console.log(url);
            return url;
        }
    })

    $("input[name='audio']").change(function() {
        $('#record img').show();
    })

    $('#prev1').click(function() {
        $("input[name='img1']").click();
    });

    $('#prev2').click(function() {
        $("input[name='img2']").click();
    });

    $('#prev3').click(function() {
        $("input[name='img3']").click();
    });

    $('#submit').click(function() {
        var name = $("input[name='name']").val();
        var tel = $("input[name='tel']").val();
        var original = $("input[name='original']:checked").val();
        var img1 = $("input[name='img1']").val();
        var img2 = $("input[name='img2']").val();
        var img3 = $("input[name='img3']").val();
        var audio = $("input[name='audio']").val();

        // console.log(original);
        var regExpTel = /^1[34578]\d{9}$/;
        if (name === '') {
            alert('姓名不能为空！');
        } else if (tel === '') {
            alert('手机号不能为空！');
        } else if (!regExpTel.test(tel)) {
            alert('手机号格式错误，请重新填写！');
        } else if (!img1 && !img2 && !img3) {
            alert('至少上传一封家书！');
        } else if (!audio) {
            alert('请上传朗读音频');
        } else {
            $("input[type='submit']").click();
        }
    });

    // 解决输入框弹出时背景图发生改变
    var originHeight = window.innerHeight;
    window.onresize = function() {
        $('html').height(originHeight);
    }


    //报名页面录音按钮
    $('#record button').click(function() {

        // navigator.mediaDevices.getUserMedia({ audio: true, video: false }, function(mediaStream) {
        //     var video = document.querySelector('video');
        //     video.src = window.URL.createObjectURL(mediaStream);
        //     video.onloadedmetadata = function(e) {
        //         // Do something with the video here.
        //     };
        // }, function(err) {
        //     console.log(err.name);
        // });
        $("input[name='audio']").click();
    })
});