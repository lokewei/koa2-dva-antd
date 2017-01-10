<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Ant Design Admin</title>
    <link rel="stylesheet" href="index.css" />
    <link rel="icon" href="https://t.alipayobjects.com/images/T1QUBfXo4fXXXXXXXX.png" type="image/x-icon">
    <!--[if lte IE 10]>
        <script
          src="https://as.alipayobjects.com/g/component/??console-polyfill/0.2.2/index.js,media-match/2.0.2/media.match.min.js"></script>
    <![endif]-->
  </head>

  <body>
    <div id="root"></div>

    {% if process.env.NODE_ENV !== "development" %}
    <script src="dist/index.js"></script>
    {% else %}
    <script src="http://localhost:9000/index.js"></script>
    {% endif %}
  </body>
</html>
