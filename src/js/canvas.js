import {canvas, draw_canvas, ctx, draw_canvas_ctx, tools, info} from './variables';
import Filter from './canvas_tools';

const thumbnails_container = document.querySelector(".thumbnails_container");

export let img_width, img_height, img_src;

/**
 * Helper method to change the size of the canvas, as well
 * as the size of the draw_canvas, which is used to draw on with
 * a "pen-tool".
 */
export function change_canvas_size(width = canvas_container.offsetWidth, height = canvas_container.offsetHeight) {
	if(width > canvas_container.offsetWidth)
		width = canvas_container.offsetWidth;
	if(height > canvas_container.offsetHeight)
		height = canvas_container.offsetHeight;

	canvas.width = width;
	canvas.height = height;
	draw_canvas.width = width;
	draw_canvas.height = height;
}

/**
 * Helper method to generate the image-thumnails-list
 * when a search string is entered
 * @param  {array} images The images to display
 */
export function make_image_list(images) {
	thumbnails_container.innerHTML = "";

	for(var i = 0;i < images.length;i++) {
		var thumbnail = document.createElement('img');

		thumbnail.setAttribute("src", images[i].thumbnail);
		thumbnail.setAttribute("alt", "Image thumbnail");
		thumbnail.setAttribute("class", "image");
		thumbnail.setAttribute("data-large", images[i].large);
		thumbnail.setAttribute("data-width", images[i].width);
		thumbnail.setAttribute("data-height", images[i].height);

		thumbnails_container.appendChild(thumbnail).addEventListener('click', function() {
			info.innerHTML = "Loading image";
			info.style = "";

			change_canvas_size(this.dataset.width, this.dataset.height);
			load_image(this.dataset.large);
			canvas.setAttribute("data-source", this.dataset.large);
		});
	}
}

/**
 * Load an image to the canvas based on a URL.
 * Uses img.crossOrigin to allow us to read the imageData.
 * Globally changes img_width and img_height.
 * Clears Filter.points() so whatever we drew will be gone.
 */
function load_image(url) {
	var img = new Image();

	img.addEventListener("load", function() {
		img_width = img.width;
		img_height = img.height;
		change_canvas_size(img_width, img_height);
		ctx.clearRect(0, 0, img_width, img_height);
		draw_canvas_ctx.clearRect(0, 0, img_width, img_height);
		Filter.options.points = [];
		ctx.drawImage(img, 0, 0, img_width, img_height,
					  0, 0, canvas.width, canvas.height);
		img_src = url;
		tools.style = "";
		info.style = "display:none;";
	});

	img.crossOrigin = '';
	img.src = url;

	return img;
}