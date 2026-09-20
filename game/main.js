const mouse_highlight = document.getElementById("mouse-selector")
const placement_grid = document.querySelector(".placement-grid")

var dragging = false

var offsetX = 0
var offsetY = 0

var selected_crop_node = null
var selected_crop_type = ""
var overlapped_slots = []
var chosen_slot = null

const crop_types = [
  {id:0, name:"tomato", width:1, height:1},
  {id:1, name:"carrot", width:1, height:2},
  {id:2, name:"watermelon", width:2, height:2},
]

const cropsDiv = document.querySelector(".crops");
let levelArrays = [
  ["tomato"],
  ["tomato", "tomato"],
  ["tomato", "carrot"],
  ["carrot", "tomato", "carrot"],
  ["watermelon", "watermelon", "watermelon", "watermelon"],
  ["carrot", "carrot", "watermelon"],
  ["tomato"],
  ["tomato"],
  ["tomato"],
  ["tomato"],
];

let activateCropHandling = () => {
  const crops = document.querySelectorAll(".crop")
  crops.forEach(element => {
    element.addEventListener("mousedown", (event) => {
      dragging = true
  
      const element_styles = window.getComputedStyle(element);
      // let left_pos = computedStyles.left
      // let top_pos = computedStyles.top

      const element_rect = element.getBoundingClientRect();
      const left_pos = element_rect.left
      const top_pos = element_rect.top

      mouse_highlight.style.width = element_rect.width
      mouse_highlight.style.aspectRatio = element_styles.aspectRatio
  
      offsetX = event.clientX - parseInt(left_pos)
      offsetY = event.clientY - parseInt(top_pos)
  
      selected_crop_node = element
    });
  });
}

document.addEventListener("mousemove", (e) => {
  if (!dragging || selected_crop_node == null) {return};

  selected_crop_node.style.left = `${e.clientX-offsetX}px`;
  selected_crop_node.style.top = `${e.clientY-offsetY}px`;
  
  let highlight_offsetX = 0
  let highlight_offsetY = 0

  const type = crop_types.find(crop_type => {return crop_type.name === selected_crop_type})
  if (type.height > 1) {
    const node_rect = selected_crop_node.getBoundingClientRect();
    const check_pos = (e.clientY-offsetY)+(node_rect.height/2)

    const slot_size = document.querySelectorAll(".slot")[0].getBoundingClientRect().width

    if (e.clientY > check_pos) {
      highlight_offsetY = slot_size*(type.height/2)
    }
  }
  if (type.width > 1) {
    const node_rect = selected_crop_node.getBoundingClientRect();
    const check_pos = (e.clientX-offsetX)+(node_rect.width/2)

    const slot_size = document.querySelectorAll(".slot")[0].getBoundingClientRect().width

    if (e.clientX > check_pos) {
      highlight_offsetX = slot_size*(type.width/2)
    }
  }

  
  const crop_overlap = getOverlappingElements(selected_crop_node)
  
  for (slot of crop_overlap) {
    const slot_rect = slot.getBoundingClientRect();
    const is_overlaping = e.clientX >= slot_rect.left && e.clientX <= slot_rect.right && e.clientY >= slot_rect.top && e.clientY <= slot_rect.bottom;

    if (is_overlaping) {
      chosen_slot = slot
      break;
    }
  }
  
  if (chosen_slot != null) {
    const overlapped_rect = chosen_slot.getBoundingClientRect()
    
    mouse_highlight.style.left = overlapped_rect.left - highlight_offsetX
    mouse_highlight.style.top = overlapped_rect.top - highlight_offsetY
  }
  
  const overlap_slots = getOverlappingElements(mouse_highlight)
  if (overlap_slots.length > 0) {
    for (slot of overlapped_slots) {
      if (overlap_slots.indexOf(slot) == -1) {
        slot.style.backgroundColor = "#996237"
      }
    }

    for (slot of overlap_slots) {
      slot.style.backgroundColor = "#744521"
    }
  }
  overlapped_slots = overlap_slots
});

document.addEventListener("mouseup", () => {
    dragging = false;
    
    if (chosen_slot != null || selected_crop_node != null) {
      const overlapped_rect = chosen_slot.getBoundingClientRect()
      const crop_rect = selected_crop_node.getBoundingClientRect()

      const highlight_rect = mouse_highlight.getBoundingClientRect();
      
      selected_crop_node.style.left = highlight_rect.left//overlapped_rect.left + ((overlapped_rect.width - crop_rect.width)/2)
      selected_crop_node.style.top = highlight_rect.top//overlapped_rect.top + ((overlapped_rect.height - crop_rect.height)/2)
      
      for (slot of overlapped_slots) {
        slot.style.backgroundColor = "#996237"
      }
      overlapped_slots = []

      // chosen_slot.style.backgroundColor = "#996237";
      // overlapped_slots = getOverlappingElements(selected_crop_node)
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

function openLevelSelector() {
  document.getElementsByClassName("level-selection-holder")[0].classList.remove("hidden")
}

let setLevel = (index) => {
  mouse_highlight.style.left = "0%"
  mouse_highlight.style.top = "0%"

  cropsDiv.replaceChildren();
  let levelArray = levelArrays[index]
  levelArray.forEach(crop => {
    const cropDiv = document.createElement("div");
    cropDiv.classList.add(crop);
    cropDiv.classList.add("crop");
    const type = crop_types.find(crop_type => {return crop_type.name === crop})
    
    cropsDiv.append(cropDiv);
    
    const cropDivRect = cropDiv.getBoundingClientRect();
    cropDiv.style.width = `${parseInt(cropDivRect.width)*type.width}px`;
    cropDiv.style.aspectRatio = `${type.width}/${type.height}`;


    cropDiv.addEventListener("mousedown", (event) => {
      dragging = true
  
      const crop_styles = window.getComputedStyle(cropDiv);
      // let left_pos = computedStyles.left
      // let top_pos = computedStyles.top

      const crop_rect = cropDiv.getBoundingClientRect();
      const left_pos = crop_rect.left
      const top_pos = crop_rect.top

      mouse_highlight.style.width = crop_rect.width
      mouse_highlight.style.aspectRatio = crop_styles.aspectRatio
  
      offsetX = event.clientX - parseInt(left_pos)
      offsetY = event.clientY - parseInt(top_pos)
  
      selected_crop_node = cropDiv
      selected_crop_type = crop
    });
  });
  // activateCropHandling();
}

let levelButtons = document.querySelectorAll(".level-option");

let levelButtonselection = () => {
  levelButtons.forEach((levelButton, index) => {
    levelButton.addEventListener("click", () => {
      setLevel(index);
    });
  });
}
levelButtonselection();
setLevel(0);
