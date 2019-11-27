<?php

/**
 * Booking
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly 


add_action( 'woocommerce_after_shop_loop_item','wpb_wl_hook_quickview_link', 11 );

function wpb_wl_hook_quickview_link(){
	echo '<div class="wpb_wl_preview_area"><span class="wpb_wl_preview open-popup-link" data-mfp-src="#wpb_wl_quick_view_'.get_the_id().'" data-effect="mfp-zoom-in">'.__( 'Book Meeting room','booking' ).'</span></div>';
}


add_action( 'woocommerce_after_shop_loop_item','wpb_wl_hook_quickview_content' );

function wpb_wl_hook_quickview_content(){
	global $post, $woocommerce, $product;

	$columns           = apply_filters( 'woocommerce_product_thumbnails_columns', 3 );
	$post_thumbnail_id = get_post_thumbnail_id( $post->ID );
	$full_size_image   = wp_get_attachment_image_src( $post_thumbnail_id, 'full' );
	$image_title       = get_post_field( 'post_excerpt', $post_thumbnail_id );
	$placeholder       = has_post_thumbnail() ? 'with-images' : 'without-images';
	$wrapper_classes   = apply_filters( 'woocommerce_single_product_image_gallery_classes', array(
		'woocommerce-product-gallery',
		'woocommerce-product-gallery--' . $placeholder,
		'woocommerce-product-gallery--columns-' . absint( $columns ),
		'images',
	) );
	$attachment_ids = $product->get_gallery_image_ids();
	$gallery_id = rand(100,1000);

	?>
	<div id="wpb_wl_quick_view_<?php echo get_the_id(); ?>" class="mfp-hide mfp-with-anim wpb_wl_quick_view_content wpb_wl_clearfix product">
		
		<div class="wpb_wl_summary">
			<!-- Product Title -->
			<h2 class="wpb_wl_product_title"><?php the_title();?></h2>

			<!-- Product Price -->
			<?php if ( $price_html = $product->get_price_html() ) : ?>
				<span class="price wpb_wl_product_price"><?php echo $price_html; ?></span>
			<?php endif; ?>

			<!-- Product short description -->
			<?php woocommerce_template_single_excerpt();?>

			<!-- Product cart link -->
			<?php woocommerce_template_single_add_to_cart();?>

		</div>
	</div>
	<?php
}
