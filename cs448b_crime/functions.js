function updateHomeRadius(val) {
    homeCircle.setRadius(Number(val));
    document.getElementById('textInput').value = val;
}

function updateWorkRadius(val) {
    workCircle.setRadius(Number(val));
    document.getElementById('textInputWork').value = val;
}