<?php 
/*
 Plugin Name: Booking
 Description: Description
 Version: 9.0
 Author: Author
 Author URI: Author
 Text Domain: booking
 Domain Path: /languages/
*/

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly 

function wpb_wl_textdomain() {
	load_plugin_textdomain( 'booking', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
}
add_action( 'init', 'wpb_wl_textdomain' );

//js/css
function add_jq_files(){
	$fp = plugin_dir_path( __FILE__ ) . "js/datepicker.js";
    wp_enqueue_script('jquery-min', plugins_url('js/jquery-3.3.1.js', __FILE__ ) );
    wp_enqueue_script('jquery-date', plugins_url('js/datepicker.js', __FILE__ ), array( 'jquery', 'wc-bookings-date-picker' ), wbsd_filemtime( $fp ) );
    wp_enqueue_script('jquery-main', plugins_url('js/main.js', __FILE__ ), array( 'wp-i18n' ));
    wp_enqueue_style('my-style', plugins_url('css/my-style.css', __FILE__ ) );
    wp_enqueue_style( 'wpb-wl-fancybox', plugins_url( 'css/jquery.fancybox.min.css', __FILE__) );
	wp_enqueue_style('wpb-wl-magnific-popup', plugins_url('css/magnific-popup.css', __FILE__),'','1.0');

	wp_enqueue_script( 'wpb-wl-fancybox', plugins_url( 'js/jquery.fancybox.min.js', __FILE__ ), array( 'jquery' ), '3.1.6', true );
	wp_enqueue_script('wpb-wl-magnific-popup', plugins_url('js/jquery.magnific-popup.min.js', __FILE__),array('jquery'),'1.0', false);

	if ( function_exists('wp_set_script_translations') ) {
	  	wp_set_script_translations( 'jquery-main', 'booking' );
	 }	

	 wp_localize_script( 'jquery-main', 'langbook',
        array(
        	'edit' => __( 'Edit', 'booking' ),
        	'you_are' => __( 'You are reserving', 'booking' ),
        	'hour_for' => __( 'hour for', 'booking' ),
        	'cost_will' => __( 'people, total cost will be', 'booking' ),
        	'will_reserve' => __( 'people so we will reserve', 'booking' ),
        	'machines_for' => __( 'machines for', 'booking' ),
        	'total_cost' => __( 'hours , total cost will be', 'booking' ),
            'order_bc' => __( 'Order birthday cake', 'booking' ),
            'order_drink' => __( 'Order drinks', 'booking' ),
            'in_total' => __( 'In total: Reservation', 'booking' ),
            'book_now' => __( 'Book now', 'booking' ),
            'private_event' => __( 'You selected private event so we reserve all machines for', 'booking' ),
            'hours' => __( 'hours', 'booking' ),
            'choose_mr' => __( 'Choose a date above to book a meeting room.', 'booking' ),
            'call_us' => __( 'Want to play right now? Call US', 'booking' ),
            'cost' => __( 'Cost:', 'booking' ),
            'bc_ordered' => __( 'Birthday cake ordered', 'booking' ),
            'bc' => __( ' + Birthday Cake', 'booking' ),
            'd' => __( ' + Drinks', 'booking' ),
            'bcm' => __( 'Birthday Cake', 'booking' ),
            'dm' => __( 'Drinks', 'booking' ),
            'person_duration' => __( 'person duration', 'booking' ),
            'pers' => __( 'Person', 'booking' ),
            'perss' => __( 'Person(s)', 'booking' ),
            'change' => __( 'Change', 'booking' ),
            'privevent' => __( 'Private Event', 'booking' ),
            'drinks_ordered' => __( 'Drinks ordered', 'booking' ),
        ) 
    );
	
}
add_action('wp_enqueue_scripts', 'add_jq_files'); 

require_once dirname( __FILE__ ) . '/inc/wpb_wl_hooks.php';

// обработка формы, переход на страницу товара
function create_post_func(){
	$duration = $_POST['duration'];
	$duration_num = $duration / 60;
	$persons = $_POST['persons'];
	$qty = $_POST['qty'];
	$prod_id = $_POST['permalink'];
	$product_link = get_permalink($prod_id);

	header("Location: $product_link?dur=$duration_num&pers=$persons&qty=$qty");
    exit();
}
add_action("wp_ajax_create_post", "create_post_func");
add_action("wp_ajax_nopriv_create_post", "create_post_func");

add_shortcode('products_form', 'create_calcul');

function create_calcul(){
	//получаем нужный товар по slug категории
	$category = get_term_by( 'slug', 'general', 'product_cat' );
    $cat_id = $category->term_id;

    $products_IDs = new WP_Query( array(
        'post_type' => 'product',
        'post_status' => 'publish',
        'tax_query' => array(
            array(
                'taxonomy' => 'product_cat',
                'field' => 'term_id',
                'terms' => $cat_id,
                'operator' => 'IN',
            )
        )
    ) );

    while ( $products_IDs->have_posts() ) : $products_IDs->the_post();
    	//id товара
    	$prod_id = get_the_ID(); 

    	//получаем количество resource, а именно Waterloo, 
    	$args = array( 'post_type' => 'bookable_resource',
    		           'post_status' => 'publish',
    					'name' => 'casque-vr-hut');
		$loop = new WP_Query( $args );
		while ( $loop->have_posts() ) : $loop->the_post();
		    $resource_id = get_the_ID();
		    //print_r($resource_id.'<br>');
		endwhile;
		$resource_qty = get_post_meta( $resource_id, 'qty', false);
		$qty = $resource_qty[0];

		$args = array('post_type' => 'custom_duration', 
              'posts_per_page' => -1,
              'orderby' => 'date', 
              'order' => 'ASC',
            );

		$duration = new WP_Query( $args );      

		//получаем мета данные нашего товара
    	$meta = new stdClass;
		foreach( (array) get_post_meta( $prod_id ) as $k => $v )
			$meta->$k = $v[0];
			$min_duration = $meta->_wc_booking_min_duration;
			$max_duration = $meta->_wc_booking_max_duration;
			//основная цена
			$price = $meta->_price;

	        //цена при условии если количество человек больше 4х (записана в админке у товара с условием)
	    	$product_pricing = get_post_meta( $prod_id, '_wc_booking_pricing', false);
	    	foreach ($product_pricing as $pricing) {
	            if (is_array($pricing)){
	                foreach ($pricing as $pris_cost) {
	                    $cost += $pris_cost['cost'];
                    }
                }
            }
		//форма
	?>
	<form action="<?php echo esc_url(get_admin_url())?>admin-ajax.php" method="post">
		<input type="hidden" name="action" value="create_post">
		<div id="input">
			<select name="persons" id="select">
				<option value=""><?php _e('Number of Players', 'booking') ?></option>
				<?php
				for ($x = 1; $x <= 50; $x++) { ?>
				<option value="<?php echo $x ?>"><?php _e($x, 'booking') ?></option>
			<?php }
			?>
			</select>

			<select name="duration" class="time" id="duration">
				<option value=""><?php _e('Time per Player', 'booking') ?></option> 
				<?php
				if( $duration->have_posts() ) { 
					while( $duration->have_posts() ) { 
						$duration->the_post(); 
	                    global $post;
	                    $duration_minutes = get_post_meta($post->ID, 'meta_key_duration_minutes', true);
	                    ?>
						<option value="<?php echo $duration_minutes; ?>"><?php the_title(); ?></option>
				<?php	}
				wp_reset_postdata();
				}

				?>
			</select>
			
			<!-- <input type="number" class="time" id="duration" name="duration" placeholder="Time per Players" value="" min="<?php //echo $min_duration ?>" max="<?php //echo $max_duration ?>" oninput="validity.valid||(value='')"> -->
			<!-- 
			<input type="checkbox" name="private" id="private"><label for='private'>Make private</label> -->
			<input type="hidden" name="price" id="price" value="<?php echo $price ?>">
			<input type="hidden" name="cost" id="cost" value="<?php echo $cost ?>">
			<input type="hidden" name="qty" id="qty" value="<?php echo $qty ?>">
			<input type="hidden" name="permalink" id="permalink" value="<?php echo $prod_id ?>">
			<!-- <span class="total">Total</span> -->
			<p class="warning"></p>
		</div>

		<div class="btn-submit">
			<input type="submit" name="submit" value="<?php _e('Réserver', 'booking') ?>">
			<a href="/contact/" title="Contact" class="btn btn-primary btn-left no-js-color" target="_blank"><?php _e('Contact', 'booking') ?></a>
		</div>
	</form>

	<?php
	endwhile;

	}

add_action( 'wp_enqueue_scripts', 'pass_var_to_jq' );

function pass_var_to_jq(){
	//получаем количество resource, а именно Waterloo, 
	$args = array( 'post_type' => 'bookable_resource',
		           'post_status' => 'publish',
					'name' => 'casque-vr-hut');
	$loop = new WP_Query( $args );
	while ( $loop->have_posts() ) : $loop->the_post();
	    $resource_id = get_the_ID();
	endwhile;
	$resource_qty = get_post_meta( $resource_id, 'qty', false);
	$qty = $resource_qty[0];

	wp_enqueue_script('jquery-main', plugins_url('js/main.js', __FILE__ ) );
}

function wbsd_filemtime( $file ) {
	if ( is_callable( 'filemtime') ) {
		$time = filemtime( $file );
		if ( date("Y", $time) == 1970 ) {
			$time = time();
		}
		return $time;
	}
	return time();
}






