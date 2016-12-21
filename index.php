<!doctype html>
<html lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="assets/css/app.css">
    </head>
    <body>
        <!--[if lte IE 9]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience and security.</p>
        <![endif]-->

        <div id="app">
            <div id="images">
                <p>Enter flickr search term:</p>
                <form class="flickr_search_form">    
                    <input type="text" class="flickr_search_box" placeholder="Enter your flickr tags, separated by comma" />
                    <button class="search_flickr">S</button>
                </form>
                <div class="thumbnails_container"></div>
            </div>
            <div id="canvas_container">
                <canvas class="canvas"></canvas>
                <canvas class="draw_canvas"></canvas>
            </div>
            <div id="tools" style="display:none;">
                <button class="flip">Flip Image</button>
                
                <div class="white_balance">White Balanace</div>
                <input type="range" min="0" max="10000", value="6500" id="white_balance_slider" />
                
                <div class="brightness">Brightness</div>
                <input type="range" min="0" max="200", value="100" id="brightness_slider" />
                
                <button class="draw">Draw</button>
                
                <button class="undo">Undo</button>
                <button class="redo">Redo</button>
                <a class="save">Save</a>
            </div>
        </div>

        <script src="assets/js/app.js"></script>
    </body>
</html>