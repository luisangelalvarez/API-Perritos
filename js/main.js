const breedDropdown = document.getElementById('breeds');
const dogContainer = document.getElementById('dogContainer');
let allBreeds = []; // Almacenar todas las razas inicialmente

// Función para agregar cada raza al menú desplegable
function addBreedOption(breed) {
  const option = document.createElement('option');
  option.value = breed;
  option.textContent = breed;
  breedDropdown.appendChild(option);
}

// Función para mostrar cuatro imágenes de la raza seleccionada
function getDogByBreed(breed) {
  fetch(`https://dog.ceo/api/breed/${breed}/images/random/4`) // Obtener cuatro imágenes por raza
    .then(response => response.json())
    .then(data => {
      const dogImages = data.message;
      displayDogs(breed, dogImages);
    });
}

// Función para mostrar una imagen por raza
function displayDog(breed, imageUrl) {
  const dogCard = document.createElement('div');
  dogCard.classList.add('dog-card');

  const image = document.createElement('img');
  image.src = imageUrl;
  image.alt = breed + ' image';
  image.classList.add('dog-image');
  //image.onerror(image.style.display="none");
  image.addEventListener('error', function() {
    image.style.display = "none";
    image.parentElement.style.display="none";
  });

  image.addEventListener('click', () => {
    const selectedBreed = breedDropdown.value;
    if (selectedBreed !== breed) {
      breedDropdown.value = breed;
      getDogByBreed(breed);
    }
  });

  const name = document.createElement('p');
  name.textContent = breed;

  dogCard.appendChild(image);
  dogCard.appendChild(name);
  dogContainer.appendChild(dogCard);
}

// Función para mostrar múltiples imágenes por raza
function displayDogs(breed, images) {
  // Limpiar imágenes anteriores
  dogContainer.innerHTML = '';

  images.forEach(imageUrl => {
    const dogCard = document.createElement('div');
    dogCard.classList.add('dog-card');

    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = breed + ' image';
    image.classList.add('dog-image');

    const name = document.createElement('p');
    name.textContent = breed;

    dogCard.appendChild(image);
    dogCard.appendChild(name);
    dogContainer.appendChild(dogCard);
  });
}

// Evento para el cambio en el menú desplegable
breedDropdown.addEventListener('change', function() {
  const selectedBreed = breedDropdown.value;
  getDogByBreed(selectedBreed);
});

// Evento para el botón "Limpiar pantalla"
const clearButton = document.querySelector('input[value="Limpiar pantalla"]');
clearButton.addEventListener('click', function() {
  dogContainer.innerHTML = '';
  breedDropdown.selectedIndex = 0;
});

// Obtener todas las razas y mostrar una imagen por cada una
fetch('https://dog.ceo/api/breeds/list/all')
  .then(response => response.json())
  .then(data => {
    const breeds = Object.keys(data.message);
    breeds.forEach(breed => {
      fetch(`https://dog.ceo/api/breed/${breed}/images/random/1`)
        .then(response => response.json())
        .then(data => {
          const dogImage = data.message;
          displayDog(breed, dogImage);
          addBreedOption(breed); // Agregar cada raza al menú desplegable
        });
    });
  });

// Evento para el botón "Mostrar todas las razas"
const showAllButton = document.getElementById('mostrarTodo');
showAllButton.addEventListener('click', async () => {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    const data = await response.json();
    const breeds = Object.keys(data.message);

    for (const breed of breeds) {
      const breedImageResponse = await fetch(`https://dog.ceo/api/breed/${breed}/images/random/1`);
      const breedImageData = await breedImageResponse.json();
      const breedImage = breedImageData.message;

      if (breedImageData && breedImageData.message) {
        displayDog(breed, breedImage);
      } else {
        console.log(`No se encontraron imágenes para la raza: ${breed}`);
      }
    }
  } catch (error) {
    console.error('Error al obtener todas las razas:', error);
  }
});
