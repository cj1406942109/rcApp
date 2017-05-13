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


    //录音功能调用微信jssdk实现
    wx.ready(function() {
            wx.onVoiceRecordEnd({
                // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                complete: function(res) {
                    playVoice(res.localId);
                    uploadVoice(res.localId);
                }
            });

            wx.onVoicePlayEnd({
                success: function(res) {
                    stopWave();
                }
            });
        })
        //报名页面录音按钮
    var startTime = 0;
    var endTime = 0;
    var recordTimer;
    $('#record button').on('touchstart', function() {
        // $("input[name='audio']").click();
        event.preventDefault();
        startTime = new Date().getTime();
        recordTimer = setTimeout(function() {
            wx.startRecord({
                success: function() {
                    localStorage.rainAllowRecord = 'true';
                },
                cancel: function() {
                    alert('用户拒绝授权录音');
                }
            });
        }, 300);
    });

    $('#record button').on('touchend', function() {
        event.preventDefault();
        endTime = new Date().getTime();
        if ((endTime - startTime) < 300) {
            endTime = 0;
            startTime = 0;
            //小于300ms，不录音
            clearTimeout(recordTimer);
        } else {
            wx.stopRecord({
                success: function(res) {
                    playVoice(res.localId);
                    uploadVoice(res.localId);
                },
                fail: function(res) {
                    alert(JSON.stringify(res));
                }
            });
        }
    });

    function playVoice(localId) {
        $('#record img').show();
        $('#record img').click(function() {
            wx.playVoice({
                localId: localId // 需要播放的音频的本地ID，由stopRecord接口获得
            });
        })
    }
    //上传录音
    function uploadVoice(localId) {
        //调用微信的上传录音接口把本地录音先上传到微信的服务器
        //不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
        wx.uploadVoice({
            localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function(res) {
                //把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
                $("input[name='audio']").val(localId);
                // $.ajax({
                //     url: '/downloadAudio',
                //     type: 'post',
                //     data: JSON.stringify(res),
                //     dataType: "json",
                //     success: function(data) {
                //         console.log('文件已经保存到服务器');
                //     },
                //     error: function(xhr, errorType, error) {
                //         console.log(error);
                //     }
                // });
            }
        });
    }
});