(function ($) {


    //--- Equal height columns
    function col_equal_height(row_class, target_class, use_minheight) {

        $(row_class).each(function () {
            var childs = $(this).children("div");
            var first_child = $(childs).first();
            var childs_target = (target_class !== undefined && target_class != false) ? $(this).find(target_class) : childs;
            use_minheight = (use_minheight !== undefined) ? use_minheight : false;

            if (!use_minheight) {
                $(childs_target).css('height', 'auto');
            } else {
                $(childs_target).css('min-height', '0px');
            }


            if ($(first_child).css('float') != "left" && $(first_child).css('float') != "right") {
                return;
            }

            var maxh = 0;
            $(childs_target).each(function () {
                if ($(this).outerHeight() > maxh) {
                    maxh = $(this).outerHeight();
                }
            });

            if (maxh > 0) {

                if (!use_minheight) {
                    $(childs_target).css('height', maxh + "px");
                } else {
                    $(childs_target).css('min-height', maxh + "px");
                }
            }
        });

    }




    $(document).ready(function () {

        //--- Grup site ---     
        var gwidth = 0;
        $('body').on('wsmart_resize', function () {
            $('#grupsite').width($("#header").width());

            col_equal_height('.home-colums-container2 .section_inner_margin', false, true);
        });


        $('#grup-selector').click(function () {
            if ($('#grupsite').hasClass("visible")) {
                $('#grupsite').removeClass("visible");
            } else {
                $('#grupsite').addClass("visible");
            }
        });

        //Search menu
        $('#main-search').click(function () {

            if ($('#main-search-content').hasClass("visible")) {
                $('#main-search-content').removeClass("visible");
            } else {
                $('#main-search-content').addClass("visible");
            }
        });


        /*Sidebar fix
         $('body').on('wsmart_resize', function () {
         if ($("#sidebox").length && $("#maincontent").length && $(window).width() > 800) {
         if ($("#sidebox").outerHeight() < $("#maincontent").outerHeight()) {
         $("#sidebox").css({"min-height": $("#maincontent").outerHeight()});
         return;
         }
         } else {
         $("#sidebox").css({"min-height": "0px"});
         }
         
         
         });*/


        /* TinyNav.js 1
         $('#menu-main-menu').tinyNav({
         active: 'current',
         header: 'Navigate to...',
         indent: '-> '
         });
         */


        // Smooth Scrolling
        $('a.smooth-scrolling').click(function () {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').stop().animate({
                    scrollTop: target.offset().top - $(".header-main").height()
                }, 800);
                return false;
            }
        });


        $('.trigger-goal').click(function () {


            if ($(this).hasClass("trg-cte-telefono")) {
                ga('send', 'event', 'Cta Telefono', 'click');
            }

            if ($(this).hasClass("trg-cte-email")) {
                ga('send', 'event', 'Cta Email', 'click');
            }

            if ($(this).hasClass("trg-cte-academy")) {
                ga('send', 'event', 'Cta Academy', 'click');
            }

            if ($(this).hasClass("trg-cte-international")) {
                ga('send', 'event', 'Cta International', 'click');
            }

            if ($(this).hasClass("trg-cte-adritalia")) {
                ga('send', 'event', 'Cta AdrItalia', 'click');
            }

            if ($(this).hasClass("trg-cte-greece")) {
                ga('send', 'event', 'Cta Greece', 'click');
            }

        });


        //table wrap responsive
        //$('#maincontent table').wrap('<div class="rsptable" />');


    });



    //---Smart resize tigger---
    $(document).ready(function () {
        var resize_timer;
        $(window).resize(function () {
            clearTimeout(resize_timer);
            resize_timer = setTimeout(function () {
                $('body').trigger('wsmart_resize');
            }, 80);
        });


        $(window).load(function () {
            $('body').trigger('wsmart_resize');
        });
        $('body').trigger('wsmart_resize');
    });


})(jQuery);