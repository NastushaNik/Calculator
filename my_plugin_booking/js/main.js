jQuery(document).ready(function() {

    const { __, _x, _n, _nx } = wp.i18n;

    jQuery('#duration').on('change', recalcSum);    
    jQuery('#select').on('change', recalcSum);  
    jQuery('input#private').on('input', recalcSum);    

    function recalcSum() {
        var duration = '';
        var duration_select = jQuery('#duration option:selected').each(function(){
            duration += jQuery(this).val();
        });
        var duration_num = duration / 60;
        var qty = jQuery("#qty").val();
        var price = jQuery("#price").val();
        var cost = jQuery("#cost").val();
        var persons = '';
        var selected = jQuery('#select option:selected').each(function(){
            persons += jQuery(this).val();
        });
        var person_num = parseInt(persons, 10);
        var qty_num = parseInt(qty, 10);

        if (duration_num !== "" && person_num !== "" && person_num !== 0 && !isNaN(person_num) && duration_num !== 0) {
            if (person_num >= 4) {
                total = duration_num * person_num * (price * 2);
                jQuery('p.warning').html(''+langbook.you_are+' '+duration_num + ' '+langbook.hour_for+' ' + person_num + ' '+langbook.cost_will+' &#8364;'+total+'.<br> <a href="#" title="Edit" class="btn btn-primary edit-btn-home no-js-color" target="_blank">'+langbook.edit+'</a>');
                jQuery('#select').slideUp();
                jQuery('#duration').slideUp();
                
            } else {
                total = duration_num * person_num * (cost * 2);
                jQuery('p.warning').html(''+langbook.you_are+' '+duration_num + ' '+langbook.hour_for+' ' + person_num + ' '+langbook.cost_will+' &#8364;'+total+'. <br><a href="#" title="Edit" class="btn btn-primary edit-btn-home no-js-color" target="_blank">'+langbook.edit+'</a>');
                jQuery('#select').slideUp();
                jQuery('#duration').slideUp();
            }
            
        }

        if (person_num > qty_num) {
            var hours = Math.ceil(person_num / qty_num);
            var station = Math.ceil(person_num / hours);
            var hour_disp = duration_num * hours;
            total = hour_disp * station * (price * 2);
            jQuery('p.warning').html(''+langbook.you_are+' '+duration_num + ' '+langbook.hour_for+' ' + person_num + ' '+langbook.will_reserve+' ' + station + ' '+langbook.machines_for+' ' + hour_disp + ' '+langbook.total_cost+' &#8364;'+total+'.<br> <a href="#" title="Edit" class="btn btn-primary edit-btn-home no-js-color" target="_blank">'+langbook.edit+'</a>');
            jQuery("#select option[value= " + person_num + "]").prop("selected", true); 
        }

        jQuery('.edit-btn-home').on('click', function(e){
            e.preventDefault();
            jQuery('#select').slideDown();
            jQuery('#duration').slideDown();
        });

    }  

    function GetURLParameter(sParam){
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++){
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam){
             return sParameterName[1];
            }
        }
    }

    var persons = GetURLParameter('pers');
    var duration = GetURLParameter('dur');
    var qty = GetURLParameter('qty');
    var qty_num = parseInt(qty, 10);
    var duration_num = duration * 2;
    var person_num = parseInt(persons, 10);
    var hours = Math.ceil(person_num / qty_num);
    var station = Math.ceil(person_num / hours);

    jQuery("input#private_event").on('click', function() {
        jQuery(this).toggleClass("private");
        if(jQuery("input#private_event").hasClass('private')){
            person_num = qty_num;
            jQuery('.privat-text').slideDown();
            jQuery('#wc_bookings_field_persons').val(person_num);
        }else{
            jQuery('.privat-text').slideUp();
            jQuery('#wc_bookings_field_persons').val(station);
        }
    });

    if(person_num > qty_num){
        jQuery('#wc_bookings_field_persons').val(station);
        jQuery('#wc_bookings_field_duration').val(hours * 2);
        jQuery('#product-130').find('.wc_bookings_field_duration').before('<h4 id="reward" class="">'+langbook.you_are+' '+duration + ' '+langbook.hour_for+' ' + person_num + ' '+langbook.will_reserve+' ' + station + ' '+langbook.machines_for+' ' + hours + ' '+langbook.hours+'.</h4>');
        jQuery('#product-130').find('.wc_bookings_field_persons').after('<a href="#" title="Edit" class="btn btn-primary edit-btn-product no-js-color" target="_blank">'+langbook.edit+'</a>');
    }else{
        jQuery('#wc_bookings_field_persons').val(person_num);
        jQuery('#wc_bookings_field_duration').val(duration_num);
        jQuery('#product-130').find('.wc_bookings_field_duration').before('<h4 id="reward" class="">'+langbook.you_are+' '+person_num + ' '+langbook.person_duration+' ' + duration + ' '+langbook.hours+'.</h4>');
        jQuery('#product-130').find('.wc_bookings_field_persons').after('<a href="#" title="Edit" class="btn btn-primary edit-btn-product no-js-color" target="_blank">'+langbook.edit+'</a>');
    }
    
    jQuery('.birthday_cake').append('<a href="#" class="open_modal_birthday_cake disabled">' + langbook.order_bc + '</a><span style="display: none;" class="data-price_cakes"></span>');
    jQuery('.drinks').append('<a href="#" class="open_modal_drinks disabled">' + langbook.order_drink + '</a><span style="display: none;" class="data-price_drinks"></span>');
    jQuery('#drinks option').each(function(){
        if (jQuery(this).val() == 1 + ' per') {
            var price_data = jQuery(this).data('price');
            jQuery('.data-price_drinks').text(price_data);
        }
    });

    jQuery('#birthday_cake option').each(function(){
        if (jQuery(this).val() == 1 + ' per') {
            var price_data = jQuery(this).data('price');
            jQuery('.data-price_cakes').text(price_data);
        }
    });

    jQuery('.edit-btn-product').on('click', function(e){
        e.preventDefault();
        jQuery('.wc_bookings_field_persons').slideDown();
        jQuery('.wc_bookings_field_duration').slideDown();
    });

    jQuery('.single_add_to_cart_button').on('click', function () {
        jQuery('.mfp-close').trigger('click');
    })

    function change_book_now_button(){
        setTimeout(function () {
            if (jQuery('.entry-summary .wc-bookings-booking-cost .woocommerce-Price-amount').length) {
                var selected_cake = jQuery('#birthday_cake option:selected').data('price');
                var reserv_price = jQuery('.entry-summary .wc-bookings-booking-cost .woocommerce-Price-amount').text();
                //console.log(reserv_price);
                var reserv_price = parseInt(/[0-9]+/.exec(reserv_price));
                var reserv_total = '<span class="reserv-total">'+langbook.in_total+'</span>';
                var summa = '<span class="summa">(&#8364;'+reserv_price+',00)</span>';
                    setTimeout(function(){
                        if (jQuery('span').is('.reserv-total')) {
                            jQuery('span.reserv-total').remove();
                        }
                        jQuery('#primary .entry-summary button.wc-bookings-booking-form-button').prepend(reserv_total);
                        
                        if (jQuery('span').is('.summa')) {
                            var drink_data = jQuery('#drinks option:selected').data('price');
                            var cake_data = jQuery('#birthday_cake option:selected').data('price');
                            var sum = reserv_price + cake_data + drink_data;
                            jQuery('.summa').html(' (&#8364;' + sum +',00)');
                        } else {
                            jQuery('.reserv-total').after('<span class="summa">(&#8364;'+reserv_price+',00)</span><br>');
                        }
                        
                    }, 1000);
                }else{
                jQuery('#primary .entry-summary button.wc-bookings-booking-form-button').not('.disabled').html(''+langbook.book_now+'')

            }
        }, 1500);  
    }

    jQuery('#wc-bookings-booking-form input[type="number"]').on('input', function(){
        var persons_edit = jQuery("#wc_bookings_field_persons").val();
        var duration_edit = jQuery("#wc_bookings_field_duration").val();
        jQuery("#reward").text(''+langbook.you_are+'' + persons_edit + ' '+langbook.person_duration+' ' + duration_edit / 2 + ''+langbook.hours+'.');
        jQuery(".privat-text").text(''+langbook.private_event+' ' + duration_edit / 2 + ' '+langbook.hours+'.');
        change_book_now_button();
    });

    jQuery('.wpb_wl_preview_area').find('.open-popup-link').addClass('disabled').removeClass('wpb_wl_preview');

    

    jQuery('#product-130 .block-picker').on('click', 'a', function(){
        if(jQuery(this).not('.not_bookable')) {
            setTimeout(function(){
                jQuery('.wpb_wl_preview_area').find('.open-popup-link').removeClass('disabled').addClass('wpb_wl_preview');
                jQuery('.ppom-field-wrapper.birthday_cake a').removeClass('disabled');
                jQuery('.ppom-field-wrapper.drinks a').removeClass('disabled');
                jQuery('.block-meeting').slideUp();
            }, 1000);
        }
        change_book_now_button();
        
    });
    jQuery('.open-popup-link').on('click', function () {
        var start_date = jQuery('#choosen-date').val();
        jQuery('#wpb_wl_quick_view_1907 .hasDatepicker').datepicker({ dateFormat: 'yy-mm-dd'}).datepicker("setDate", start_date);
           
    })

    jQuery('.birthday_cake').after(jQuery('.wpb_wl_preview_area'));
    jQuery('.wpb_wl_preview_area .disabled').after('<br><span class="block-meeting">'+langbook.choose_mr+'</span>');
    jQuery('#product-130 .wc-bookings-date-picker').before('<h3 class="product_title entry-title">'+langbook.call_us+'</h3>');
    jQuery('.ppom-field-wrapper.private_event').find('.ppom-label-checkbox').text(langbook.privevent)
    jQuery('#product-130 .wc-bookings-date-picker').before(jQuery('.ppom-field-wrapper.private_event'));
    jQuery('#product-130 .wc-bookings-date-picker').before('<div class="clearfix"></div>');
    jQuery('.ppom-field-wrapper.private_event').after('<h5 class="privat-text">'+langbook.private_event+' ' + hours + ' '+langbook.hours+'.</h5>');

    jQuery('.product').magnificPopup({
            type:'inline',
            midClick: true,
            gallery:{
                enabled:true
            },
            delegate: 'span.wpb_wl_preview',
            removalDelay: 500, //delay removal by X to allow out-animation
            callbacks: {
                beforeOpen: function() {
                   this.st.mainClass = this.st.el.attr('data-effect');
                }
            },
            closeOnContentClick: false,
        });

        /**
         * product image lightbox
         */

    jQuery("[data-fancybox]").fancybox();

    jQuery('.open_modal_birthday_cake').on('click', function(event){
        event.preventDefault();
        jQuery('#modal-cake').removeClass('fade').fadeIn();
        jQuery('h2.wpb_wl_product_title').text(langbook.bcm);
        var price = jQuery('.data-price_cakes').text();
        jQuery('p.form-field.modal-per-cake').html('<label for="wc_bookings_field_duration">'+langbook.pers+'</label><input type="number" value="0" step="1" min="0" max="50" id="cakes_person_modal">'+langbook.perss+'');
        jQuery('.modal-submin-button-cake').text(langbook.change);
        var cakes_person_modal = jQuery('#cakes_person_modal').val();
        if (cakes_person_modal > 0) {
            jQuery('.modal-cost').html(''+langbook.cost+' &#8364;' + price+'');
            var price = price / cakes_person_modal;
        }else{
            jQuery('.modal-cost').html(''+langbook.cost+' &#8364;0');
        }
        
        jQuery('#cakes_person_modal').on('input', function(){
            var modal_per_cake = jQuery('#cakes_person_modal').val();
            var cost_change = price * modal_per_cake;
            jQuery('.modal-cost').html(''+langbook.cost+' &#8364;' + cost_change+'');
        });
        jQuery('.modal-submin-button-cake').on('click', function() {
            var modal_per_cake = jQuery('#cakes_person_modal').val();
            var cost_change = price * modal_per_cake;
            jQuery('#cakes_person_modal').val();
            jQuery('#birthday_cake option').each(function(){
                jQuery('.ppom-input-birthday_cake').addClass('is-focused');
                jQuery('#birthday_cake').trigger('change');
                if (jQuery(this).val() == modal_per_cake + ' per') {
                    jQuery(this).prop('selected', true);
                    var price_data = jQuery(this).data('price');
                    jQuery('.data-price_cakes').text(price_data);
                    if (jQuery(this).val() !== 0 + ' per') {
                        jQuery('.open_modal_birthday_cake').text(''+langbook.bc_ordered+'');
                        var cake_total = '<span class="cake-total"> '+langbook.bc+'</span>';
                        setTimeout(function(){
                            if (jQuery('span').is('.cake-total')) {
                                jQuery('span.cake-total').remove();
                                jQuery('.summa').before(cake_total);
                            } else {
                                jQuery('.summa').before(cake_total);
                            }
                            if (jQuery('span').is('.summa')) {
                                // var summa = jQuery('.summa').text()
                                // var summa = parseInt(/[0-9]+/.exec(summa));
                                var reserv_price = jQuery('.entry-summary .wc-bookings-booking-cost .woocommerce-Price-amount').text();
                                var reserv_price = parseInt(/[0-9]+/.exec(reserv_price));
                                var drink_data = jQuery('#drinks option:selected').data('price');
                                var summa = reserv_price + drink_data + price_data;
                                jQuery('.summa').html(' (&#8364;' + summa +',00)');
                                console.log(summa);
                            } else {
                                var summa = '<span class="summa">(&#8364;'+price_data+',00)</span>';
                                jQuery(summa).before(cake_total);
                            }
                        }, 1000);
                    }else{
                        if (jQuery('span').is('.summa')) {
                            var reserv_price = jQuery('.entry-summary .wc-bookings-booking-cost .woocommerce-Price-amount').text();
                            var reserv_price = parseInt(/[0-9]+/.exec(reserv_price));
                            var drink_data = jQuery('#drinks option:selected').data('price');
                            var summa = reserv_price + drink_data;
                            jQuery('.summa').html(' (&#8364;' + summa +',00)');
                        }else {
                            var summa = '<span class="summa">(&#8364;'+price_data+',00)</span>';
                            jQuery(summa).before(cake_total);
                        }
                        jQuery('span.cake-total').remove();
                        jQuery('.open_modal_birthday_cake').text(''+langbook.order_bc+'');
                    }
                }

            });
        });
    });
    jQuery('.close-custom').click(function(){
        jQuery('#modal-cake').addClass('fade').fadeOut();
    });


    jQuery('.open_modal_drinks').on('click', function(event){
        event.preventDefault();
        jQuery('#modal-drink').removeClass('fade').fadeIn();
        var price = jQuery('.data-price_drinks').text();
        jQuery('h2.wpb_wl_product_title').text(langbook.dm);
        jQuery('p.form-field.modal-per-drink').html('<label for="wc_bookings_field_duration">'+langbook.pers+'</label><input type="number" value="0" step="1" min="0" max="50" id="drinks_person_modal">'+langbook.perss+'');
        jQuery('.modal-submin-button-drink').text(langbook.change);
        var drinks_person_modal = jQuery('#drinks_person_modal').val();
        if (drinks_person_modal > 0) {
            jQuery('.modal-cost').html(''+langbook.cost+' &#8364;' + price);
            var price = price / drinks_person_modal;
        }else{
            jQuery('.modal-cost').html(''+langbook.cost+' &#8364;0');
        }
        jQuery('#drinks_person_modal').on('input', function(){
            var modal_per_drink = jQuery('#drinks_person_modal').val();
            var cost_change = price * modal_per_drink;
            jQuery('.modal-cost').html(''+langbook.cost+' &#8364;' + cost_change);
        });
        jQuery('.modal-submin-button-drink').on('click', function() {
            var modal_per_drink = jQuery('#drinks_person_modal').val();
            var cost_change = price * modal_per_drink;
            jQuery('#drinks option').each(function(){
                jQuery('.ppom-input-drinks').addClass('is-focused');
                jQuery('#drinks').trigger('change');
                if (jQuery(this).val() == modal_per_drink + ' per') {
                    jQuery(this).prop('selected', true);
                    var price_data = jQuery(this).data('price');
                    jQuery('.data-price_drinks').text(price_data);
                    if (jQuery(this).val() !== 0 + ' per') {
                        jQuery('.open_modal_drinks').text(langbook.drinks_ordered);
                        var drink_total = '<span class="drink-total">'+langbook.d+'</span>';
                        setTimeout(function(){
                            if (jQuery('span').is('.drink-total')) {
                                jQuery('span.drink-total').remove();
                                jQuery('.summa').before(drink_total);
                            } else {
                                jQuery('.summa').before(drink_total);
                            }
                            if (jQuery('span').is('.summa')) {
                                var reserv_price = jQuery('.entry-summary .wc-bookings-booking-cost .woocommerce-Price-amount').text();
                                var reserv_price = parseInt(/[0-9]+/.exec(reserv_price));
                                var cake_data = jQuery('#birthday_cake option:selected').data('price');
                                var summa = reserv_price + cake_data + price_data;
                                jQuery('.summa').html(' (&#8364;' + summa +',00)');
                                console.log(summa);
                            } else {
                                var summa = '<span class="summa">(&#8364;'+price_data+',00)</span>';
                                jQuery(summa).before(drink_total);
                            }
                        }, 1000);
                    }else{
                        if (jQuery('span').is('.summa')) {
                            var reserv_price = jQuery('.entry-summary .wc-bookings-booking-cost .woocommerce-Price-amount').text();
                            var reserv_price = parseInt(/[0-9]+/.exec(reserv_price));
                            var cake_data = jQuery('#birthday_cake option:selected').data('price');
                            var summa = reserv_price + cake_data;
                            jQuery('.summa').html(' (&#8364;' + summa +',00)');
                            console.log(summa);
                        }else {
                            var summa = '<span class="summa">(&#8364;'+price_data+',00)</span>';
                            jQuery(summa).before(drink_total);
                        }
                        jQuery('span.drink-total').remove();
                        jQuery('.open_modal_drinks').text(langbook.order_drink);
                    }
                }
            });

        })
    });
    jQuery('.close-custom').click(function(){
        jQuery('#modal-drink').addClass('fade').fadeOut();
    });

    jQuery('.woocommerce-cart-form__cart-item').find('dt.variation-Drinks').text(langbook.dm +':');
    jQuery('.woocommerce-cart-form__cart-item').find('dt.variation-Birthdaycake').text(langbook.bcm +':');

});



    
