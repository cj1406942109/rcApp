$(function() {

    //翻页效果动画
    $('#imgAdd button').click(function() {
        testImgNum();
    })
    $('body').on('click', '#submit', function() {
        submitTest();
    });

    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    // alert('是否是Android：' + isAndroid);
    // alert('是否是iOS：' + isiOS);
    if (isAndroid) {
        $('.signup-page .jiashu input').addClass('hidden');
    }
    if (isiOS) {
        $('.signup-page #imgAdd').hide();
        $('.signup-page .jiashu').addClass('height');
        var audio = document.getElementById('media');
        audio.play();
    }

    function audioAutoPlay(id) {
        var audio = document.getElementById(id);
        audio.play();
        document.addEventListener("WeixinJSBridgeReady", function() {
            audio.play();
        }, false);
    }
    audioAutoPlay('media');

    var mySwiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        loop: false,

        // 如果需要分页器
        pagination: '.swiper-pagination',
        paginationClickable: true,

        // 如果需要前进后退按钮
        // nextButton: '.swiper-button-next',
        // prevButton: '.swiper-button-prev',

        // 如果需要滚动条
        scrollbar: '.swiper-scrollbar',

    });
    //箭头点击事件
    $('#arrow').click(function() {
        mySwiper.slideNext();
    })

    $('#audioBtn').click(function() {
        var audio = document.getElementById('media');
        if ($(this).hasClass('rotate')) {
            $(this).removeClass('rotate');
            audio.pause();
        } else {
            $(this).addClass('rotate');
            audio.play();
        }
    })

    // 启动按钮点击事件
    $('#startBtn').click(function() {
        mySwiper.slideNext();
    })
    $('#startBtn').on('mouseup', function() {
        mySwiper.slideNext();
    })

    // $('body').on('click', '#imgAdd', function() {
    //     testImgNum();
    // });

    // $('body').on('click', '#prev1', function() {
    //     $("input[name='img1']").click();
    // });
    // $('body').on('click', '#prev2', function() {
    //     $("input[name='img2']").click();
    // });
    // $('body').on('click', '#prev3', function() {
    //     $("input[name='img3']").click();
    // });

    // 解决输入框弹出时背景图发生改变
    var originHeight = window.innerHeight;
    window.onresize = function() {
        $('html').height(originHeight);
    }

    // $('#imgAdd').click(function() {
    //     testImgNum();
    // });

    // $('#imgAdd').on('touch', function() {
    //     testImgNum();
    // })

    function testImgNum() {
        if ($("input[name='img1']").val() == '') {
            $("input[name='img1']").click();
        } else if ($("input[name='img2']").val() == '') {
            $("input[name='img2']").click();
        } else if ($("input[name='img3']").val() == '') {
            $("input[name='img3']").click();
        } else {
            alert('最多上传三封家书！');
        }
    }

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

    // $("input[name='audio']").change(function() {
    //     $('#record audio').show();
    // })

    $('#prev1').click(function() {
        $("input[name='img1']").click();
    });

    $('#prev2').click(function() {
        $("input[name='img2']").click();
    });

    $('#prev3').click(function() {
        $("input[name='img3']").click();
    });

    $('#prev1').on('touch', function() {
        $("input[name='img1']").click();
    });

    $('#prev2').on('touch', function() {
        $("input[name='img2']").click();
    });

    $('#prev3').on('touch', function() {
        $("input[name='img3']").click();
    });

    function submitTest() {
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
            return false;
        } else if (tel === '') {
            alert('手机号不能为空！');
            return false;
        } else if (!regExpTel.test(tel)) {
            alert('手机号格式错误，请重新填写！');
            return false;
        } else if (!img1 && !img2 && !img3) {
            alert('至少上传一封家书！');
            return false;
        } else if (!audio) {
            alert('请上传朗读音频');
            return false;
        } else {
            $('body').off('click', '#submit');
            // var form = document.forms.namedItem("signupForm");
            // var formdata = new FormData(form);
            var formdata = new FormData(document.querySelector("form"));
            // formdata.append('name', name);
            // formdata.append('tel', tel);
            // formdata.append('original', original);
            // formdata.append('img1', img1);s
            // formdata.append('img2', img2);
            // formdata.append('img3', img3);
            // formdata.append('audio', audio);
            // $("input[type='submit']").click();
            //异步提交表单

            $.ajax({
                url: 'http://114.55.175.41:3000/signup',
                type: 'post',
                data: formdata,
                processData: false,
                contentType: false,
                success: function(data) {
                    console.log(data);
                    $('body').on('click', '#submit', function() {
                        submitTest();
                    });

                    if (data.message == 'success') {
                        location.href = "./success.html";
                    } else {
                        // lock = true;
                    }
                },
                error: function() {
                    // lock = true;
                }
            });
            return false;
        }
    }

});