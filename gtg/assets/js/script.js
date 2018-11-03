$(document).ready(function () {
    "use strict";


    //*******Плавная прокрутка по якорям
    $(".anchor-scroll").on("click", function (event) {
        //отменяем стандартную обработку нажатия по ссылке
        event.preventDefault();
        //забираем идентификатор блока с атрибута href
        var id = $(this).attr('href'),
        //узнаем высоту от начала страницы до блока на который ссылается якорь
            top = $(id).offset().top;
        //анимируем переход на расстояние - top за 1500 мс
        $('body,html').animate({scrollTop: top}, 1500);
    });


    // FANCYBOX
    $(".fancybox").fancybox();

    // HAMBURGER MENU
    $('.hamburger-menu').on('click', function (e) {
        $("main").toggleClass("side-box-open");
        $("body").toggleClass("overflow-hidden");
    });

    // 	CLOSE SIDE BOX
    $('.close-side-box').on('click', function (e) {
        $("main").removeClass("side-box-open");
        $("body").removeClass("overflow-hidden");
    });

    // SEARCH
    $('.search-btn').on('click', function (e) {
        $(".search-box").toggleClass("search-box-open");
    });

    // TOOLTIP
    $('[data-toggle="tooltip"]').tooltip()

    // CUSTOM SELECT
    $('.selectpicker').selectpicker();

    // DATE PICKER
    $('.datepicker').datepicker()


    if ( jQuery().slick ){
        // MAIN SLIDER
        $('.main-slider').slick({
            dots: true,
            infinite: true,
            speed: 500,
            arrows: false,
            fade: true,
            autoplay: true,
            cssEase: 'linear'
        });

        // CONTENT CAROUSEL
        $('.content-carousel').slick({
            dots: true,
            arrows: false,
            autoplay: true
        });
    }



    // COUNTER
    $('.counter').counterUp({
        delay: 10,
        time: 1000
    });
    $('.numbers').counterUp({
        delay: 1000,
        time: 60000
    });

    // STELLAR PARALLAX
    $.stellar({
        horizontalScrolling: false,
        verticalOffset: 0,
        responsive: true
    });

    // TRANSITION OVERLAY
    $('.transition').on('click', function (e) {
        $('.transition-overlay').toggleClass("open");
    });

    // TRANSITION DELAY
    $('.transition').on('click', function (e) {
        e.preventDefault();
        var goTo = this.getAttribute("href");
        setTimeout(function () {
            window.location = goTo;
        }, 500);
    });

    // SOFT TRANSTION
    $('.soft-transition').addClass('hide-me');


    // MASONRY
    var $container = $('.masonry');
    $container.masonry({
        columnWidth: 0,
        itemSelector: '.masonry li'
    });

    //ТАБЛИЦА ПО ДОСТАВКЕ И ВЕСУ

    //Смена страны в SELECT'e
    var tempCountry = '';
    $('#pricing-form').find('select').on('change', function () {
        tempCountry = $(this).val();
        $('#js-form-result').addClass('active');
        makeDefaultBtn();
        seaCheck($(this));
        addressCheck($(this));
        mailCheck($(this));
        mailStatusCheck();
        makeBlink();
        makeCalc();
    });

    $('#weight, #delivery').find('input[type="radio"]').on('change', function () {
        makeCalc();
        makeBlink();
    });

    $('#additionalOpts').find('input[type="checkbox"]').on('change', function () {
        makeCalc();
        makeBlink();
    });

    $('#mailDelivery').on('change', function () {
        if ($('#pricing-form option:selected').val() !== 'Выберите страну доставки') {
            mailStatusCheck();
        }
    });


    //**************ФУНКЦИИ*********************


    //сбор отмеченных buttons с формы и вставка html-шаблона
    var makeCalc = function () {
        var tempArr = [];
        $('#pricing-form input').each(function () {
            if ($(this).prop('checked')) {
                tempArr.push($(this).val());
            }
        });
        if ($('#addressDelivery').prop('checked')) {
            $('#js-form-result').load('/gtg/templates/' + tempCountry
                + '-' + tempArr[0]
                + '-' + tempArr[1]
                + '-address.html', function (response, status) {
                if (status == "error") {
                    $('#js-form-result').load('/gtg/templates/error.html').addClass('active');
                }
            });
        } else if ($('#pricing-form').find('select').val() != null && !$('#mailDelivery').prop('checked')) {
            $('#js-form-result').load('/gtg/templates/' + tempCountry
                + '-' + tempArr[0]
                + '-' + tempArr[1]
                + '.html', function (response, status) {
                if (status == "error") {
                    $('#js-form-result').load('/gtg/templates/error.html').addClass('active');
                }
            });
        } else if ($('#pricing-form').find('select').val() != null && $('#mailDelivery').prop('checked')) {
            $('#js-form-result').load('/gtg/templates/banderol/' + tempCountry
                + '-' + tempArr[0]
                + '-mail.html', function (response, status) {
                if (status == "error") {
                    $('#js-form-result').load('/gtg/templates/error.html').addClass('active');
                }
            });
        } else {
            $('#js-form-result').load('/gtg/templates/empty.html').addClass('active');
        }
    };

    //Выставляем default значения radio-button
    var makeDefaultBtn = function () {
        $('#pricing-form').find('input[type="radio"]').each(function () {
            $(this).removeAttr('checked');
        });
        $('.default-radio').prop('checked', true);
        $('#addressDelivery').removeAttr('checked');
    };

    //Визуальный эффект при смене страны доставки
    var makeBlink = function () {
        $('.form-result')
            .css({
                borderColor: '#7A9CD4',
                transition: '.3s'
            });
        setTimeout(makeUnBlink, 300);
    };
    var makeUnBlink = function () {
        $('.form-result')
            .css({
                borderColor: '#eef0f2',
                transition: '.5s'
            });
    };

    //Проверка, возможна ли в данную страну доставка морем
    var seaCheck = function (obj) {
        var tempData = obj.find('option:selected').data('no-sea');

        if (tempData !== undefined && tempData == true) {
            $('#seaDelivery').attr('disabled', true);
        } else {
            $('#seaDelivery').removeAttr('disabled');
        }
    };

    //Проверка, возможно ли в данную страны доставлять бандероль
    var mailCheck = function (obj) {
        var tempData = obj.find('option:selected').data('no-mail');

        if (tempData !== undefined && tempData == true) {
            $('#mailDelivery')
                .attr('disabled', true)
                .removeAttr('checked')
                .closest('.full-block').hide();

        } else {
            $('#mailDelivery').removeAttr('disabled')
                .closest('.full-block')
                .show();
        }
    };

    //Проверка, есть ли адресная доставка
    var addressCheck = function (obj) {
        var tempData = obj.find('option:selected').data('address-delivery');

        if (tempData == undefined && tempData !== true) {
            $('#addressDelivery')
                .attr('disabled', true)
                .removeAttr('checked')
                .closest('.full-block').hide();
        } else {
            $('#addressDelivery').removeAttr('disabled')
                .closest('.full-block')
                .show();
        }
    };

    //Проверка, включен ли пункт "Бандероль"
    var mailStatusCheck = function () {
        if ($('#mailDelivery').prop('checked')) {
            $('#airDelivery').prop('checked', true);
            $('#seaDelivery').attr('disabled', true);
        } else if (!$('#pricing-form option:selected').data('no-sea')) {
            $('#seaDelivery').removeAttr('disabled');
        }
    };


    $('#countryList .country-name').on('click',function(){
        $('#countryList li.country-name').removeClass('active');
        $(this).addClass('active');
        var countryName = $(this).html();
        $('#countryName').html(countryName);
        var countryCode = $(this).attr('country-code');
        $('#countryRule li.country-rule').removeClass('active');
        $('#countryRule li.country-rule[country-code='+countryCode+']').addClass('active');
    });

});