const mouseHighlight = document.getElementById("mouse-selector")

var dragging = false

var offsetX = 0
var offsetY = 0

var selectedCropNode = null
var selectedCropType = ""
var overlappedSlots = []
var chosenSlot = null

const cropTypes = [
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
  
      const elementStyles = window.getComputedStyle(element);

      const elementRect = element.getBoundingClientRect();
      const leftPos = elementRect.left
      const topPos = elementRect.top

      
      offsetX = event.clientX - parseInt(leftPos)
      offsetY = event.clientY - parseInt(topPos)
      
      selectedCropNode = element

      mouseHighlight.style.width = elementRect.width
      mouseHighlight.style.aspectRatio = elementStyles.aspectRatio
      mouseHighlight.style.left = "0px"
      mouseHighlight.style.top = "0px"
      overlappedSlots = []
    });
  });
}

document.addEventListener("mousemove", (e) => {
  if (!dragging || selectedCropNode == null) {return};

  selectedCropNode.style.left = `${e.clientX-offsetX}px`;
  selectedCropNode.style.top = `${e.clientY-offsetY}px`;
  
  let highlightOffsetX = 0
  let highlightOffsetY = 0

  const type = cropTypes.find(cropType => {return cropType.name === selectedCropType})
  if (type.height > 1) {
    const nodeRect = selectedCropNode.getBoundingClientRect();
    const checkPos = (e.clientY-offsetY)+(nodeRect.height/2)

    const slotSize = document.querySelectorAll(".slot")[0].getBoundingClientRect().width

    if (e.clientY > checkPos) {
      highlightOffsetY = slotSize*(type.height/2)
    }
  }
  if (type.width > 1) {
    const nodeRect = selectedCropNode.getBoundingClientRect();
    const chesPos = (e.clientX-offsetX)+(nodeRect.width/2)

    const slotSize = document.querySelectorAll(".slot")[0].getBoundingClientRect().width

    if (e.clientX > chesPos) {
      highlightOffsetX = slotSize*(type.width/2)
    }
  }

  
  const cropOverlap = getOverlappingElements(selectedCropNode)
  
  for (slot of cropOverlap) {
    const slotRect = slot.getBoundingClientRect();
    const isOverlapping =
      e.clientX >= slotRect.left &&
      e.clientX <= slotRect.right &&
      e.clientY >= slotRect.top &&
      e.clientY <= slotRect.bottom;

    if (isOverlapping) {
      chosenSlot = slot
      break;
    }
  }
  
  if (chosenSlot != null) {
    const overlappedRect = chosenSlot.getBoundingClientRect()
    
    let nodeRect = selectedCropNode.getBoundingClientRect();
    mouseHighlight.style.left = overlappedRect.left - highlightOffsetX
    mouseHighlight.style.top = overlappedRect.top - highlightOffsetY
    mouseHighlight.style.width = `${nodeRect.width}px`
    mouseHighlight.style.height = `${nodeRect.height}px`
  }
  
  const overlapSlots = getOverlappingElements(mouseHighlight)
  if (overlapSlots.length > 0) {
    for (slot of overlappedSlots) {
      if (overlapSlots.indexOf(slot) == -1) {
        slot.style.backgroundColor = "#996237"
      }
    }

    for (slot of overlapSlots) {
      slot.style.backgroundColor = "#744521"
    }
  }
  overlappedSlots = overlapSlots
});

document.addEventListener("mouseup", () => {
    dragging = false;
    
    if (chosenSlot != null && selectedCropNode != null) {

      let averageX = 0
      let averageY = 0

      const type = cropTypes.find(cropType => {return cropType.name === selectedCropType})
      overlappedSlots = getOverlappingElements(mouseHighlight)

      overlappedSlots.forEach((slot) => {
        slot.style.backgroundColor = "#996237"

        const slotRect = slot.getBoundingClientRect();
        averageX += slotRect.left - (type.width > 1 ? slotRect.width/2 : 0)
        averageY += slotRect.top - (type.height > 1 ? slotRect.height/2 : 0)
      })

      selectedCropNode.style.left = averageX / overlappedSlots.length
      selectedCropNode.style.top = averageY / overlappedSlots.length

      overlappedSlots = []
    }

    selectedCropNode = null;
});

function getOverlappingElements(targetElement) {
  const allElements = document.querySelectorAll('.slot');
  const overlaps = [];

  allElements.forEach((element) => {
    const targetRect = targetElement.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const isOverlapping = !(targetRect.right < elementRect.left || targetRect.left > elementRect.right || targetRect.bottom < elementRect.top || targetRect.top > elementRect.bottom);

    if (element !== targetElement && isOverlapping) {
      overlaps.push(element);
    }
  });

  return overlaps;
}

let selectorClose = document.getElementsByClassName("close-level-selector")[0];
let levelSelector = document.getElementsByClassName("level-selection-holder")[0];
selectorClose.addEventListener("click", () => {
  levelSelector.classList.add("hidden");
});

function openLevelSelector() {
  document.getElementsByClassName("level-selection-holder")[0].classList.toggle("hidden")
}

let setLevel = (index) => {
  mouseHighlight.style.left = "0%"
  mouseHighlight.style.top = "0%"

  cropsDiv.replaceChildren();
  let levelArray = levelArrays[index]
  levelArray.forEach((crop, cropIndex) => {
    const cropDiv = document.createElement("div");
    const backgroundRect = document.querySelector(".background").getBoundingClientRect();
    cropDiv.classList.add(crop);
    cropDiv.classList.add("crop");
    cropDiv.style.left = `${backgroundRect.left}px`;
    cropDiv.style.top = `calc(${backgroundRect.top}px + ${cropIndex * 7.5}vh)`;
    const type = cropTypes.find(cropType => {return cropType.name === crop})
    
    cropsDiv.append(cropDiv);
    
    const slotSize = document.querySelector(".slot").getBoundingClientRect();
    cropDiv.style.width = `${slotSize.width * type.width - Math.min(Math.max(1, 1*window.innerHeight), 13)}px`;
    cropDiv.style.height = `${slotSize.height * type.height - Math.min(Math.max(1, 1*window.innerHeight), 13)}px`;


    cropDiv.addEventListener("mousedown", (event) => {
      dragging = true;
      chosenSlot = null;
  
      const cropRect = cropDiv.getBoundingClientRect();
      const leftPos = cropRect.left;
      const topPos = cropRect.top;
  
      offsetX = event.clientX - parseInt(leftPos);
      offsetY = event.clientY - parseInt(topPos);
  
      mouseHighlight.style.width = `${cropRect.width}px`;
      mouseHighlight.style.height = `${cropRect.height}px`;

      selectedCropNode = cropDiv;
      selectedCropType = crop;
    });
  });
};

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
