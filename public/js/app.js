var socket = io.connect('http://130.185.72.188:8080')
  , nick, color;
  
$("#chat").submit(function(e){
    nick  = $('#nick', this).val();
    color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    socket.emit('set nickname', {name:nick, color:color});
    e.preventDefault();
});

socket.on('ready', function (data)
{
    $("#chat").hide();
    $("#window").show();
    var window = $("#window"),
        msgs   = $(".messages", window),
        form   = $("form", window),
        div    = msgs[0];
    
    $("form input", window).focus();
    
    form.submit(function(e){
        var msg = $("input", this);
        if( msg.length > 0 ){
            socket.emit('msg', msg.val());
            msg.val('');
            msg.focus();
        }
        e.preventDefault();
    });
    
    function pad(number) {
        return (number < 10 ? '0' : '') + number
    }
    
    socket.on('clnt', function (clnt) {
        var today  = new Date(),
            scroll = (div.scrollHeight - msgs.scrollTop() == msgs.outerHeight());
        msgs.append('<div class="msg"> \
                        <strong style="color:'+clnt.nick.color+';">' +
                            clnt.nick.name +
                        '</strong>: ' + clnt.msg +
                        '<i>' + pad(today.getHours()) +
                          ':' + pad(today.getMinutes()) + 
                          ':' + pad(today.getSeconds()) + '</i> \
                    </div>');
        if( scroll ){
            //div.scrollTop = div.scrollHeight;
            msgs.animate({scrollTop: div.scrollHeight});
        }
    });
});