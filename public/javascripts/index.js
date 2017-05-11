;
$(function() {

    //翻页效果动画
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
        onInit: function(swiper, event) {
            bookAnimate();
            // imgAnimate();
        },
        onSlideNextEnd: function(swiper, event) {
            if (mySwiper.realIndex == 1) {
                // 页面2图片动画效果
                imgAnimate();
            }
        },
        onSlidePrevEnd: function(swiper, event) {
            if (mySwiper.realIndex == 0) {
                // 页面1书本出现动画效果
                bookAnimate();
            }
            if (mySwiper.realIndex == 1) {
                // 页面2图片动画效果
                imgAnimate();
            }
        }

    });

    function bookAnimate() {
        $('.img-part img').hide();
        $('.img1').fadeIn(1500, function() {
            $('.img2').fadeIn(1000, function() {
                $('.img3').fadeIn(500, function() {
                    $('.img4').fadeIn(1000, function() {
                        $('.img5').fadeIn(500, function() {
                            $('.img6').fadeIn(1000, function() {
                                $('.img7').fadeIn(500, function() {
                                    $('.img8').fadeIn(1000, function() {
                                        // $('.arrow button').fadeIn();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    function imgAnimate() {
        $('.img-page img').css({ width: '6rem', top: '3rem', left: '0.2rem' }).stop().hide();
        var timeout = 100;
        $('.img-page img').each(function() {
            var top = $(this).attr('data-top');
            var left = $(this).attr('data-left')
            var $this = $(this);
            setTimeout(function() {
                $this.fadeIn(1000, function() {
                    $this.animate({
                        top: top,
                        left: left,
                        width: '3rem'
                    });
                });
            }, timeout);
            timeout += 1000;
        })
    }

    //箭头点击事件
    $('#arrow').click(function() {
        mySwiper.slideNext();
    })


    // 启动按钮点击事件
    $('#startBtn').click(function() {
        location.href = "./signup";
    })

});