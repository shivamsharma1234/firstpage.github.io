(function ($) {


    //------UTILITY---------------------------------------

    function pop_setCookie(cname, cvalue, exdays) {
        exdays = typeof exdays !== 'undefined' ? exdays : 365;
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
    }

    function pop_getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1);
            if (c.indexOf(name) == 0)
                return c.substring(name.length, c.length);
        }
        return null;
    }



    $(document).ready(function () {


        if ($(window).width() < 648) {
            pop_setCookie("pop_colose", 1, 30);
            return;
        }

        setTimeout(function () {
            $.magnificPopup.open({
                type: 'inline',
                preloader: false,
                removalDelay: 300,
                focus: '#differens-popup',
                items: {
                    src: '#differens-popup'
                },
                callbacks: {
                    close: function () {
                        pop_setCookie("pop_colose", 1, 30);
                    },
                    beforeOpen: function () {

                    }
                },
                mainClass: 'mfp-fade'

            });
        }, 10000);


        $(".pop-form").ajaxform({
            managed: true,
            url: $(".pop-form").attr("data-acturl") + "register.php",
            redirectSleep: 0,
            beforeSend: function () {
                return true;
            },
            success: function (response, form) {
                if (!response.error) {
                    setTimeout(function () {
                        $.magnificPopup.close();
                    }, 5000);
                    pop_setCookie("pop_colose", 1, 360);

                    try {
                        ga('send', 'event', 'pop_form_contact', 'submit');
                    } catch (err) {
                    }

                }
                return true;
            }
        });

    });


})(jQuery);