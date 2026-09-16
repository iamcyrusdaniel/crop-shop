const test_crop = document.getElementById("crop");

var dragging = false

var offsetX = 0
var offsetY = 0

var selected_crop_node = null
var overlapped_slot = null

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

  // let overlap_slots = getOverlappingElements(selected_crop_node)
  // if (overlap_slots.length > 0) {
  //   if (overlapped_slot && overlapped_slot != overlap_slots[0]) {overlapped_slot.style.backgroundColor = "rgb(255,255,255)"}
  //   overlap_slots[0].style.backgroundColor = "rgb(199, 199, 199)";
  //   overlapped_slot = overlap_slots[0];
  // }else {
  //   if (overlapped_slot) {
  //     overlapped_slot.style.backgroundColor = "rgb(255,255,255)"
  //     overlapped_slot = null
  //   }
  // }
  // if (overlapped_slot && overlapped_slot != closest_element) {overlapped_slot.style.backgroundColor = "rgb(255,255,255)"}
  // overlapped_slot = closest_element
  // if (overlapped_slot) {
  //   overlapped_slot.style.backgroundColor = "rgb(199, 199, 199)"
  // }

  const play_grid = document.querySelector(".placement-grid")
  let shortest_distance = 100000
  let closest_element = null

  const crop_rect = test_crop.getBoundingClientRect();
  const crop_cordsX = crop_rect.left
  const crop_cordsY = crop_rect.top

  for (const slot of play_grid.children) {
    const slot_rect = slot.getBoundingClientRect();
    const slot_cordsX = slot_rect.left
    const slot_cordsY = slot_rect.top

    const distance = Math.hypot(crop_cordsX - slot_cordsX, crop_cordsY - slot_cordsY)
    if (shortest_distance > distance) {
      console.log(distance)
      shortest_distance = distance
      closest_element = slot
    }
  }
  if (closest_element != null) {
    if (overlapped_slot != null) {
      overlapped_slot.style.backgroundColor = "rgb(255, 255, 255)"
    }
    overlapped_slot = closest_element
    overlapped_slot.style.backgroundColor = "rgb(199, 199, 199)"
  }
});

// document.addEventListener("mouseup", () => {
//     dragging = false;
//     selected_crop_node = null;
// });

function isOverlapping(element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}

// Example usage:
const boxA = document.getElementById('boxA');
const boxB = document.getElementById('boxB');

if (isOverlapping(boxA, boxB)) {
  console.log('The elements are overlapping!');
}

function getOverlappingElements(targetElement) {
  const allElements = document.querySelectorAll('.slot');
  const overlaps = [];

  allElements.forEach((el) => {
    if (el !== targetElement && isOverlapping(targetElement, el)) {
      overlaps.push(el);
    }
  });

  return overlaps;
}
