$(document).ready(function() {
    var dropdown_flag = true;
    $('#dropdown-button').bind('click', dropdownShow);
    $('#dropdown-menu>li').bind('click', dropdownShut);

    function dropdownShow(event) {
        event.stopPropagation();
        if (dropdown_flag) {
            $('#dropdown-menu').css('display', 'block');
        } else {
            $('#dropdown-menu').css('display', 'none');
        }
        dropdown_flag = !dropdown_flag;
    }
    $(document).bind('click', dropdownShut2);

    function dropdownShut() {
        $('#dropdown-value').text($(this).text());
        var ws = $('#dropdown-button').width() + 26;
        $('.dropdown-container>input').css('paddingLeft', ws + 'px');
        $('#dropdown-menu').css('display', 'none');
        dropdown_flag = true;
    }

    function dropdownShut2() {
        $('#dropdown-menu').css('display', 'none');
        dropdown_flag = true;
    }
    $('.history-cont-wrap').css({
        top: $('.header')[0].offsetHeight + 'px'
    });
    $('.history').hover(function() {
        $('.history>div').css('display', 'block');
        $('.history-cont-wrap').css('display', 'block');
    }, function() {
        $('.history-cont-wrap').css('display', 'none');
        $('.history>div').css('display', 'none');
    });
    $('.history-cont-wrap').hover(function() {
        $('.history>div').css('display', 'block');
        $('.history-cont-wrap').css('display', 'block');
    }, function() {
        $('.history-cont-wrap').css('display', 'none');
        $('.history>div').css('display', 'none');
    });
    //slideshow
    var duringTime = 3000;
    var slideHeight = $('.slide-container')[0].offsetHeight;
    var timer, timers;
    var ix = 0;

    function moveTo(startPos, endPos, dom) {
        var step = 0;
        var stepMax = 15;
        var startPos = startPos;
        var endPos = endPos;
        var everyStep = (endPos - startPos) / stepMax;
        if (timers) {
            clearInterval(timers);
        }

        function move() {
            step++;
            dom.scrollTop += everyStep;
            if (step >= stepMax) {
                clearInterval(timers);
                dom.scrollTop = endPos;
            }
        }
        timers = setInterval(move, 20);
    }
    autoMove();

    function autoMove() {
        moveTo($('.slide-container')[0].scrollTop, slideHeight * ix, $('.slide-container')[0]);
        $('.p-arrow').eq(ix).removeClass('p-arrow-show').addClass('p-arrow-show').parent().siblings('li').children('.p-arrow').removeClass('p-arrow-show');
        ix++;
        if (ix >= $('.slide-links>a').length) {
            $('.slide-container')[0].scrollTop = 0;
            ix = 0;
        }
    }
    timer = setInterval(autoMove, duringTime);
    $('.pagination-li').hover(function() {
        clearInterval(timer);
        ix = $(this).index();
        moveTo($('.slide-container')[0].scrollTop, slideHeight * ix, $('.slide-container')[0]);
        $('.p-arrow').eq(ix).removeClass('p-arrow-show').addClass('p-arrow-show').parent().siblings('li').children('.p-arrow').removeClass('p-arrow-show');
    }, function() {
        timer = setInterval(autoMove, duringTime);
    });

    //slideshow of recommend
    var slide1 = new Swiper('.recommend-products', {
        nextButton: '.recommend-next',
        prevButton: '.recommend-prev',
        spaceBetween: 0,
        buttonDisabledClass: 'mine'
    });
    //document scrolling
    $(document).scroll(function() {
        if ($('body')[0].scrollTop >= $('.recommend').offset().top) {
            $('.recommend').css('paddingTop', '60px');
            $('.header-form').addClass('search-fixed');
            $('.logo').addClass('logo-hide');
            //nav
            $('.main-nav-wrap').addClass('nav-fixed');
            $('.nav-long').css('display', 'none');
            $('.nav-short').css('display', 'block');
            $('.main-nav-wrap').hover(function() {
                $('.bg').css('display', 'block');
            }, function() {
                $('.bg').css('display', 'none');
            });
        } else {
            $('.recommend').css('paddingTop', '0px');
            $('.header-form').removeClass('search-fixed');
            $('.logo').removeClass('logo-hide');
            //nav
            $('.main-nav-wrap').removeClass('nav-fixed');
            $('.nav-long').css('display', 'block');
            $('.nav-short').css('display', 'none');
            $('.main-nav-wrap').unbind();
            $('.bg').css('display', 'none');
        }
    });
    //row
    var swiper2 = new Swiper('.rowBlock-swiper-container1', {
        nextButton: '.rowBlock-next1',
        prevButton: '.rowBlock-prev1',
        spaceBetween: 0,
        loop: true,
        autoplay: 3000,
        autoplayDisableOnInteraction: false,
        pagination: '.rowBlock-pagination1',
        paginationClickable: true
    });
    //row tab
    $('.rowBlock-tabs-nav-li').click(function() {
        var i = $(this).index();
        $(this).addClass('thisTab').siblings('li').removeClass('thisTab');
        $(this).parent().siblings('.rowBlock-tabs-links').children('li').eq(i).addClass('thisLink').siblings('li').removeClass('thisLink');
        $(this).parent().siblings('.rowBlock-swiper').children('li').eq(i).addClass('thisSwiper').siblings('li').removeClass('thisSwiper');
        //rowBlock-swiper
        var swiper11 = new Swiper('.rowBlock-container', {
            nextButton: '.rowBlock-next',
            prevButton: '.rowBlock-prev',
            spaceBetween: 0,
            buttonDisabledClass: 'mine'
        });
    });
    //rowBlock-swiper
    var swiper11 = new Swiper('.rowBlock-container', {
        nextButton: '.rowBlock-next',
        prevButton: '.rowBlock-prev',
        spaceBetween: 0,
        buttonDisabledClass: 'mine'
    });
    //login or sign up
    $('.user-form-nav-list').click(function() {
        var i = $(this).index();
        $(this).removeClass('thisForm').addClass('thisForm').siblings().removeClass('thisForm');
        if (i == 0) {
            $('.user-text-login').show();
            $('.user-text-signUp').hide();
            $('.user-form-login').show();
            $('.user-form-signUp').hide();
        } else {
            $('.user-text-login').hide();
            $('.user-text-signUp').show();
            $('.user-form-login').hide();
            $('.user-form-signUp').show();
        }
    });
    //login
    $('.userShow1').click(function() {
        $('.user').show();
        $('.user-form-nav-list').eq(0).removeClass('thisForm').addClass('thisForm').siblings().removeClass('thisForm');
        $('.user-text-login').show();
        $('.user-text-signUp').hide();
        $('.user-form-login').show();
        $('.user-form-signUp').hide();
    });
    //sign up
    $('.userShow2').click(function() {
        $('.user').show();
        $('.user-form-nav-list').eq(1).removeClass('thisForm').addClass('thisForm').siblings().removeClass('thisForm');
        $('.user-text-login').hide();
        $('.user-text-signUp').show();
        $('.user-form-login').hide();
        $('.user-form-signUp').show();
    });
    $('#shutForm').click(function() {
        $('.user').hide();
    });
});