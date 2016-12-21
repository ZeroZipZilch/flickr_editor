import {search_box, search_form, info} from './variables';

let flickr_images = [];

/**
 * Method to make a flickr_url
 * @param  {string} method What method to call from the flickr.api
 * @param  param  Extra parameters for the URL
 * @return {string}        API URL
 */
function make_flickr_url(method, param) {
	const api_key = "def6981d1e064bf25f16a7542d848ace";
	var flickr_url = "https://api.flickr.com/services/rest/?nojsoncallback=1&format=json&method="+method+"&api_key="+api_key;

	
	 // If we are doing a search on photos
	if(method == 'flickr.photos.search') {
		// Add a tags parameter to the URL
		flickr_url += "&tags=";

		// Get the tags from the search box
		// and split it based on comma
		var search_string = search_box.value;
		var tags = search_string.split(',');

		// Add them to the URL, separated by comma
		for(var i = 0;i < tags.length;i++) {
			if(i !== 0) {
				flickr_url += ",";
			}

			flickr_url += tags[i];
		}
	}
	if(method == 'flickr.photos.getSizes') {
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
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', make_flickr_url(method, param));

		xhr.onload = function() {
			if(this.status >= 200 && this.status < 300) {
				resolve(xhr.response);
			}
			else {
				reject({status: this.status, statusText: xhr.statusText});
			}
		};

		xhr.onerror = function() {
			reject({status: this.status, statusText: xhr.statusText});
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
export function getImages(page) {
	// Here we're assiging an entire promise to the variable images.
	// At the end of this promise-chain, an array
	// containing object with the image URLs for thumbnail (a bit bigger)
	// and original size, as well as the image width and height.
	// 
	// First search flickr using our helper method
	var images = search_flickr().then((json_string) => {
		// Then parse the return value
		return JSON.parse(json_string);
	}).then(images => {
		// Then return the array containing the photos
		return images.photos.photo;
	}).then(photos => {
		// Then pick 5 photos starting from the first
		// photo on the page we're on (based on page arg)
		var photos_array = [];

		var photos_start = page * 5;
		var photos_end = page * 5 + 5;

		if(photos_end > photos.length)
			photos_end = photos.length;

		for(var i = photos_start;i < photos_end;i++) {
			photos_array.push(photos[i]);
		}

		return photos_array;
	}).then(photos_array => {
		// Then get the image URL's for the thumbnail and canvas-image
		// based on the ID from photos saved in the previous step
		var photos_array_string = [];

		for(var i = 0;i < photos_array.length;i++) {
			photos_array_string.push(getImage(photos_array[i].id));
		}

		// Since getImage returns a Promise, we resolve
		// all the promises in photos_array_string before passing
		// it on to the next step
		return Promise.all(photos_array_string);
	}).then(photos_array_strings => {
		// And here we parse all the strings in the array
		var photos_array = [];

		for(var i = 0;i < photos_array_strings.length;i++) {
			photos_array.push(JSON.parse(photos_array_strings[i]));
		}

		return photos_array;
	}).then(photos_array => {
		// And here we save a thumbnail url, large image url, image width and height
		// to a photo_sources array, and then we pass it as a return value.
		var photo_sources = [];

		for(var i = 0;i < photos_array.length;i++) {
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
			for(var n = 0; n < sizes_array.length;n++) {
				if(sizes_array[n].label == "Small") 
					thumbnail = sizes_array[n].source;
				
				if(sizes_array[n].label == "Large") {
					large = sizes_array[n].source;
					width = sizes_array[n].width;
					height = sizes_array[n].height;
				}
			}

			if(!large) {
				info.innerHTML = "This image doesn't seem to exist in the size this app uses";
				info.style = "";
			}
			else {
				info.innerHTML = "";
				info.style = "display:none;";
			}
			// Add image object to the images array
			photo_sources.push({thumbnail, large, width, height});
		}

		info.style = "display:none";
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
	info.innerHTML = "Loading images";
	info.style = "";

	return make_flickr_api_request("flickr.photos.search", tags);
}

/**
 * Just a short method for making a getImage API request
 * to flickr
 */
function getImage(id) {
	return make_flickr_api_request("flickr.photos.getSizes", id);
}