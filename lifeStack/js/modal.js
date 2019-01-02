// Modal
var modal = document.getElementById('myModal');
var modalHeight = document.getElementById('modalContent');
// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
function openModal(elem) {
  var elem = elem;
  console.log(elem);
  modal.style.opacity = "1";
  modal.style.height ="100%";
  modalHeight.style.height="60%";
  var productInfo = document.getElementsByClassName(elem.className);
  var modalContent = document.getElementsByClassName('modal-content');
  modalContent[1].src = productInfo[1].src;
  modalContent[2].innerHTML = productInfo[2].innerHTML;
  modalContent[3].innerHTML = productInfo[3].innerHTML;
  modalContent[4].innerHTML = productInfo[4].innerHTML;

  //modal-content
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.opacity = "0";
  modal.style.height="0";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.opacity = "0";
    modal.style.height="0";

  }
}
