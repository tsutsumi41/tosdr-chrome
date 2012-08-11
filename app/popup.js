jQuery(function () {

    function renderDataPoint(service, dataPointId) {
        jQuery.ajax('http://tos-dr.info/points/' + dataPointId + '.json', {success:function (dataPoint) {
            var badge,icon,sign;
            if (dataPoint.tosdr.point == 'good') {
                badge = 'badge-success';
                icon = 'thumbs-up';
                sign = '+';
            } else if (dataPoint.tosdr.point == 'mediocre') {
                badge = 'badge-warning';
                icon = 'thumbs-down';
                sign = '-';
            } else if (dataPoint.tosdr.point == 'alert') {
                badge = 'badge-important';
                icon = 'remove';
                sign = '×';
            } else if (dataPoint.tosdr.point == 'not bad') {
                badge = 'badge-neutral';
                icon = 'hand-right';
                sign = '→';
            } else {
                badge = '';
                icon = 'question-sign';
                sign = '?';
            }
            document.getElementById('popup-point-' + service + '-' + dataPointId).innerHTML =
                '<div class="' + dataPoint.tosdr.point + '"><h5><span class="badge ' + badge
                    + '" title="' + dataPoint.tosdr.point + '"><i class="icon-' + icon + ' icon-white">' + sign + '</i></span> <a target="_blank" href="' + dataPoint.discussion + '">' + dataPoint.name + '</a></h5><p>'
                    + dataPoint.tosdr.tldr + '</p></div></li>';
        }});
    }

    function renderPopup(name) {
        var service = JSON.parse(localStorage[name]);
        var points = service.points;
        var ratingText = {
            0:"We haven't sufficiently reviewed the terms yet. Please contribute to our group.",
            "false":"We haven't sufficiently reviewed the terms yet. Please contribute to our group.",
            "A":"The terms of service treat you fairly, respect your rights and follows the best practices.",
            "B":"The terms of services are fair towards the user but they could be improved.",
            "C":"The terms of service are okay but some issues need your consideration.",
            "D":"The terms of service are very uneven or there are some important issues that need your attention.",
            "E":"The terms of service raise very serious concerns."
        };
        renderPopupHtml(name, service.name, service.url, service.tosdr.rated, ratingText[service.tosdr.rated], points);
    }

    function renderPopupHtml(name, longName, domain, verdict, ratingText, points) {
        var headerHtml = '<div class="modal-header">'
            + '<img src="http://tos-dr.info/logo/' + name + '.png" alt="" class="pull-left favlogo" height="36" >'
            + '<h3>' + longName + ' <small class="service-url"><i class="icon icon-globe"></i> <a href="http://' + domain + '" target="_blank">' + domain + '</a></small></h3></div> ';
        var classHtml = '<div class="tosdr-rating"><label class="label ' + verdict + '">'
            + (verdict ? 'Class ' + verdict : 'No Class Yet') + '</label><p>' + ratingText + '</p></div>';
        var pointsHtml = '';
        for (var i = 0; i < points.length; i++) {
            pointsHtml += '<li id="popup-point-' + name + '-' + points[i] + '" class="point"></li>';
        }
        var bodyHtml = '<div class="modal-body">' + classHtml + '<section class="specificissues"> <ul class="tosdr-points">' + pointsHtml + '</ul></section></div>';
        $('#page').html(headerHtml + bodyHtml);
        for (var i = 0; i < points.length; i++) {
            renderDataPoint(name, points[i]);
        }
    }

    var serviceName = window.location.hash.substr(1);
    renderPopup(serviceName);

    $('#closeButton,.close').click(function () {
        window.close();
    });
})