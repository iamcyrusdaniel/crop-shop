const test_crop = document.getElementById("crop");

var dragging = false

var offsetX = 0
var offsetY = 0

var selected_crop_node = null
var overlapped_slots = []
var chosen_slot = null

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
  dragging = true

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

  const overlap_slots = getOverlappingElements(selected_crop_node)

  // const crop_rect = selected_crop_node.getBoundingClientRect();
  // const crop_cordsX = e.clientX
  // const crop_cordsY = e.clientY

  if (overlap_slots.length > 0) {
    for (slot of overlap_slots) {
      // slot.style.backgroundColor = "rgb(199, 199, 199)";
      // overlapped_slots.push(slot)
      const slot_rect = slot.getBoundingClientRect();

      // const distance = Math.hypot(crop_cordsX - slot_cordsX, crop_cordsY - slot_cordsY)

      const is_overlaping = e.clientX >= slot_rect.left && e.clientX <= slot_rect.right && e.clientY >= slot_rect.top && e.clientY <= slot_rect.bottom;

      if (is_overlaping) {
        if (chosen_slot) {
          chosen_slot.style.backgroundColor = "#996237";
        }
       chosen_slot = slot
       chosen_slot.style.backgroundColor = "#744521";
       break;
     }
    }
  }
  // for (slot of overlapped_slots) {
  //   if (!overlap_slots.includes(slot)) {
  //     slot.style.backgroundColor = "rgb(255, 255, 255)";
  //     overlapped_slots.splice(overlapped_slots.indexOf(slot), 1)
  //   }
  // }
  // if (overlapped_slot && overlapped_slot != closest_element) {overlapped_slot.style.backgroundColor = "rgb(255,255,255)"}
  // overlapped_slot = closest_element
  // if (overlapped_slot) {
  //   overlapped_slot.style.backgroundColor = "rgb(199, 199, 199)"
  // }

  // const play_grid = document.querySelector(".placement-grid")
  // let shortest_distance = 100000
  // let closest_element = null

  // const crop_rect = test_crop.getBoundingClientRect();
  // const crop_cordsX = crop_rect.left
  // const crop_cordsY = crop_rect.top

  // for (const slot of play_grid.children) {
  //   const slot_rect = slot.getBoundingClientRect();
  //   const slot_cordsX = slot_rect.left //- slot_rect.width
  //   const slot_cordsY = slot_rect.top //- slot_rect.height

  //   const distance = Math.hypot(crop_cordsX - slot_cordsX, crop_cordsY - slot_cordsY)
  //   if (shortest_distance > distance) {
  //     console.log(distance)
  //     shortest_distance = distance
  //     closest_element = slot
  //   }
  // }
  // if (closest_element != null) {
  //   if (overlapped_slot != null) {
  //     overlapped_slot.style.backgroundColor = "rgb(255, 255, 255)"
  //   }
  //   overlapped_slot = closest_element
  //   overlapped_slot.style.backgroundColor = "rgb(199, 199, 199)"
  // }
});

document.addEventListener("mouseup", () => {
    dragging = false;
    selected_crop_node = null;

    if (chosen_slot != null) {
      const overlapped_rect = chosen_slot.getBoundingClientRect()
      const crop_rect = test_crop.getBoundingClientRect()

      test_crop.style.left = overlapped_rect.left + ((overlapped_rect.width - crop_rect.width)/2)
      test_crop.style.top = overlapped_rect.top + ((overlapped_rect.height - crop_rect.height)/2)

      chosen_slot.style.backgroundColor = "#996237";
      overlapped_slots = []
    }
});

function getOverlappingElements(targetElement) {
  const allElements = document.querySelectorAll('.slot');
  const overlaps = []

  allElements.forEach((element) => {
    const target_rect = targetElement.getBoundingClientRect();
    const element_rect = element.getBoundingClientRect();
    const is_overlaping = !(target_rect.right < element_rect.left || target_rect.left > element_rect.right || target_rect.bottom < element_rect.top || target_rect.top > element_rect.bottom);

    if (element !== targetElement && is_overlaping) {
      overlaps.push(element);
    }
  });

  return overlaps;
}

let selectorClose = document.getElementsByClassName("close-level-selector")[0];
let levelSelector = document.getElementsByClassName("level-selection-holder")[0];
console.log(selectorClose, levelSelector);
selectorClose.addEventListener("click", () => {
    levelSelector.classList.add("hidden");
});
