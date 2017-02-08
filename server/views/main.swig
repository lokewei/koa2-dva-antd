<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>旅游目的地</title>
    {% if process.env.NODE_ENV !== "development" %}
    <link rel="stylesheet" href="client/index.css" />
    {% else %}
    <link rel="stylesheet" href="index.css" />
    {% endif %}
    <link rel="icon" href="assets/images/ico.png" type="image/x-icon">
    <!--[if lte IE 10]>
        <script
          src="assets/js/ie-polyfill.js"></script>
    <![endif]-->
  </head>

  <body>
    <div id="root"></div>

    {% if process.env.NODE_ENV !== "development" %}
    <script src="client/index.js"></script>
    {% else %}
    <script src="index.js"></script>
    {% endif %}
    <script src="assets/js/tinymce.min.js"></script>
  </body>
</html>
