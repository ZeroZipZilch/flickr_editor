import {search_form, canvas, white_balance_slider, draw, draw_canvas} from './variables';
import {getImages} from './flickr';
import {make_image_list} from './canvas';

import Filter from './canvas_tools';

export default function make_event_listeners() {
	/**
	 * Event-listener that listens to the submission of the search form
	 */
	search_form.addEventListener('submit', function(e) {
		e.preventDefault();
		getImages(0).then((images) => {
			make_image_list(images);
		});
	}, false);

	/**
	 * Toggle the Filter.options.image_flipped when "flip image" is clicked
	 */
	document.querySelector('.flip').addEventListener('click', function() {
		Filter.add_to_history();
		Filter.options.image_flipped = !Filter.options.image_flipped;
		Filter.render();
	});

	/**
	 * Event-listener for undo-button
	 */
	document.querySelector('.undo').addEventListener('click', function() {
		Filter.undo();
		Filter.render();
	});

	/**
	 * Event-listener for redo-button
	 */
	document.querySelector('.redo').addEventListener('click', function() {
		Filter.redo();
		Filter.render();
	});

	/**
	 * Event-listener for save-button
	 */
	document.querySelector('.save').addEventListener('click', function() {
		Filter.save(this);
		Filter.render();
	});


	/**
	 * When the user presses the mouse-button while on the canvas,
	 * let the script know we intend to draw
	 */
	draw_canvas.addEventListener('mousedown', function() {
		Filter.add_to_history();
		Filter.options.drawing = true;
	});

	/**
	 * When the user is no longer pressing the mouse, we
	 * set the drawing option to false
	 */
	draw_canvas.addEventListener('mouseup', function() {
		Filter.options.drawing = false;
	});

	/**
	 * If the drawing-option is true, and we have activated the
	 * draw button in the tools panel, register mouse position as
	 * points
	 */
	draw_canvas.addEventListener('mousemove', function(e) {
		if(Filter.options.drawing && Filter.options.draw_toggled) {
			var {x, y} = getMouseXY(e);
			var size = 10;

			const draw_points = Filter.options.points;
			const new_points = [...draw_points, { x, y, size }];
			Filter.options.points = new_points;
			Filter.render();
		}
	});

	/**
	 * Toggle draw to ensure the application that you would like to draw
	 * Because just relying on mouse down and mouse up would not be such a good idea
	 *
	 * Make it look cool with a style when it's toggled
	 */
	draw.addEventListener('click', function() {
		Filter.options.draw_toggled = !Filter.options.draw_toggled;

		if(Filter.options.draw_toggled) {
			this.classList.add('active');
		} else {
			this.classList.remove('active');
		}

		Filter.render();
	});

	/**
	 * Set the temperature for white balance, based on the value
	 * of the White Balance slider. Duhh
	 */
	white_balance_slider.addEventListener('change', function() {
		Filter.add_to_history();
		Filter.options.temp = this.value;
		Filter.render();
	});

	/**
	 * Set the brightness the image, based on the value
	 * of the brightness slider.
	 */
	brightness_slider.addEventListener('change', function() {
		Filter.add_to_history();
		Filter.options.brightness_value = this.value;
		Filter.render();
	})
}

/**
 * Returns an object with the x and y positions
 * of a mouse event
 */
function getMouseXY(e) {
	var x;
	var y;

	if (e.pageX || e.pageY) { 
		x = e.pageX;
		y = e.pageY;
	}
	else { 
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
	}

	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;

	return({x, y});
}