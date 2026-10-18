const mouseHighlight = document.getElementById("mouse-selector")

// const closeBackground = document.getElementById("close-background")

const actionSounds = {
  pickup: new Audio("../assets/actions/pickup.mp3"),
  placed: new Audio("../assets/actions/placed.mp3"),
}

let level = 0
let levelText = document.getElementById("levelText");

var dragging = false

var cropHolderToggle = false

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
  {id:3, name:"beetroot", width:2, height:1},
]

let backgroundMusic = document.getElementById("backgroundMusic");
document.addEventListener("click", () => {
  backgroundMusic.play();
  backgroundMusic.volume = 0.5;
}, {once: true});

document.getElementById("musicButton").addEventListener("click", () => {
  if(backgroundMusic.paused){
    backgroundMusic.play();
    musicButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M580-86v-109q97-28 157.5-107T798-481q0-100-61-179T580-767v-109q142 29 232.5 139.5T903-481q0 144-90.5 255.5T580-86ZM57-318v-324h185l258-258v840L242-318H57Zm523 15v-355q53 26 86 73t33 105q0 58-33 105t-86 72Z"/></svg>'
  } else {
    backgroundMusic.pause();
    musicButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M808-9 691-128q-25 15-53.5 26T577-86v-109q10-2 19-5t18-8L497-326v266L240-318H54v-324h137L5-834l73-73L882-83 808-9Zm35-265-77-79q14-30 22-62t8-66q0-100-61.5-179T577-767v-109q142 29 233.5 139.5T902-481q0 57-15.5 109T843-274ZM688-432 577-545v-113q53 25 87 72.5T698-480q0 13-2.5 25t-7.5 23ZM497-628 364-766l133-134v272Z"/></svg>'
  }
})

const cropsDiv = document.getElementById("crops");
let levelArrays = [ // First Array: Crops, Second Number: Grid Size, Third Array: Wall Cordinates
  [["tomato"], 1,[]],
  [["tomato", "tomato"],4,[[0,1], [1,0]]],
  [["tomato", "carrot"], 4,[[1,1]]],
  [["carrot", "tomato", "carrot"], 9,[[0,1],[1,2],[2,0]]],
  [["watermelon", "watermelon", "beetroot", "carrot"], 16,[[2,0],[3,0],[1,2],[1,3]]],
  [["carrot", "carrot", "beetroot","tomato"], 9,[[0,2],[2,0]]],
  [["carrot", "carrot", "carrot", "beetroot", "watermelon", "watermelon", "tomato"], 25,[[0,0],[1,0],[0,4],[2,3],[4,0],[4,4]]],
  [["tomato","tomato","carrot","carrot","watermelon","beetroot","beetroot"], 16,[[1,3],[1,0]]],
  [["tomato"], 9,[]],
  [["tomato"], 9,[]],
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

      console.log("Okay Bro")
      document.querySelectorAll('.crop').forEach((crop) => {
        crop.style.zIndex = "1"
      })
      
      offsetX = event.clientX - parseInt(leftPos)
      offsetY = event.clientY - parseInt(topPos)
      
      selectedCropNode = element

      element.style.zIndex = "2"

      mouseHighlight.style.width = elementRect.width
      mouseHighlight.style.aspectRatio = elementStyles.aspectRatio
      mouseHighlight.style.left = "0px"
      mouseHighlight.style.top = "0px"
      overlappedSlots = []
    });
  });
}

// closeBackground.onmousedown = () => {
  //   cropHolderToggle = !cropHolderToggle
  //   if (cropHolderToggle) {
    //     cropsDiv.style.translate = "-50% 110%"
    //     closeBackground.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-340 343-203q-20 20-48 20t-47-21q-20-20-20-47.5t20-47.5l184-184q9-9 22-14.5t26-5.5q13 0 26 5.5t22 14.5l184 184q20 20 20 47.5T712-204q-20 20-47.5 20T616-204L480-340Zm0-299L343-502q-20 20-48 20t-47-20q-20-20-20-47.5t20-47.5l184-185q9-9 22-14.5t26-5.5q13 0 26 5.5t22 14.5l184 185q20 20 20 47.5T712-502q-20 20-47.5 20T617-502L480-639Z"/></svg>'
    //   }else {
      //     cropsDiv.style.translate = "-50% 0%"
      //     closeBackground.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m480-321 137-137q20-20 48-20t47 20q20 20 20 47.5T712-363L528-178q-9 9-22 14.5t-26 5.5q-13 0-26-5.5T432-178L248-363q-20-20-19.5-48t19.5-47q20-20 48-20t47 20l137 137Zm0-299 137-137q20-20 48-20t47 21q20 20 20 47.5T712-661L528-477q-9 9-22 14.5t-26 5.5q-13 0-26-5.5T432-477L248-661q-20-20-19.5-47.5T248-756q20-21 48-21t48 21l136 136Z"/></svg>'
      //   }
      // }
      
document.addEventListener("mousemove", (e) => {
  if (!dragging || selectedCropNode == null) {return};
  
  selectedCropNode.style.left = `${e.clientX-offsetX}px`;
  selectedCropNode.style.top = `${e.clientY-offsetY}px`;
  selectedCropNode.classList.remove("placed");

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
  selectedCropNode.recordedWidth = type.width;
  selectedCropNode.recordedHeight = type.height;
  const cropOverlap = getOverlappingElements(selectedCropNode, '.slot')
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
    chosenSlot = null;
    mouseHighlight.style.left = "-50%";
  }
  if (cropOverlap.length <= 0) {
    chosenSlot = null;
    mouseHighlight.style.left = "-50%";
  }
  if (chosenSlot != null) {
    const overlappedRect = chosenSlot.getBoundingClientRect();
    
    let nodeRect = selectedCropNode.getBoundingClientRect();
    mouseHighlight.style.left = overlappedRect.left - highlightOffsetX
    mouseHighlight.style.top = overlappedRect.top - highlightOffsetY
    mouseHighlight.style.width = `${nodeRect.width}px`
    mouseHighlight.style.height = `${nodeRect.height}px`
    // console.log(`${nodeRect.width}px`, `${nodeRect.height}px`, `${overlappedRect.left - highlightOffsetX}`, `${overlappedRect.top - highlightOffsetY}`)
  }
  
  const overlapSlots = getOverlappingElements(mouseHighlight, '.slot')
  if (overlapSlots.length > 0) {
    for (slot of overlappedSlots) {
      if (overlapSlots.indexOf(slot) == -1) {
        slot.style.backgroundColor = "#996237"
      }
    }
    
    for (slot of overlapSlots) {
      slot.style.backgroundColor = "#744521"
    }
  } else {
    for (slot of overlappedSlots) {
      slot.style.backgroundColor = "#996237"
    }
  }
  overlappedSlots = overlapSlots
});

document.addEventListener("mouseup", () => {
  dragging = false;
  
  if (chosenSlot != null && selectedCropNode != null) {
    const overlapping = getOverlappingElements(mouseHighlight, '.crop');
    let cancel = false;
    overlapping.forEach((crop) => {
      if (crop != selectedCropNode && crop.classList.contains("placed")) {
        cancel = true;
        return;
      };
    });
    if (cancel) {return}
    
    const type = cropTypes.find(cropType => {return cropType.name === selectedCropType})
    overlappedSlots = getOverlappingElements(mouseHighlight, '.slot');
    
    const slotCount = type.height*type.width;
    if (overlappedSlots.length < slotCount) {return;};
    
    selectedCropNode.classList.add("placed")

    let placed = actionSounds.placed
    placed.currentTime = 0
    placed.volume = 0.5
    placed.play()
    console.log("lalala")
    
    let averageX = 0
    let averageY = 0
    overlappedSlots.forEach((slot) => {
      slot.style.backgroundColor = "#996237";
      
      const slotRect = slot.getBoundingClientRect();
      averageX += slotRect.left - (type.width > 1 ? slotRect.width/2 : 0)
      averageY += slotRect.top - (type.height > 1 ? slotRect.height/2 : 0)
    })
    
    selectedCropNode.style.left = averageX / overlappedSlots.length;
    selectedCropNode.style.top = averageY / overlappedSlots.length;
    selectedCropNode.cropPosition = chosenSlot;
    selectedCropNode.placed = true;
    selectedCropNode.style.zIndex = "1"
    overlappedSlots = [];
  }
  
  selectedCropNode = null;
});

function getOverlappingElements(targetElement, selected_class) {
  const allElements = document.querySelectorAll(selected_class);
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
  let levelSelector = document.querySelector(".level-selection-holder");
  levelSelector.classList.toggle("hidden");
  if(!levelSelector.classList.contains("hidden")) {
    showWinScreen(false);
  }
}

let setLevel = (index) => {
  level = index
  levelText.innerText = `level ${level+1}`

  mouseHighlight.style.left = "0%";
  mouseHighlight.style.top = "0%";

  document.documentElement.style.setProperty('--child-count', levelArrays[index][1]);
  document.querySelectorAll('.crop').forEach(crop => {
    crop.remove();
  })
  document.querySelector('.placement-grid').replaceChildren();
  let currentCords = [0,0]
  const laneSize = Math.sqrt(levelArrays[index][1])
  for (let i = 0; i < levelArrays[index][1]; i++) {
    // currentCords = [0,0]
    const newSlot = document.createElement("div");
    let isWall = false;
    if (levelArrays[index][2].length > 0) {
      levelArrays[index][2].forEach(cord => {
        if (currentCords[0] == cord[0] && currentCords[1] == cord[1]) {
          isWall = true;
        }
      })
    }
    if (currentCords[0] < laneSize-1) {
      currentCords[0]++;
    } else {
      currentCords[0] = 0;
      currentCords[1]++;
    }
    if (isWall) {newSlot.className = "wall";} else {newSlot.className = "slot";}
    document.querySelector(".placement-grid").appendChild(newSlot);
  };
  
  cropsDiv.replaceChildren();
  let levelArray = levelArrays[index][0]
  levelArray.forEach((crop, cropIndex) => {
    const cropDiv = document.createElement("div");
    const backgroundRect = cropsDiv.getBoundingClientRect();
    
    // console.log(backgroundRect.height, backgroundRect.top)
    
    cropDiv.classList.add(crop);
    cropDiv.classList.add("crop");
    cropDiv.style.left = `calc(${backgroundRect.left}px + ${cropIndex * 20}vh)`;
    cropDiv.style.top = `${backgroundRect.top}px`;
    const type = cropTypes.find(cropType => {return cropType.name === crop})
    cropDiv.recordedHeight = type.height;
    cropDiv.recordedWidth = type.width;
    cropDiv.placed = false;
    
    document.body.append(cropDiv);
    
    const slotSize = document.querySelector(".slot").getBoundingClientRect();
    
    cropDiv.addEventListener("mousedown", (event) => {
      dragging = true;
      chosenSlot = null;
      cropDiv.placed = false;

      let pickup = actionSounds.pickup;
      pickup.currentTime = 0;
      pickup.play();

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
    resizeCrop(cropDiv);
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

window.addEventListener("resize", () => {
  const crops = document.querySelectorAll(".crop");
  crops.forEach(crop => {
    resizeCrop(crop)
    repositionCrop(crop)
  })
})

function resizeCrop(crop) {
  const cropHeight = crop.recordedHeight;
  const cropWidth = crop.recordedWidth;
  const rect = document.querySelector(".slot").getBoundingClientRect();
  const styles = window.getComputedStyle(crop);
  const width = 
  parseFloat(rect.width * cropWidth)
   - parseFloat(styles.borderLeftWidth)
   - parseFloat(styles.borderRightWidth)
  const height =
  parseFloat(rect.height * cropHeight)
  - parseFloat(styles.borderTopWidth)
  - parseFloat(styles.borderBottomWidth)
   crop.style.height = height + "px"
   crop.style.width = width + "px"
   console.log("resized");
  }
  
function repositionCrop(crop) {
  const cropPosition = crop.cropPosition;
  if(cropPosition){
    const slotRect = cropPosition.getBoundingClientRect();

    crop.style.left = slotRect.left + "px";
    crop.style.top = slotRect.top + "px";
  }
}

const submitButton = document.querySelector("#submit");
submitButton.addEventListener("click", () => {
  const crops = document.querySelectorAll(".crop");
  let failed = false;
  crops.forEach(crop => {
    if(!crop.classList.contains("placed")){
      failed = true;
    }
  })
  if(failed){
    levelLose()
  }
  else {
    levelWin()
  }
})

const winSoundEffects = [
  new Audio("../assets/win/yay.mp3"),  
  new Audio("../assets/win/yippee.mp3"),  
  new Audio("../assets/win/youWon.mp3"),
]
const winVolumes = [
  1,
  1,
  1,
]

function levelWin() {
  winSoundEffects.forEach(sound => {
    sound.pause();
    sound.currentTime = 0;
  })
  const randomNumber =  Math.floor(Math.random() * winSoundEffects.length);

  const soundEffect = winSoundEffects[randomNumber];
  // soundEffect.volume = winVolumes[randomNumber];

  soundEffect.play();
  showWinScreen(true);

  confetti({
    particleCount: 150,
    spread: 130,
    origin: {y: 0},
    startVelocity: 50,
    ticks: 100,
    gravity: 10,
  })
  confetti({
    particleCount: 150,
    spread: 360,
    origin: {y: 0},
    startVelocity: 20,
    ticks: 100,
    gravity: 10,
  })
  confetti({
    particleCount: 150,
    spread: 360,
    origin: {y: 0},
    startVelocity: 50,
    ticks: 100,
    gravity: 10,
  })
}

const loseSoundEffects = [
  new Audio("../assets/loss/deathBell.mp3"),
  new Audio("../assets/loss/emotionalDamage.mp3"),
  new Audio("../assets/loss/failure.mp3"),
  new Audio("../assets/loss/jesus.mp3"),
  new Audio("../assets/loss/vineBoom.mp3"),
  new Audio("../assets/loss/wrong.mp3"),
]
const loseVolumes = [
  0.3,
  0.15,
  0.3,
  1,
  0.4,
  0.4,
]

function levelLose() {
  loseSoundEffects.forEach(sound => {
    sound.pause();
    sound.currentTime = 0;
  })
  
  const randomNumber = Math.floor(Math.random() * loseSoundEffects.length);

  const soundEffect = loseSoundEffects[randomNumber];
  // soundEffect.volume = loseVolumes[randomNumber];

  soundEffect.play();
}

const winScreen = document.getElementById("winScreen");
function showWinScreen(show) {
  if(show) {
    winScreen.classList.remove("hidden");
  } else {
    winScreen.classList.add("hidden");
  }
}

const retryButton = document.getElementById("retryButton");
const nextButton = document.getElementById("nextButton");
function winScreenButtons() {
  retryButton.addEventListener("click", () => {
    showWinScreen(false);
    setLevel(level);
  })
  nextButton.addEventListener("click", () => {
    showWinScreen(false);
    let levelButtonCount = document.querySelectorAll(".level-option").length;
    if(level + 1 < levelButtonCount) {
      setLevel(level + 1);
    }
  })
}
winScreenButtons();
