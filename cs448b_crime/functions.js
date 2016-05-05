function updateHomeRadius(val) {
    homeCircle.setRadius(Number(val));
}

function updateWorkRadius(val) {
    workCircle.setRadius(Number(val));
}

function showInput(id, display) {

    var message_entered =  document.getElementById(id).value;
    document.getElementById(display).innerHTML = message_entered;
}

function updateTextInput(val) {
      document.getElementById('textInput').value=val; 
    }