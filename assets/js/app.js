/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _canvas = __webpack_require__(1);
	
	var _event_listeners = __webpack_require__(4);
	
	var _event_listeners2 = _interopRequireDefault(_event_listeners);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	(0, _event_listeners2.default)();
	(0, _canvas.change_canvas_size)();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.img_src = exports.img_height = exports.img_width = undefined;
	exports.change_canvas_size = change_canvas_size;
	exports.make_image_list = make_image_list;
	
	var _variables = __webpack_require__(2);
	
	var _canvas_tools = __webpack_require__(3);
	
	var _canvas_tools2 = _interopRequireDefault(_canvas_tools);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var thumbnails_container = document.querySelector(".thumbnails_container");
	
	var img_width = exports.img_width = void 0,
	    img_height = exports.img_height = void 0,
	    img_src = exports.img_src = void 0;
	
	/**
	 * Helper method to change the size of the canvas, as well
	 * as the size of the draw_canvas, which is used to draw on with
	 * a "pen-tool".
	 */
	function change_canvas_size() {
		var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : canvas_container.offsetWidth;
		var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : canvas_container.offsetHeight;
	
		if (width > canvas_container.offsetWidth) width = canvas_container.offsetWidth;
		if (height > canvas_container.offsetHeight) height = canvas_container.offsetHeight;
	
		_variables.canvas.width = width;
		_variables.canvas.height = height;
		_variables.draw_canvas.width = width;
		_variables.draw_canvas.height = height;
	}
	
	/**
	 * Helper method to generate the image-thumnails-list
	 * when a search string is entered
	 * @param  {array} images The images to display
	 */
	function make_image_list(images) {
		thumbnails_container.innerHTML = "";
	
		for (var i = 0; i < images.length; i++) {
			var thumbnail = document.createElement('img');
	
			thumbnail.setAttribute("src", images[i].thumbnail);
			thumbnail.setAttribute("alt", "Image thumbnail");
			thumbnail.setAttribute("class", "image");
			thumbnail.setAttribute("data-large", images[i].large);
			thumbnail.setAttribute("data-width", images[i].width);
			thumbnail.setAttribute("data-height", images[i].height);
	
			thumbnails_container.appendChild(thumbnail).addEventListener('click', function () {
				_variables.info.innerHTML = "Loading image";
				_variables.info.style = "";
	
				change_canvas_size(this.dataset.width, this.dataset.height);
				load_image(this.dataset.large);
				_variables.canvas.setAttribute("data-source", this.dataset.large);
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
	
		img.addEventListener("load", function () {
			exports.img_width = img_width = img.width;
			exports.img_height = img_height = img.height;
			change_canvas_size(img_width, img_height);
			_variables.ctx.clearRect(0, 0, img_width, img_height);
			_variables.draw_canvas_ctx.clearRect(0, 0, img_width, img_height);
			_canvas_tools2.default.options.points = [];
			_variables.ctx.drawImage(img, 0, 0, img_width, img_height, 0, 0, _variables.canvas.width, _variables.canvas.height);
			exports.img_src = img_src = url;
			_variables.tools.style = "";
			_variables.info.style = "display:none;";
		});
	
		img.crossOrigin = '';
		img.src = url;
	
		return img;
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var search_box = exports.search_box = document.querySelector(".flickr_search_box");
	var search_form = exports.search_form = document.querySelector(".flickr_search_form");
	var thumbnails_container = exports.thumbnails_container = document.querySelector(".thumbnails_container");
	var tools = exports.tools = document.querySelector("#tools");
	var canvas_container = exports.canvas_container = document.querySelector("#canvas_container");
	var white_balance_slider = exports.white_balance_slider = document.querySelector("#white_balance_slider");
	var brightness_slider = exports.brightness_slider = document.querySelector("#brightness_slider");
	var canvas = exports.canvas = document.querySelector(".canvas");
	var info = exports.info = document.querySelector(".info");
	var draw_canvas = exports.draw_canvas = document.querySelector(".draw_canvas");
	var draw_canvas_ctx = exports.draw_canvas_ctx = document.querySelector(".draw_canvas").getContext('2d');
	var draw = exports.draw = document.querySelector(".draw");
	var ctx = exports.ctx = canvas.getContext('2d');

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _canvas = __webpack_require__(1);
	
	var _variables = __webpack_require__(2);
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function Filters() {
		this.options = {
			img: "",
			image_flipped: false,
			brightness_value: _variables.brightness_slider.value,
			temp: _variables.white_balance_slider.value,
			draw_toggled: false,
			points: [],
			drawing: false
		};
	
		this.undo_stack = [];
		this.redo_stack = [];
	};
	
	/**
	 * Method to flip the canvas image
	 */
	Filters.prototype.flip_image = function (img) {
		_variables.ctx.save();
		if (this.options.image_flipped) {
			_variables.ctx.translate(_variables.canvas.width, 0);
			_variables.ctx.scale(-1, 1);
		}
	
		_variables.ctx.drawImage(img, 0, 0, _canvas.img_width, _canvas.img_height, 0, 0, _variables.canvas.width, _variables.canvas.height);
		_variables.ctx.restore();
	};
	
	/**
	 * Method to convert a temperature to RGB for use in Filters.white_balance().
	 * I stole this algorithm from the link below
	 * 
	 * https://github.com/licson0729/CanvasEffects/blob/master/CanvasEffects.js
	 *
	 * @return {Object} Returns an object containing RGB
	 */
	Filters.prototype.color_temp_to_RGB = function (temp) {
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
		};
	};
	
	/**
	 * Method to adjust brightness. Stolen from: 
	 * https://github.com/licson0729/CanvasEffects/blob/master/CanvasEffects.js
	 *
	 * Because algorithms isn't my forte.
	 */
	Filters.prototype.brightness = function () {
		var brightness = this.options.brightness_value / 100;
	
		return this.process(function (r, g, b, a) {
			return [r * brightness, g * brightness, b * brightness, a];
		});
	};
	
	/**
	 * Method to adjust white_balance. Stolen from: 
	 * https://github.com/licson0729/CanvasEffects/blob/master/CanvasEffects.js
	 *
	 * Because algorithms isn't my forte.
	 */
	Filters.prototype.white_balance = function () {
		var color = this.color_temp_to_RGB(this.options.temp);
		return this.process(function (r, g, b, a) {
			var nr = r * (255 / color.r);
			var ng = g * (255 / color.g);
			var nb = b * (255 / color.b);
			return [nr, ng, nb, a];
		});
	};
	
	/**
	 * Method to draw on a second canvas layer (not the one hosting the image)
	 * Decides where to draw based on the values of this.options.points
	 */
	Filters.prototype.draw = function () {
		_variables.draw_canvas_ctx.clearRect(0, 0, _canvas.img_width, _canvas.img_height);
	
		for (var i = 0; i < this.options.points.length; i++) {
			var point = this.options.points[i];
			_variables.draw_canvas_ctx.beginPath();
			_variables.draw_canvas_ctx.arc(point.x, point.y, point.size, 0, 2 * Math.PI);
			_variables.draw_canvas_ctx.fill();
			_variables.draw_canvas_ctx.closePath();
		}
	};
	
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
	Filters.prototype.process = function (func) {
		//Get the pixel values
		var image_data = _variables.ctx.getImageData(0, 0, _canvas.img_width, _canvas.img_height);
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
		_variables.ctx.putImageData(image_data, 0, 0);
	};
	
	/**
	 * Method to download the image
	 */
	Filters.prototype.save = function (link) {
		var timestamp = +new Date();
		var filename = "flickr_editor_" + timestamp + ".png";
	
		_variables.ctx.drawImage(_variables.draw_canvas, 0, 0);
		link.href = _variables.canvas.toDataURL();
		link.download = filename;
	};
	
	/**
	 * Method to add previous options state to undo_stack
	 * Resets the redo_stack to be empty.
	 */
	Filters.prototype.add_to_history = function () {
		this.redo_stack = [];
		console.log(this.options.image_flipped);
		this.undo_stack = [].concat(_toConsumableArray(this.undo_stack), [{
			img: this.options.img,
			image_flipped: this.options.image_flipped,
			brightness_value: this.options.brightness_value,
			temp: this.options.temp,
			draw_toggled: this.options.draw_toggled,
			points: this.options.points
		}]);
	};
	
	/**
	 * Method to undo. Adds current options state to redo_stack
	 * Changes current options state to be what's last in the undo_stack
	 */
	Filters.prototype.undo = function () {
		if (this.undo_stack.length) {
			this.redo_stack = [].concat(_toConsumableArray(this.redo_stack), [this.options]);
	
			var options = this.options;
			var popped_undo_stack = this.undo_stack.pop();
	
			var new_options = Object.assign({}, options, popped_undo_stack);
			this.options = new_options;
		}
	
		this.set_sliders();
	};
	
	/**
	 * Method to redo. Adds current options state to undo_stack
	 * Changes current options state to be what's last in the redo_stack
	 */
	Filters.prototype.redo = function () {
		if (this.redo_stack.length) {
			this.undo_stack = [].concat(_toConsumableArray(this.undo_stack), [this.options]);
	
			var options = this.options;
			var popped_redo_stack = this.redo_stack.pop();
	
			var new_options = Object.assign({}, options, popped_redo_stack);
			this.options = new_options;
		}
	
		this.set_sliders();
	};
	
	/**
	 * Method to set the sliders to the values given when undoing/ redoing
	 */
	Filters.prototype.set_sliders = function () {
		_variables.white_balance_slider.value = this.options.temp;
		_variables.brightness_slider.value = this.options.brightness_value;
	};
	
	/**
	 * Method to render a new image with all filter settings
	 */
	Filters.prototype.render = function () {
		var _this = this;
	
		var img = new Image();
		this.options.img = img;
	
		img.addEventListener('load', function () {
			_variables.ctx.clearRect(0, 0, _canvas.img_width, _canvas.img_height);
			_this.flip_image(img);
			_this.brightness();
			_this.white_balance();
			_this.draw();
		});
	
		img.crossOrigin = '';
		img.src = _canvas.img_src;
	};
	
	/**
	 * Export the Filters object as Filter for use in other files
	 */
	
	var Filter = new Filters();
	exports.default = Filter;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = make_event_listeners;
	
	var _variables = __webpack_require__(2);
	
	var _flickr = __webpack_require__(5);
	
	var _canvas = __webpack_require__(1);
	
	var _canvas_tools = __webpack_require__(3);
	
	var _canvas_tools2 = _interopRequireDefault(_canvas_tools);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function make_event_listeners() {
		/**
	  * Event-listener that listens to the submission of the search form
	  */
		_variables.search_form.addEventListener('submit', function (e) {
			e.preventDefault();
			(0, _flickr.getImages)(0).then(function (images) {
				(0, _canvas.make_image_list)(images);
			});
		}, false);
	
		/**
	  * Toggle the Filter.options.image_flipped when "flip image" is clicked
	  */
		document.querySelector('.flip').addEventListener('click', function () {
			_canvas_tools2.default.add_to_history();
			_canvas_tools2.default.options.image_flipped = !_canvas_tools2.default.options.image_flipped;
			_canvas_tools2.default.render();
		});
	
		/**
	  * Event-listener for undo-button
	  */
		document.querySelector('.undo').addEventListener('click', function () {
			_canvas_tools2.default.undo();
			_canvas_tools2.default.render();
		});
	
		/**
	  * Event-listener for redo-button
	  */
		document.querySelector('.redo').addEventListener('click', function () {
			_canvas_tools2.default.redo();
			_canvas_tools2.default.render();
		});
	
		/**
	  * Event-listener for save-button
	  */
		document.querySelector('.save').addEventListener('click', function () {
			_canvas_tools2.default.save(this);
			_canvas_tools2.default.render();
		});
	
		/**
	  * When the user presses the mouse-button while on the canvas,
	  * let the script know we intend to draw
	  */
		_variables.draw_canvas.addEventListener('mousedown', function () {
			_canvas_tools2.default.add_to_history();
			_canvas_tools2.default.options.drawing = true;
		});
	
		/**
	  * When the user is no longer pressing the mouse, we
	  * set the drawing option to false
	  */
		_variables.draw_canvas.addEventListener('mouseup', function () {
			_canvas_tools2.default.options.drawing = false;
		});
	
		/**
	  * If the drawing-option is true, and we have activated the
	  * draw button in the tools panel, register mouse position as
	  * points
	  */
		_variables.draw_canvas.addEventListener('mousemove', function (e) {
			if (_canvas_tools2.default.options.drawing && _canvas_tools2.default.options.draw_toggled) {
				var _getMouseXY = getMouseXY(e),
				    x = _getMouseXY.x,
				    y = _getMouseXY.y;
	
				var size = 10;
	
				var draw_points = _canvas_tools2.default.options.points;
				var new_points = [].concat(_toConsumableArray(draw_points), [{ x: x, y: y, size: size }]);
				_canvas_tools2.default.options.points = new_points;
				_canvas_tools2.default.render();
			}
		});
	
		/**
	  * Toggle draw to ensure the application that you would like to draw
	  * Because just relying on mouse down and mouse up would not be such a good idea
	  *
	  * Make it look cool with a style when it's toggled
	  */
		_variables.draw.addEventListener('click', function () {
			_canvas_tools2.default.options.draw_toggled = !_canvas_tools2.default.options.draw_toggled;
	
			if (_canvas_tools2.default.options.draw_toggled) {
				this.classList.add('active');
			} else {
				this.classList.remove('active');
			}
	
			_canvas_tools2.default.render();
		});
	
		/**
	  * Set the temperature for white balance, based on the value
	  * of the White Balance slider. Duhh
	  */
		_variables.white_balance_slider.addEventListener('change', function () {
			_canvas_tools2.default.add_to_history();
			_canvas_tools2.default.options.temp = this.value;
			_canvas_tools2.default.render();
		});
	
		/**
	  * Set the brightness the image, based on the value
	  * of the brightness slider.
	  */
		brightness_slider.addEventListener('change', function () {
			_canvas_tools2.default.add_to_history();
			_canvas_tools2.default.options.brightness_value = this.value;
			_canvas_tools2.default.render();
		});
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
		} else {
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
	
		x -= _variables.canvas.offsetLeft;
		y -= _variables.canvas.offsetTop;
	
		return { x: x, y: y };
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.getImages = getImages;
	
	var _variables = __webpack_require__(2);
	
	var flickr_images = [];
	
	/**
	 * Method to make a flickr_url
	 * @param  {string} method What method to call from the flickr.api
	 * @param  param  Extra parameters for the URL
	 * @return {string}        API URL
	 */
	function make_flickr_url(method, param) {
		var api_key = "def6981d1e064bf25f16a7542d848ace";
		var flickr_url = "https://api.flickr.com/services/rest/?nojsoncallback=1&format=json&method=" + method + "&api_key=" + api_key;
	
		// If we are doing a search on photos
		if (method == 'flickr.photos.search') {
			// Add a tags parameter to the URL
			flickr_url += "&tags=";
	
			// Get the tags from the search box
			// and split it based on comma
			var search_string = _variables.search_box.value;
			var tags = search_string.split(',');
	
			// Add them to the URL, separated by comma
			for (var i = 0; i < tags.length; i++) {
				if (i !== 0) {
					flickr_url += ",";
				}
	
				flickr_url += tags[i];
			}
		}
		if (method == 'flickr.photos.getSizes') {
			flickr_url += "&photo_id=" + param;
		}
	
		return flickr_url;
	}
	
	/**
	 * Make a flickr API request
	 * @param  {string} method What method to call from the flickr.api
	 * @param  param  Extra parameters for the URL
	 * @return {Promise}        Returns a Promise containing
	 *                          whatever the XMLHttpRequest returned
	 */
	function make_flickr_api_request(method, param) {
		return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', make_flickr_url(method, param));
	
			xhr.onload = function () {
				if (this.status >= 200 && this.status < 300) {
					resolve(xhr.response);
				} else {
					reject({ status: this.status, statusText: xhr.statusText });
				}
			};
	
			xhr.onerror = function () {
				reject({ status: this.status, statusText: xhr.statusText });
			};
	
			xhr.send();
		});
	}
	
	/**
	 * Gets the images based on the return value
	 * of make_flickr_api_request. There's no error handling.
	 * That's mainly due to lack of time. Sorry.
	 *
	 * The page parameter is not being dynamically assigned
	 * from functions calling this function.
	 * This is mainly due to lack of time as well.
	 */
	function getImages(page) {
		// Here we're assiging an entire promise to the variable images.
		// At the end of this promise-chain, an array
		// containing object with the image URLs for thumbnail (a bit bigger)
		// and original size, as well as the image width and height.
		// 
		// First search flickr using our helper method
		var images = search_flickr().then(function (json_string) {
			// Then parse the return value
			return JSON.parse(json_string);
		}).then(function (images) {
			// Then return the array containing the photos
			return images.photos.photo;
		}).then(function (photos) {
			// Then pick 5 photos starting from the first
			// photo on the page we're on (based on page arg)
			var photos_array = [];
	
			var photos_start = page * 5;
			var photos_end = page * 5 + 5;
	
			if (photos_end > photos.length) photos_end = photos.length;
	
			for (var i = photos_start; i < photos_end; i++) {
				photos_array.push(photos[i]);
			}
	
			return photos_array;
		}).then(function (photos_array) {
			// Then get the image URL's for the thumbnail and canvas-image
			// based on the ID from photos saved in the previous step
			var photos_array_string = [];
	
			for (var i = 0; i < photos_array.length; i++) {
				photos_array_string.push(getImage(photos_array[i].id));
			}
	
			// Since getImage returns a Promise, we resolve
			// all the promises in photos_array_string before passing
			// it on to the next step
			return Promise.all(photos_array_string);
		}).then(function (photos_array_strings) {
			// And here we parse all the strings in the array
			var photos_array = [];
	
			for (var i = 0; i < photos_array_strings.length; i++) {
				photos_array.push(JSON.parse(photos_array_strings[i]));
			}
	
			return photos_array;
		}).then(function (photos_array) {
			// And here we save a thumbnail url, large image url, image width and height
			// to a photo_sources array, and then we pass it as a return value.
			var photo_sources = [];
	
			for (var i = 0; i < photos_array.length; i++) {
				// We chose to actually get all sizes rather than the image_context,
				// so we now have access to multiple image sizes.
				var sizes_array = photos_array[i].sizes.size;
	
				var thumbnail;
				var large;
				var width;
				var height;
	
				// We loop through all the sizes, until we find
				// the small and original one.
				// 
				// We should handle an error here in case an image
				// doesn't exist, but yeah.. I didn't, because I wanted to
				// prioritize other things. But some images don't
				// exist as small/ original (I think, because sometimes images
				// don't show up)
				for (var n = 0; n < sizes_array.length; n++) {
					if (sizes_array[n].label == "Small") thumbnail = sizes_array[n].source;
	
					if (sizes_array[n].label == "Large") {
						large = sizes_array[n].source;
						width = sizes_array[n].width;
						height = sizes_array[n].height;
					}
				}
	
				if (!large) {
					_variables.info.innerHTML = "This image doesn't seem to exist in the size this app uses";
					_variables.info.style = "";
				} else {
					_variables.info.innerHTML = "";
					_variables.info.style = "display:none;";
				}
				// Add image object to the images array
				photo_sources.push({ thumbnail: thumbnail, large: large, width: width, height: height });
			}
	
			_variables.info.style = "display:none";
			return photo_sources;
		});
	
		// Return the images array we made with the promise-chain above
		return images;
	}
	
	/**
	 * Just a short method for making a search API request
	 * to flickr
	 */
	function search_flickr(tags) {
		_variables.info.innerHTML = "Loading images";
		_variables.info.style = "";
	
		return make_flickr_api_request("flickr.photos.search", tags);
	}
	
	/**
	 * Just a short method for making a getImage API request
	 * to flickr
	 */
	function getImage(id) {
		return make_flickr_api_request("flickr.photos.getSizes", id);
	}

/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map