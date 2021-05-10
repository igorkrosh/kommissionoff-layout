$(document).ready(Core);

function Core()
{
    InitSimpleLightbox();
    InitOwl();
    InitNoUiSlider();

    SetTabSwitcher();
    SetModal();
    SetCatalogMenu();
}

function InitOwl()
{
    $('section.main .owl-carousel').owlCarousel({
        items: 1,
        navContainer: $('section.main .slider__wrapper .owl__nav'),
        nav: true,
        dots: false,
        autoplay: true,
        loop: true,
    });

    $('section.products__list.last .owl-carousel').owlCarousel({
        items: 4,
        navContainer: $('section.products__list.last .owl__nav'),
        nav: true,
        dots: false,
        autoplay: true,
        loop: true,
    })

    $('section.products__list.sale .owl-carousel').owlCarousel({
        items: 4,
        navContainer: $('section.products__list.sale .owl__nav'),
        nav: true,
        dots: false,
        autoplay: true,
        loop: true,
    })

    let productPreviewSlider = $('section.catalog__section .images__wrapper');
    let productImagesSlider = $('section.catalog__section .images__slider');

    productPreviewSlider.owlCarousel({
        items: 1,
        nav: false,
        dots: false,

    }).on('changed.owl.carousel', syncPosition);

    productImagesSlider.on('initialized.owl.carousel', function() {
        productImagesSlider.find(".owl-item").eq(0).addClass("current");
    }).owlCarousel({
        items: 4,
        nav: false,
        dots: false,
    }).on('changed.owl.carousel', syncPosition2);

    function syncPosition(el) {
        var count = el.item.count - 1;
        var current = Math.round(el.item.index - (el.item.count / 2) - .5);

        if (current < 0) {
            current = count;
        }
        if (current > count) {
            current = 0;
        }

        productImagesSlider
            .find(".owl-item")
            .removeClass("current")
            .eq(current)
            .addClass("current");
        var onscreen = productImagesSlider.find('.owl-item.active').length - 1;
        var start = productImagesSlider.find('.owl-item.active').first().index();
        var end = productImagesSlider.find('.owl-item.active').last().index();

        if (current > end) {
            productImagesSlider.data('owl.carousel').to(current, 100, true);
        }
        if (current < start) {
            productImagesSlider.data('owl.carousel').to(current - onscreen, 100, true);
        }
    }

    function syncPosition2(el) {
        if (syncedSecondary) {
            var number = el.item.index;
            productPreviewSlider.data('owl.carousel').to(number, 100, true);
        }
    }

    productImagesSlider.on("click", ".owl-item", function(e) {
        e.preventDefault();
        var number = $(this).index();
        productPreviewSlider.data('owl.carousel').to(number, 300, true);
    });

}

function SetTabSwitcher()
{
    $('.btn__tab__switch').on('click', function(e) {
        e.preventDefault();
        if ($(this).hasClass('active'))
        {
            return;
        }

        $('.btn__tab__switch').removeClass('active');
        $(this).addClass('active');

        let targetTab = $(this).attr('target');

        SwitchTab(targetTab)
    })
}

function SwitchTab(target)
{
    
    $('.tab.active').animate({
        opacity: 0
    }, 500, function() {
        $('.tab.active').removeClass('active');

        $(`[tab-name="${target}"]`).css('opacity', 0);
        $(`[tab-name="${target}"]`).addClass('active');
        
        let tabHeight = $(`[tab-name="${target}"]`)[0].clientHeight;
        $(`[tab-name="${target}"]`).closest('.tab__viewer').css('height', `${tabHeight}px`)

        $(`[tab-name="${target}"]`).animate({
            opacity: 1
        }, 500)
    })
}

function SetModal()
{
    $('[modal]').on('click', function()
    {
        let modalId = $(this).attr('modal');
        ShowModal(`#${modalId}`);
    });

    $('.modal__dialog').on('click', function(e) {
        e.stopPropagation();
    });

    $('.modal').on('click', function() {
        HideModal(`#${$(this).attr('id')}`);
    });

    $('.btn__modal__close').on('click', function ()
    {
        let modalId = $(this).closest('.modal').attr('id');
        HideModal(`#${modalId}`);
    });
}

function ShowModal(modalId)
{
    $(modalId + ' .modal__dialog').off('animationend');
    $(modalId).addClass('active');
    $('body').addClass('lock');
    $(modalId + ' .modal__dialog').addClass('fadeInDownBig')
    
    $('body').append('<div class="modal__backdrop"></div>');
    setTimeout(function() {
        $('.modal__backdrop').addClass('active');
    }, 50)
}

function HideModal(modalId)
{
    $(modalId + ' .modal__dialog').removeClass('fadeInDownBig');
    $(modalId + ' .modal__dialog').addClass('fadeOutDownBig');
    $('.modal__backdrop').removeClass('active');
    $('body').removeClass('lock');
    $(modalId + ' .modal__dialog').on('animationend', function() {
        if (!$(modalId).hasClass('active'))
        {
            return;
        }
        $(modalId).removeClass('active');
        $(modalId + ' .modal__dialog').removeClass('fadeOutDownBig');
        $('.modal__backdrop').remove();
    });
}

function SetCatalogMenu()
{
    $('.catalog .item').on('click', function(e) {
        e.stopPropagation();

        $(this).parent().find('.sub__menu.active').removeClass('active')

        let subMenu = $(this).find('.sub__menu')[0];

        if ($(subMenu).hasClass('active'))
        {
            $(subMenu).removeClass('active');
        }
        else
        {
            $(subMenu).addClass('active');
        }
    })

    let activeMenu = $('.catalog .item.active').find('.sub__menu')[0]

    $(activeMenu).addClass('active')
    $('.catalog .item.active').parents('.sub__menu').addClass('active')
}

function InitNoUiSlider()
{
    if (document.getElementById('nouislider') == null)
    {
        return;
    }

    let filterSettigns = JSON.parse(document.getElementById('filterSettigns').textContent);
    console.log(filterSettigns.priceTo);
    let htmlSlider = document.getElementById('nouislider');

    noUiSlider.create(htmlSlider, {
        start: [filterSettigns.priceFrom, filterSettigns.priceTo],
        connect: true,
        range: {
            'min': filterSettigns.priceFrom,
            'max': filterSettigns.priceTo
        }
    });

    let inputTo = document.querySelector('input[name="filter-to"]');
    let inputFrom = document.querySelector('input[name="filter-from"]');

    htmlSlider.noUiSlider.on('update', function (values, handle) {
        var value = values[handle];
    
        if (handle) {
            inputTo.value = parseInt(value);
        } else {
            inputFrom.value = parseInt(value);
        }
    });

    inputTo.addEventListener('change', function () {
        htmlSlider.noUiSlider.set([null, parseInt(this.value)]);
    });

    inputFrom.addEventListener('change', function () {
        htmlSlider.noUiSlider.set([parseInt(this.value), null]);
    });
}

function InitSimpleLightbox()
{
    $('.product__info a.preview').simpleLightbox();
}

