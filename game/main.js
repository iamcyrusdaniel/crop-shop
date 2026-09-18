const crops = document.querySelectorAll(".crop")

var dragging = false

var offsetX = 0
var offsetY = 0

var selected_crop_node = null
var overlapped_slots = []
var chosen_slot = null

crops.forEach(element => {
  element.addEventListener("mousedown", (event) => {
    dragging = true

    let computedStyles = window.getComputedStyle(element);
    let left_pos = computedStyles.left
    let top_pos = computedStyles.top

    offsetX = event.clientX - parseInt(left_pos)
    offsetY = event.clientY - parseInt(top_pos)

    selected_crop_node = element
  });
});

document.addEventListener("mousemove", (e) => {
  if (!dragging || selected_crop_node == null) {return};

  selected_crop_node.style.left = `${e.clientX-offsetX}px`;
  selected_crop_node.style.top = `${e.clientY-offsetY}px`;

  const overlap_slots = getOverlappingElements(selected_crop_node)

  if (overlap_slots.length > 0) {
    for (slot of overlap_slots) {
      const slot_rect = slot.getBoundingClientRect();
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
});

document.addEventListener("mouseup", () => {
    dragging = false;
    
    if (chosen_slot != null) {
      const overlapped_rect = chosen_slot.getBoundingClientRect()
      const crop_rect = selected_crop_node.getBoundingClientRect()
      
      selected_crop_node.style.left = overlapped_rect.left + ((overlapped_rect.width - crop_rect.width)/2)
      selected_crop_node.style.top = overlapped_rect.top + ((overlapped_rect.height - crop_rect.height)/2)
      
      chosen_slot.style.backgroundColor = "#996237";
      overlapped_slots = getOverlappingElements(selected_crop_node)
    }

    selected_crop_node = null;
});

function getOverlappingElements(targetElement) {
  const allElements = document.querySelectorAll('.slot');
  const overlaps = [];

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
