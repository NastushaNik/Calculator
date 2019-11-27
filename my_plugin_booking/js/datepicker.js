//get data and set date meeting room
jQuery(document).on('wc_booking_form_changed', function() {
	if (jQuery("#product-130 input[name='wc_bookings_field_start_date_month']").val() == '') {
		return;
	}
	var bookingDates = {}
	jQuery.each(['month', 'year', 'day'], function (key, val) {
		bookingDates['start_' + val] = jQuery("#product-130 input[name='wc_bookings_field_start_date_" + val + "']").val();
	});
	Date.daysBetween = function( date1 ) {
			var one_day=1000*60*60*24;
			var date1_ms = date1.getTime();
	}
	var startDate = new Date(bookingDates.start_year, parseInt(bookingDates.start_month)-1, bookingDates.start_day);

	jQuery('.birthday_cake').after('<input type="hidden" id="choosen-date" value="'+startDate+'">');
	jQuery('.open-popup-link').on('click', function () {
		jQuery('#wpb_wl_quick_view_1907 .hasDatepicker').datepicker({ dateFormat: 'yy-mm-dd'}).datepicker("setDate", startDate);
		jQuery('#wpb_wl_quick_view_1907 .wc-bookings-date-picker.wc_bookings_field_start_date').css('display', 'none');
		jQuery('#wpb_wl_quick_view_1907 .ui-datepicker-current-day').click();

	});

});