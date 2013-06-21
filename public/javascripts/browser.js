$(function () {
    var content = $('#content');
    var status = $('#status');
    var input = $('#input');
    var myColor = false;
    var myName = false;
    var connection = new WebSocket('ws:' + window.location.href.substring(window.location.protocol.length));

    connection.onopen = function () {
        status.text('Choose name:');
    };
    connection.onmessage = function (message) {
      var json = JSON.parse(message.data);
         if (json.type === 'color') { // first response from the server with user's color
            myColor = json.data;
            status.text(myName + ': ').css('color', myColor);
        }else if (json.type === 'message') { // it's a single message
            addMessage(json.data.author, json.data.text,
                       json.data.color, new Date(json.data.time));
        } 
    };

    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg)    return;
            connection.send(msg);
            $(this).val('');
            if (myName === false) {
                myName = msg;
            }
        }
    });


    function addMessage(author, message, color, dt) {
        content.append('<p><span style="color:' + color + '">' + author + '</span> @ ' +
             + dt.getHours() + ':'
             + (dt.getMinutes()<10?('0'+ dt.getMinutes()):dt.getMinutes()) + '----' + message + '</p>');
    }
});
