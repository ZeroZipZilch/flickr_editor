import {img_width, img_height, img_src} from './canvas';
import {draw_canvas, draw_canvas_ctx, canvas, ctx, brightness_slider, white_balance_slider} from './variables';

function Filters() {
	this.options = {
		img: "",
		image_flipped: false,
		brightness_value: brightness_slider.value,
		temp: white_balance_slider.value,
		draw_toggled: false,
		points: [],
		drawing: false
	}

	this.undo_stack = [];
	this.redo_stack = [];
};

/**
 * Method to flip the canvas image
 */
Filters.prototype.flip_image = function(img) {
	ctx.save();
		if(this.options.image_flipped) {
			ctx.translate(canvas.width, 0);
			ctx.scale(-1, 1);
		}

		ctx.drawImage(img, 0, 0, img_width, img_height,
					  0, 0, canvas.width, canvas.height);
	ctx.restore();
}

/**
 * Method to convert a temperature to RGB for use in Filters.white_balance().
 * I stole this algorithm from the link below
 * 
 * https://github.com/licson0729/CanvasEffects/blob/master/CanvasEffects.js
 *
 * @return {Object} Returns an object containing RGB
 */
Filters.prototype.color_temp_to_RGB = function(temp) {
	temp /= 100;
	var r, g, b;

	if (temp <= 66) {
		r = 255;
		g = Math.min(Math.max(99.4708025861 * Math.log(temp) - 161.1195681661, 0), 255);
	} else {
		r = Math.min(Math.max(329.698727446 * Math.pow(temp - 60, -0.1332047592), 0), 255);
		g = Math.min(Math.max(288.1221695283 * Math.pow(temp - 60, -0.0755148492), 0), 255);
	}

	if (temp >= 66) {
		b = 255;
	} else if (temp <= 19) {
		b = 0;
	} else {
		b = temp - 10;
		b = Math.min(Math.max(138.5177312231 * Math.log(b) - 305.0447927307, 0), 255);
	}

	return {
		r: r,
		g: g,
		b: b
	}
}

/**
 * Method to adjust brightness. Stolen from: 
 * https://github.com/licson0729/CanvasEffects/blob/master/CanvasEffects.js
 *
 * Because algorithms isn't my forte.
 */
Filters.prototype.brightness = function() {	
	var brightness = this.options.brightness_value / 100;

	return this.process(function(r, g, b, a) {
		return [r * brightness, g * brightness, b * brightness, a];
	});
}

/**
 * Method to adjust white_balance. Stolen from: 
 * https://github.com/licson0729/CanvasEffects/blob/master/CanvasEffects.js
 *
 * Because algorithms isn't my forte.
 */
Filters.prototype.white_balance = function() {
	var color = this.color_temp_to_RGB(this.options.temp);
	return this.process(function(r, g, b, a) {
		var nr = r * (255 / color.r);
		var ng = g * (255 / color.g);
		var nb = b * (255 / color.b);
		return [nr, ng, nb, a];
	});
}

/**
 * Method to draw on a second canvas layer (not the one hosting the image)
 * Decides where to draw based on the values of this.options.points
 */
Filters.prototype.draw = function() {
	draw_canvas_ctx.clearRect(0, 0, img_width, img_height);

	for(var i = 0;i < this.options.points.length;i++) {
		var point = this.options.points[i];
		draw_canvas_ctx.beginPath();
			draw_canvas_ctx.arc(point.x, point.y, point.size, 0, 2 * Math.PI, );
			draw_canvas_ctx.fill();
		draw_canvas_ctx.closePath();
	}
}

/**
 * Method to loop through all the pixels on the canvas image and apply
 * a function to them. Stolen from:
 *
 * https://github.com/licson0729/CanvasEffects/blob/master/CanvasEffects.js
 * 
 * I know I could have written this myself, but I found it, and it
 * was being used by the other algorithms that I found there,
 * so I decided to use it and make some slight modifications to it.
 */
Filters.prototype.process = function(func) {
	//Get the pixel values
	var image_data = ctx.getImageData(0, 0, img_width, img_height);
	var data = image_data.data;

	//Loop through the pixels
	for (var row = 0; row < image_data.height; row++) {
		for (var column = 0; column < image_data.width; column++) {
			var i = (column * image_data.height + row) * 4;
			var r = data[i],
				g = data[i + 1],
				b = data[i + 2],
				a = data[i + 3];

			var ret = func(r, g, b, a, row, column);
			image_data.data[i] = ret[0];
			image_data.data[i + 1] = ret[1];
			image_data.data[i + 2] = ret[2];
			image_data.data[i + 3] = ret[3];
		}
	}

	//Put the image back to the canvas
	ctx.putImageData(image_data, 0, 0);
}

/**
 * Method to download the image
 */
Filters.prototype.save = function(link) {
	var filename = + new Date()+".png";

	ctx.drawImage(draw_canvas, 0, 0);
	link.href = canvas.toDataURL();
	link.download = filename;
}

/**
 * Method to add previous options state to undo_stack
 * Resets the redo_stack to be empty.
 */
Filters.prototype.add_to_history = function() {
	this.redo_stack = [];
	console.log(this.options.image_flipped);
	this.undo_stack = [...this.undo_stack, {
		img: this.options.img,
		image_flipped: this.options.image_flipped,
		brightness_value: this.options.brightness_value,
		temp: this.options.temp,
		draw_toggled: this.options.draw_toggled,
		points: this.options.points
	}];
}

/**
 * Method to undo. Adds current options state to redo_stack
 * Changes current options state to be what's last in the undo_stack
 */
Filters.prototype.undo = function () {
	if(this.undo_stack.length) {
		this.redo_stack = [...this.redo_stack, this.options];

		var options = this.options;
		var popped_undo_stack = this.undo_stack.pop();

		var new_options = Object.assign({}, options, popped_undo_stack);
		this.options = new_options;
	}

	this.set_sliders();
}

/**
 * Method to redo. Adds current options state to undo_stack
 * Changes current options state to be what's last in the redo_stack
 */
Filters.prototype.redo = function () {
	if(this.redo_stack.length) {	
		this.undo_stack = [...this.undo_stack, this.options];

		var options = this.options;
		var popped_redo_stack = this.redo_stack.pop();

		var new_options = Object.assign({}, options, popped_redo_stack);
		this.options = new_options;
	}
	
	this.set_sliders();
}

/**
 * Method to set the sliders to the values given when undoing/ redoing
 */
Filters.prototype.set_sliders = function() {
	white_balance_slider.value = this.options.temp;
	brightness_slider.value = this.options.brightness_value;
}

/**
 * Method to render a new image with all filter settings
 */
Filters.prototype.render = function() {
	var img = new Image();
	this.options.img = img;

	img.addEventListener('load', () => {
		ctx.clearRect(0, 0, img_width, img_height);
		this.flip_image(img);
		this.brightness();
		this.white_balance();
		this.draw();
	});

	img.crossOrigin = '';
	img.src = img_src;
}

/**
 * Export the Filters object as Filter for use in other files
 */

const Filter = new Filters()
export default Filter;