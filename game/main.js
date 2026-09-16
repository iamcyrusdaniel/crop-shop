const test_crop = document.getElementById("crop");

var dragging = false

var offsetX = 0
var offsetY = 0

var selected_crop_node = null

// test_crop.addEventListener("mousemove", (event) => {
//   if (!dragging) {return}
//   event.preventDefault();

//   let computedStyles = window.getComputedStyle(test_crop);
//   let left_pos = computedStyles.left
//   let top_pos = computedStyles.top
  
//   test_crop.style.left = `${parseInt(left_pos)+(event.clientX-starting_mouse_posX)}px`;
//   test_crop.style.top = `${parseInt(top_pos)+(event.clientY-starting_mouse_posY)}px`;
//   // console.log(`${parseInt(left_pos)+(event.clientX-starting_mouse_posX)}px`);
//   // console.log(`Coordinates: X=${`${parseInt(left_pos)+(event.clientX-starting_mouse_posX)}px;`}, Y=${parseInt(left_pos)}`);
// })

test_crop.addEventListener("mousedown", (event) => {
  dragging = !dragging
  if (!dragging) {return;};

  let computedStyles = window.getComputedStyle(test_crop);
  let left_pos = computedStyles.left
  let top_pos = computedStyles.top

  offsetX = event.clientX - parseInt(left_pos)
  offsetY = event.clientY - parseInt(top_pos)

  selected_crop_node = test_crop
});

document.addEventListener("mousemove", (e) => {
  if (!dragging || selected_crop_node == null) {return};

  selected_crop_node.style.left = `${e.clientX-offsetX}px`;
  selected_crop_node.style.top = `${e.clientY-offsetY}px`;
});

// document.addEventListener("mouseup", () => {
//     dragging = false;
//     selected_crop_node = null;
// });


