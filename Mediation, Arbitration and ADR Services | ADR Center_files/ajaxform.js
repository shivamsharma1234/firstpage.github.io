/*
 * This file is part of the CloserPhp package.
 * For the full copyright and license information, please view the LICENSE.php
 * file that was distributed with this source code.
 * Info:andread.dev@gmail.com
 */

(function ($)
{
    $.fn.ajaxform = function (globaloptions)
    {

        var defaults = {
            url: null,
            dataType: 'json',
            class: null,
            managed: false,
            redirectWait: 0,
            beforeSend: function (form) {
                return true;
            },
            complete: function (form) {
            },
            success: function (response, form) {
                return true;
            },
            showError: function (errorDes, form, xhr) {
                alert(errorDes);
            },
            debug: false
        };

        return this.each(function () {

            //INIT
            var options = $.extend(defaults, globaloptions);
            var disabledElement = "button,input[type='submit'],input[type='file']";
            var form = this;
            var inRedirectWait = false;


            if (options.url == null) {
                options.url = $(form).attr('action');
            }

            if (options.dataType != "json" && options.managed == true) {
                options.managed = false;
                log("Managed mode is disabled for no json request");
            }

            $(form).submit(function (e) {

                e.preventDefault();
                if (inRedirectWait) {
                    return false;
                }

                var data = (options.cls == null) ? $(form).serialize() : $(form).find("." + options.cls);

                $.ajax({
                    type: "POST",
                    url: options.url,
                    cache: false,
                    data: data,
                    dataType: options.dataType,
                    beforeSend: function (xhr, opts) {
                        if (!options.beforeSend(form)) {
                            xhr.abort();
                            return;
                        }
                        prepareSend();
                    },
                    complete: function () {
                        prepareComplete();
                        options.complete(form);
                    },
                    success: function (response) {// Handle data                        
                        if (options.managed) {
                            managedResponse(response, form);
                        } else if (options.success(response, form)) {
                            clearForm();
                        }
                    },
                    error: function (xhr, status, errorThrown) {
                        prepareComplete();

                        var errorDes = "Error " + errorThrown + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText;
                        log(errorDes);

                        if (!options.debug) {
                            errorDes = "The application has encountered an unexpected error.";
                        }

                        options.showError(errorDes, form, xhr);
                    }
                });

                return false;
            });

            function log(msg) {
                if (options.debug && typeof (console) !== "undefined"
                        && typeof (console.log) !== "undefined") {
                    console.log("ajaxform: " + msg);
                }
            }

            function prepareSend() {
                $(form).find(disabledElement).prop('disabled', true);

                if ($(".ajax-loader", form).length) {
                    $(".ajax-loader", form).show();
                }

                if ($(".ajax-response", form).length) {
                    $(".ajax-response", form).hide().removeClass("error");
                }

                if ($(".cp-afe-msg", form).length) {
                    $(".cp-afe-msg", form).hide();
                }
            }

            function prepareComplete() {
                $(form).find(disabledElement).prop('disabled', false);

                if ($(".ajax-loader", form).length) {
                    $(".ajax-loader", form).hide();
                }
            }

            function clearForm() {
                if (options.class == null) {
                    $(form)[0].reset();//all ok
                } else {
                    var css_class = "." + options.class;

                    $("input" + css_class, form).each(function () {
                        var type = this.attr("type");
                        if (type != "button" && type != "checkbox" && type != "radio" && type != "submit") {
                            this.value = this.defaultValue;
                        }
                    });

                    $("textarea" + css_class, form).each(function () {
                        this.value = this.defaultValue;
                    });

                    $("select" + css_class, form).each(function () {
                        $(this).find('option').each(function (i, opt) {
                            opt.selected = opt.defaultSelected;
                        });
                    });

                    $("input:checkbox" + css_class + "," + "input:radio" + css_class, form).each(function () {
                        this.checked = this.defaultChecked;
                    });
                }
            }

            function managedResponse(response, form) {

                if (!response.hasOwnProperty('error')) {
                    var errorDes = "Bad json[error] response on Managed mode";
                    log(errorDes);
                    options.showError(errorDes, form, null);
                    return false;
                }

                options.success(response, form);
                if (!response.error) {
                    //clearForm();
                }

                if (response.hasOwnProperty('msg') && response.msg != "" && $(".ajax-response", form).length) {
                    if (response.error) {
                        $(".ajax-response", form).addClass("error");
                    }
                    $(".ajax-response", form).html(response.msg).fadeIn();
                }

                if (response.hasOwnProperty('errorFields')) {
                    $.each(response.errorFields, function (k, v) {
                        var clsErrorField = ".cp-ie-" + k;
                        if ($(clsErrorField, form).length) {
                            $(clsErrorField, form).html(v).fadeIn();
                        } else {
                            log("Error field " + k + " not found");
                        }
                    });
                }

                if (response.hasOwnProperty('gotoUrl') && response.gotoUrl) {
                    inRedirectWait = true;
                    setTimeout(function () {
                        $(location).attr('href', response.gotoUrl);
                    }, options.redirectSleep);
                }

            }

            return true;
        });
    };

})(jQuery);