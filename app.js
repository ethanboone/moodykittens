



/**
 * Stores the list of kittens
 * @type {Kitten[]}
 */
let namesArray = []
let kittens = [];
let kitten = {}
/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * you can use robohash for images

**/

function addKitten(event) {
  event.preventDefault()
  let form = event.target
  let name = form.name.value

  if (namesArray.indexOf(name) > -1) {
    alert("You already have this kitten!")
    saveKittens()
    form.reset()
  } else {
    if (document.getElementById("welcome") != null) {
      getStarted()
    }
    let kittenIcon = "https://robohash.org/" + name + "?set=set4"

    kitten = kittens.find(kitten => kitten.name == name)

    if (!kitten) {
      kitten = {
        id: generateId(),
        name: name,
        image: kittenIcon,
        affection: 5,
        mood: " Tolerant",
        catnipCount: 0
      }
      kittens.push(kitten)
    }

    namesArray.push(kitten.name)
    saveKittens()
    form.reset()
  }
}
/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
  window.localStorage.setItem("kittens", JSON.stringify(kittens))
  window.localStorage.setItem("Names", JSON.stringify(namesArray))
  drawKittens()
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let kittenData = JSON.parse(window.localStorage.getItem("kittens"))
  if (kittenData.length != null && kittenData.length > kittens.length) {
    kittens = kittenData
  }
  let namesArrayData = JSON.parse(window.localStorage.getItem("Names"))
  if (namesArrayData.length != null && namesArrayData.length > namesArray.length) {
    namesArray = namesArrayData
  }
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  let kittenElement = document.getElementById("kittenTemplate")
  let kittenTemplate = ""

  kittens.forEach(kitten => {
    kittenTemplate += `
    <div id="template" class="d-flex container card m-2">
      <div id="kittens" class=" kitten${kitten.mood}">
        <div class="text-center p-1">
        <img src="${kitten.image}" height="100px" class="${kitten.affection == 0 ? 'kittenGone' : ''}">
          <p>
            <div>${kitten.name}<br>${kitten.affection == 0 ? 'Your kitten ran away!' : ''}</div>
            <div class="${kitten.affection == 0 ? 'hidden' : ''}">Mood:${kitten.mood}<br></div>
            <div class="${kitten.affection == 0 ? 'hidden' : ''}">Affection: ${kitten.affection}</div>
          </p>
          <button class="${kitten.affection == 0 ? 'hidden' : ''} text-light" onclick="pet('${kitten.id}')">PET</button>
          <button id="catnip" class="catnipButton${kitten.catnipCount} ${kitten.affection == 0 ? 'hidden' : ''}" onclick="catnip('${kitten.id}')">CATNIP</button>
        </div>
      </div>
    </div>
      `
  })
  kittenElement.innerHTML = kittenTemplate
}



/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  let findKitten = kittens.findIndex(kitten => kitten.id == id);
  //console.log(kittens.findIndex(kitten => kitten.id == id))
  if (findKitten == -1) {
    throw new Error("Kitten not found")
  } else {
    return kittens[findKitten]
  }
}

function findId(id) {
  return kittens.find(kitten => kitten.id == id)
}

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .7
 * increase the kittens affection
 * otherwise decrease the affection
 * save the kittens
 * @param {string} id
 */
function pet(id) {
  kitten = findKittenById(id)
  let randomNumber = Math.random()
  if (randomNumber < .7 && kitten.affection > 0) {
    kitten.affection--;
    if (kitten.affection == 0) {

    }
  } else if (randomNumber >= .7 && kitten.affection < 10) {
    kitten.affection++;
  }
  setKittenMood(id)
  saveKittens()
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
* Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */
function catnip(id) {
  let catnipLimit = 3
  let kittenIndex = kittens.findIndex(kittens => kittens.id == id)
  let catnipClass = document.getElementById("catnip")
  if (kittens[kittenIndex].catnipCount < 3) {
    kittens[kittenIndex].affection = 5
    kittens[kittenIndex].mood = "Tolerant"
    kittens[kittenIndex].catnipCount++
  } else if (kittens[kittenIndex].catnipCount == 3) {
    kittens[kittenIndex].catnipCount++
  } else {
    alert("You are out of catnip!")
  }
  saveKittens()
}

/**
 * Sets the kittens mood based on its affection
 * Happy > 6, Tolerant <= 5, Angry <= 3, Gone <= 0
 * @param {Kitten} kitten
 */
function setKittenMood(id) {
  let index = kittens.findIndex(kitten => kitten.id == id)
  let kittenClasses = document.getElementById("kittens")
  let kitten = kittens[index]
  let kittenMood = kitten.affection
  if (kittenMood <= 5 && kittenMood > 3) {
    kitten.mood = " Tolerant"
  } else if (kittenMood >= 6) {
    kitten.mood = " Happy"
  } else if (kittenMood <= 3 && kittenMood > 0) {
    kitten.mood = " Angry"
  } else if (kittenMood == 0) {
    kitten.mood = "Gone"
  }
  saveKittens()
}


function getStarted() {
  document.getElementById("welcome").remove();
  if (kittens.length == 0 && JSON.parse(window.localStorage.getItem("kittens")) != null) {
    loadKittens()
    drawKittens()
  }
}

function removeKittens() {
  let kittenTotal = kittens.length
  let nameTotal = namesArray.length
  kittens.splice(0, kittenTotal)
  namesArray.splice(0, nameTotal)
  window.localStorage.removeItem("kittens")
}

/**
 * Defines the Properties of a Kitten
 * @typedef {{id: string, name: string, mood: string, affection: number}} Kitten
 */

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
  );
}

