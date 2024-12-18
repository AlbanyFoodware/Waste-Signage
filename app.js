function createDropZones(numZones, preserveExisting = true) {
  const canvas = document.getElementById('canvas-area');
  const existingTitle = canvas.querySelector('p');
  const existingSubtitle = canvas.querySelectorAll('p')[1];
  const existingBottomText = canvas.querySelectorAll('p')[2];
  
  // Store existing images and their positions
  const existingImages = Array.from(document.querySelectorAll('.drop-zone')).map((zone, index) => {
    const img = zone.querySelector('img');
    return img ? { src: img.src, index } : null;
  }).filter(item => item !== null);
  
  canvas.innerHTML = '';
  if (existingTitle) canvas.appendChild(existingTitle);
  if (existingSubtitle) canvas.appendChild(existingSubtitle);
  if (existingBottomText) canvas.appendChild(existingBottomText);
  

  const dropZonesContainer = document.createElement('div');
  dropZonesContainer.className = 'drop-zones-container';
  dropZonesContainer.style.display = 'grid';
  dropZonesContainer.style.width = '100%';
  dropZonesContainer.style.height = '70%';
  dropZonesContainer.style.padding = '20px';
  dropZonesContainer.style.boxSizing = 'border-box';
  dropZonesContainer.style.marginTop = '40px';
  dropZonesContainer.style.position = 'relative';
  dropZonesContainer.style.top = '-20px';
  
  // Configure grid based on number of zones
  if (numZones <= 4) {
    dropZonesContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
    dropZonesContainer.style.gridTemplateRows = 'repeat(2, 1fr)';
  } else if (numZones <= 6) {
    dropZonesContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
    dropZonesContainer.style.gridTemplateRows = 'repeat(3, 1fr)';
  } else {
    dropZonesContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    dropZonesContainer.style.gridTemplateRows = 'repeat(3, 1fr)';
  }
  
  dropZonesContainer.style.gap = '10px';
  
  for (let i = 0; i < numZones; i++) {
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';
    dropZone.style.border = '2px dashed #ccc';
    dropZone.style.display = 'flex';
    dropZone.style.alignItems = 'center';
    dropZone.style.justifyContent = 'center';
    dropZone.style.minHeight = '100px';
    dropZone.style.position = 'relative';
    
    // Restore existing image if there was one in this position
    const existingImage = preserveExisting ? existingImages.find(img => img.index === i) : null;
    if (existingImage) {
      addImageToDropZone(dropZone, existingImage.src);
    } else {
      dropZone.innerHTML = '<p>Drop image here</p>';
    }
    
    // Drop zone event listeners
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      dropZone.style.backgroundColor = 'rgba(0,0,0,0.1)';
    });
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.style.backgroundColor = 'transparent';
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.backgroundColor = 'transparent';
      
      const imageSrc = e.dataTransfer.getData('text/plain');
      if (imageSrc) {
        addImageToDropZone(dropZone, imageSrc);
        
        // Check if we need to add a new zone
        const container = dropZone.parentElement;
        const allZones = container.querySelectorAll('.drop-zone');
        const filledZones = container.querySelectorAll('.drop-zone img');
        if (filledZones.length === allZones.length && allZones.length < 9) {
          createDropZones(allZones.length + 1, true);
        }
      }
    });
    
    dropZonesContainer.appendChild(dropZone);
  }
  
  canvas.appendChild(dropZonesContainer);
}

// Add this event listener to handle zone creation during drag
const canvasArea = document.getElementById('canvas-area');
canvasArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  if (e.dataTransfer.types.includes('text/plain')) {
    const allZones = document.querySelectorAll('.drop-zone');
    const filledZones = document.querySelectorAll('.drop-zone img');
    if (filledZones.length === allZones.length && allZones.length < 9) {
      const newNumZones = allZones.length + 1;
      createDropZones(newNumZones, true);
    }
  }
});

// Function to adjust canvas size based on screen size
function adjustCanvasSize() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const canvas = document.getElementById('canvas-area');
  
  // Calculate dimensions based on viewport size
  const maxWidth = Math.min(screenWidth * 0.45, 510); // Slightly increased from 0.4
  const maxHeight = screenHeight * 0.8; // Use 80% of viewport height
  
  canvas.style.width = `${maxWidth}px`;
  canvas.style.height = `${maxHeight}px`;
  
  // Adjust font sizes based on canvas size
  const scaleFactor = maxWidth / 510; // Use original width as base
  
  // Adjust title and subtitle sizes
  const title = canvas.querySelector('p');
  const subtitle = canvas.querySelectorAll('p')[1];
  
  if (title) {
    title.style.fontSize = `${24 * scaleFactor}px`;
    title.style.top = `${20 * scaleFactor}px`;
  }
  
  if (subtitle) {
    subtitle.style.fontSize = `${16 * scaleFactor}px`;
    subtitle.style.top = `${50 * scaleFactor}px`;
  }
  
  // Adjust drop zones container
  const dropZonesContainer = canvas.querySelector('.drop-zones-container');
  if (dropZonesContainer) {
    dropZonesContainer.style.padding = `${20 * scaleFactor}px`;
    dropZonesContainer.style.marginTop = `${80 * scaleFactor}px`;
    dropZonesContainer.style.gap = `${10 * scaleFactor}px`;
  }
  
  // Adjust delete buttons
  document.querySelectorAll('.delete-button').forEach(btn => {
    const buttonSize = 24 * scaleFactor;
    btn.style.width = `${buttonSize}px`;
    btn.style.height = `${buttonSize}px`;
    btn.style.top = `${-12 * scaleFactor}px`;
    btn.style.right = `${-12 * scaleFactor}px`;
    
    // Adjust X size
    const deleteX = btn.querySelector('span');
    if (deleteX) {
      deleteX.style.fontSize = `${20 * scaleFactor}px`;
    }
  });
}

// Add CSS to the preset images gallery
const gallery = document.querySelector('.preset-images');
if (gallery) {
  gallery.style.display = 'grid';
  gallery.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
  gallery.style.gap = '10px';
  gallery.style.padding = '20px';
  gallery.style.maxHeight = '80vh';
  gallery.style.overflowY = 'auto';
}

// Make preset images responsive
document.querySelectorAll('.preset-item').forEach(img => {
  img.style.width = '100%';
  img.style.height = 'auto';
  img.style.objectFit = 'contain';
  img.style.maxWidth = '100%';
});

// Add resize listener if not already present
window.removeEventListener('resize', adjustCanvasSize); // Remove any existing listeners
window.addEventListener('resize', () => {
  adjustCanvasSize();
  // Debounce the resize event
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(() => {
    adjustCanvasSize();
  }, 250);
});

// Call adjustCanvasSize initially
adjustCanvasSize();

// Template selection
document.querySelectorAll('#template-selection button').forEach(button => {
  button.addEventListener('click', () => {
    const canvas = document.getElementById('canvas-area');
    canvas.classList.remove('compost', 'recycling', 'landfill');
    canvas.innerHTML = '';
    
    if (button.id === 'compost-template') {
      canvas.classList.add('compost');
      updateCanvasForTemplate('compost');
    } else if (button.id === 'recycling-template') {
      canvas.classList.add('recycling');
      updateCanvasForTemplate('recycling');
    } else if (button.id === 'landfill-template') {
      canvas.classList.add('landfill');
      updateCanvasForTemplate('landfill');
    }
    
    createDropZones(4, false);
    adjustCanvasSize();
  });
});

// Function to update canvas based on template
function updateCanvasForTemplate(templateType) {
  const canvas = document.getElementById('canvas-area');
  
  const title = document.createElement('p');
  title.style.fontFamily = 'Times New Roman, serif';
  title.style.fontSize = '24px';
  title.style.position = 'absolute';
  title.style.top = '20px';
  title.style.left = '50%';
  title.style.transform = 'translateX(-50%)';
  title.style.margin = '0';

  const subtitle = document.createElement('p');
  subtitle.style.fontFamily = 'Times New Roman, serif';
  subtitle.style.fontSize = '16px';
  subtitle.style.position = 'absolute';
  subtitle.style.top = '50px';
  subtitle.style.left = '50%';
  subtitle.style.transform = 'translateX(-50%)';
  subtitle.style.whiteSpace = 'nowrap';
  subtitle.style.margin = '0';

  const bottomText = document.createElement('p');
  bottomText.style.fontFamily = 'Times New Roman, serif';
  bottomText.style.fontSize = '16px';
  bottomText.style.position = 'absolute';
  bottomText.style.bottom = '20px';
  bottomText.style.left = '10px';
  bottomText.style.right = '10px';
  bottomText.style.transform = 'none';
  bottomText.style.textAlign = 'center';
  bottomText.style.whiteSpace = 'normal';
  bottomText.style.maxHeight = '60px';
  bottomText.style.lineHeight = '1.3';
  bottomText.style.Width = '99%';
  bottomText.style.width = 'calc(100% - 20px)';
  bottomText.style.overflow = 'hidden';
  bottomText.style.display = '-webkit-box';
  bottomText.style.WebkitLineClamp = '3';
  bottomText.style.WebkitBoxOrient = 'vertical';
  bottomText.style.margin = '0';
  bottomText.style.zIndex = '1';
  bottomText.style.padding = '0 5px';
  bottomText.style.boxSizing = 'border-box';

  if (templateType === 'compost') {
    canvas.style.border = '10px solid green';
    title.textContent = "Compost";
    subtitle.textContent = "Please compost these materials by putting them in the green bin!";
    bottomText.textContent = "Yes = Food scraps, food soiled paper and plant waste. No = Plastic, glass, metal, pet waste or diapers.";
    title.style.color = 'green';
    subtitle.style.color = 'green';
    bottomText.style.color = 'green';
  } else if (templateType === 'recycling') {
    canvas.style.border = '10px solid blue';
    title.textContent = "Recycling";
    subtitle.textContent = "Please recycle these materials by putting them in the blue bin!";
    bottomText.textContent = "Yes = Paper, cardboard, glass, plastic, metal, and aluminum cans. No = Styrofoam, plastic bags, plastic wrap, Styrofoam containers, plastic utensils, and plastic film.";
    title.style.color = 'blue';
    subtitle.style.color = 'blue';
    bottomText.style.color = 'blue';
  } else if (templateType === 'landfill') {
    canvas.style.border = '10px solid black';
    title.textContent = "Landfill";
    subtitle.textContent = "Please put these materials in the black or grey landfill bin!";
    bottomText.textContent = "Yes = plastic bags and wrap, plastic straws and utensils, plastic to-go containers, plastic lined paper, pet waste and diapers. No = food waste, electronics, batteries, recyclables.";
    title.style.color = 'black';
    subtitle.style.color = 'black';
    bottomText.style.color = 'black';
  }

  // Clear any existing content
  canvas.innerHTML = '';
  
  // Add all elements to canvas
  canvas.appendChild(title);
  canvas.appendChild(subtitle);
  canvas.appendChild(bottomText);
}

// Generate preset images
const presetImages = [
  ...Array.from({length: 26}, (_, i) => `Foodware Images/image${i + 1}.jpg`),
];

function generatePresetGallery() {
  const gallery = document.querySelector('.preset-images');
  
  presetImages.forEach((imagePath, index) => {
    const img = document.createElement('img');
    img.src = imagePath;
    img.alt = `Foodware Item ${index + 1}`;
    img.className = 'preset-item';
    img.style.cursor = 'pointer';
    
    img.addEventListener('click', () => {
      const dropZones = document.querySelectorAll('.drop-zone');
      const filledZones = document.querySelectorAll('.drop-zone img');
      
      // If all current zones are filled
      if (filledZones.length === dropZones.length) {
        // Create exactly one more zone for the new image
        createDropZones(filledZones.length + 1, true);
      }
      
      // Get updated list of zones after potential creation
      const currentDropZones = document.querySelectorAll('.drop-zone');
      const emptyZone = Array.from(currentDropZones).find(zone => !zone.querySelector('img'));
      
      if (emptyZone) {
        addImageToDropZone(emptyZone, img.src);
      }
    });
    
    gallery.appendChild(img);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  generatePresetGallery();
  adjustCanvasSize();

  // Add download button functionality
  const downloadButton = document.getElementById('Download Sign as PDF');
  if (downloadButton) {
    downloadButton.addEventListener('click', () => {
      const canvas = document.getElementById('canvas-area');
      
      html2canvas(canvas, {
        backgroundColor: 'white',
        scale: 2,
        useCORS: true,
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [510, 680]  // Match your canvas dimensions
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, 510, 680);
        pdf.save('waste-sorting-sign.pdf');
      });
    });
  }

  const uploadButton = document.getElementById('upload-btn');
  const uploadInput = document.getElementById('upload-input');
  
  if (uploadButton) {
    uploadButton.addEventListener('click', () => {
      uploadInput.click();
    });
    
    uploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageSrc = event.target.result;
          // Find an empty drop zone
          const dropZones = document.querySelectorAll('.drop-zone');
          const emptyZone = Array.from(dropZones).find(zone => !zone.querySelector('img'));
          
          if (emptyZone) {
            addImageToDropZone(emptyZone, imageSrc);
          } else {
            // Create a new zone if needed
            createDropZones(dropZones.length + 1, true);
            const newDropZones = document.querySelectorAll('.drop-zone');
            const newEmptyZone = Array.from(newDropZones).find(zone => !zone.querySelector('img'));
            if (newEmptyZone) {
              addImageToDropZone(newEmptyZone, imageSrc);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
});

function addImageToDropZone(dropZone, imageSrc) {
  const imgContainer = document.createElement('div');
  imgContainer.style.position = 'relative';
  imgContainer.style.width = '100%';
  imgContainer.style.height = '100%';
  imgContainer.style.display = 'flex';
  imgContainer.style.alignItems = 'center';
  imgContainer.style.justifyContent = 'center';

  const img = new Image();
  img.src = imageSrc;
  img.style.maxWidth = '100%';
  img.style.maxHeight = '100%';
  img.style.objectFit = 'contain';
  
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-button';
  deleteBtn.style.position = 'absolute';
  deleteBtn.style.top = '-12px';
  deleteBtn.style.right = '-12px';
  deleteBtn.style.backgroundColor = '#ffffff';
  deleteBtn.style.color = 'red';
  deleteBtn.style.border = '2px solid red';
  deleteBtn.style.width = '24px';
  deleteBtn.style.height = '24px';
  deleteBtn.style.cursor = 'pointer';
  deleteBtn.style.display = 'none';
  deleteBtn.style.alignItems = 'center';
  deleteBtn.style.justifyContent = 'center';
  deleteBtn.style.padding = '1px';
  deleteBtn.style.background = 'white';
  deleteBtn.style.outline = 'none';

  
  const deleteX = document.createElement('span');
  deleteX.textContent = 'x';
  deleteX.style.color = 'red';
  deleteX.style.fontSize = '20px';
  deleteX.style.lineHeight = '20px';
  deleteX.style.fontWeight = 'bold';
  deleteX.style.position = 'relative';
  deleteX.style.display = 'flex';
  deleteX.style.alignItems = 'center';
  deleteX.style.justifyContent = 'center';

  deleteBtn.appendChild(deleteX);

  imgContainer.addEventListener('mouseenter', () => {
    deleteBtn.style.display = 'flex';
  });
  
  imgContainer.addEventListener('mouseleave', () => {
    deleteBtn.style.display = 'none';
  });
  
  deleteBtn.addEventListener('click', () => {
    const container = dropZone.parentElement;
    const allDropZones = container.querySelectorAll('.drop-zone');
    const deletedIndex = Array.from(allDropZones).indexOf(dropZone);
    
    // Only collect actual images, no duplicates
    const existingImages = [];
    Array.from(allDropZones).forEach((zone, index) => {
      const img = zone.querySelector('img');
      if (img && zone !== dropZone) {
        const newIndex = index > deletedIndex ? index - 1 : index;
        existingImages.push({ src: img.src, index: newIndex });
      }
    });
    
    // Create zones with empty placeholders
    const newNumZones = Math.max(4, existingImages.length);
    createDropZones(newNumZones, false);  // Changed to false to prevent duplication
    
    // Only restore actual existing images
    existingImages.forEach(({src, index}) => {
      const zones = document.querySelectorAll('.drop-zone');
      if (zones[index]) {
        addImageToDropZone(zones[index], src);
      }
    });
  });
  
  imgContainer.appendChild(img);
  imgContainer.appendChild(deleteBtn);
  dropZone.innerHTML = '';
  dropZone.appendChild(imgContainer);
}