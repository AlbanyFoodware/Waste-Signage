// Selecting a template
document.querySelectorAll('#template-selection button').forEach(button => {
    button.addEventListener('click', () => {
      const canvas = document.getElementById('canvas-area');
      console.log(`Template button clicked: ${button.id}`);
  
      // Remove any existing template classes
      canvas.classList.remove('compost', 'recycling', 'landfill');
      console.log('Removed existing template classes from canvas.');
  
      // Clear the current content on the canvas
      canvas.innerHTML = '';
      console.log('Cleared canvas content.');
  
      // Add the class for the selected template
      if (button.id === 'compost-template') {
        canvas.classList.add('compost');
        console.log('Added compost template class.');
        updateCanvasForTemplate('compost');
      } else if (button.id === 'recycling-template') {
        canvas.classList.add('recycling');
        console.log('Added recycling template class.');
        updateCanvasForTemplate('recycling');
      } else if (button.id === 'landfill-template') {
        canvas.classList.add('landfill');
        console.log('Added landfill template class.');
        updateCanvasForTemplate('landfill');
      }
    });
  });
  
  // Function to update canvas based on template
  function updateCanvasForTemplate(templateType) {
    const canvas = document.getElementById('canvas-area');
    console.log(`Updating canvas for template: ${templateType}`);
  
    // Define the content for each template
    const title = document.createElement('p');
    title.style.fontFamily = 'Times New Roman, serif';  // Set the font to Times New Roman
    title.style.fontSize = '24px';  // Set a large font size for the title
    title.style.position = 'absolute';
    title.style.top = '20px';  // Position at the top of the canvas
    title.style.left = '50%';
    title.style.transform = 'translateX(-50%)';  // Center horizontally
  
    // Set canvas size to match a 3:1 ratio
    canvas.style.width = '510px';  // Width of the canvas (3:1 ratio)
    canvas.style.height = '680px'; // Height of the canvas (3:1 ratio)
    console.log('Canvas size updated to 510px by 680px (3:1 ratio).');
  
    if (templateType === 'compost') {
      // Add a green border for compost
      canvas.style.border = '10px solid green';  // Thick green border
      title.textContent = "Compost";
      title.style.color = 'green';  // Title color matches the border color
      console.log('Compost template applied: Green border and title color.');
      canvas.appendChild(title);
    } else if (templateType === 'recycling') {
      // Add a blue border for recycling
      canvas.style.border = '10px solid blue';  // Thick blue border
      title.textContent = "Recycling";
      title.style.color = 'blue';  // Title color matches the border color
      console.log('Recycling template applied: Blue border and title color.');
      canvas.appendChild(title);
    } else if (templateType === 'landfill') {
      // Add a black border for landfill
      canvas.style.border = '10px solid black';  // Thick black border
      title.textContent = "Landfill";
      title.style.color = 'black';  // Title color matches the border color
      console.log('Landfill template applied: Black border and title color.');
      canvas.appendChild(title);
    }
  }
  
  // Get references to canvas and upload input
  const canvas = document.getElementById('canvas-area');
  console.log('Canvas element retrieved:', canvas);
  
  // Make items draggable (foodware images)
  document.querySelectorAll('.preset-item').forEach(img => {
    img.setAttribute('draggable', true);
    console.log(`Making image draggable: ${img.src}`);
  
    img.addEventListener('dragstart', event => {
      event.dataTransfer.setData('text/plain', event.target.src);
      event.dataTransfer.effectAllowed = 'move';
      console.log('Drag started for image:', event.target.src);
    });
  });
  
  // Single makeInteractive function definition
  function makeInteractive(img) {
    // Variables for interactions
    let isDragging = false;
    let isResizing = false;
    let isRotating = false;
    let rotation = 0;
    let startX, startY;
    let originalWidth, originalHeight;

    // Create container and controls wrapper
    const container = document.createElement('div');
    container.className = 'canvas-image-container';
    container.style.position = 'absolute';
    container.style.transformOrigin = 'center center';
    
    // Create a wrapper for the image and controls that will rotate together
    const rotationWrapper = document.createElement('div');
    rotationWrapper.style.position = 'relative';
    rotationWrapper.style.width = 'fit-content';
    rotationWrapper.style.transformOrigin = 'center center';
    
    const controlsWrapper = document.createElement('div');
    controlsWrapper.className = 'controls-wrapper hidden'; // Start hidden
    controlsWrapper.style.position = 'absolute';
    controlsWrapper.style.top = '-30px';
    controlsWrapper.style.left = '0';
    controlsWrapper.style.width = '100%';
    controlsWrapper.style.display = 'none'; // Start with display none
    controlsWrapper.style.justifyContent = 'center';
    controlsWrapper.style.gap = '5px';

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.title = 'Delete';
    deleteBtn.addEventListener('click', () => {
        container.remove();
    });

    // Create rotate button with free rotation
    const rotateBtn = document.createElement('button');
    rotateBtn.className = 'rotate-btn';
    rotateBtn.innerHTML = '↻';
    rotateBtn.title = 'Rotate';

    let startAngle = 0;
    let currentRotation = 0;

    rotateBtn.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isRotating = true;
        
        const rect = img.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

        function onMouseMove(e) {
            if (!isRotating) return;
            
            const newAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            const angleDiff = newAngle - startAngle;
            const degrees = angleDiff * (180 / Math.PI);
            
            currentRotation += degrees;
            rotationWrapper.style.transform = `rotate(${currentRotation}deg)`;
            
            startAngle = newAngle;
        }

        function onMouseUp() {
            isRotating = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // Create resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.innerHTML = '↘️';
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.bottom = '-10px';
    resizeHandle.style.right = '-10px';
    resizeHandle.style.cursor = 'se-resize';
    resizeHandle.style.display = 'none'; // Start hidden

    // Add resize functionality
    resizeHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isResizing = true;
        originalWidth = img.offsetWidth;
        originalHeight = img.offsetHeight;
        startX = e.clientX;
        startY = e.clientY;
        
        function onMouseMove(e) {
            if (!isResizing) return;
            const deltaX = e.clientX - startX;
            const newWidth = originalWidth + deltaX;
            
            if (newWidth > 50) {
                img.style.width = `${newWidth}px`;
                img.style.height = 'auto';
            }
        }
        
        function onMouseUp() {
            isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // Add drag functionality
    img.addEventListener('mousedown', (e) => {
        if (isRotating || isResizing) return;
        e.preventDefault();
        isDragging = true;
        startX = e.clientX - container.offsetLeft;
        startY = e.clientY - container.offsetTop;
        container.style.zIndex = '1000';

        function onMouseMove(e) {
            if (!isDragging) return;
            container.style.left = `${e.clientX - startX}px`;
            container.style.top = `${e.clientY - startY}px`;
        }

        function onMouseUp() {
            isDragging = false;
            container.style.zIndex = '1';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // Selection functionality
    img.addEventListener('click', (e) => {
        e.stopPropagation();
        // Hide all other control wrappers and resize handles
        document.querySelectorAll('.controls-wrapper, .resize-handle').forEach(el => {
            el.style.display = 'none';
        });
        // Show this image's controls and resize handle
        controlsWrapper.style.display = 'flex';
        resizeHandle.style.display = 'block';
    });

    // Add elements to container
    controlsWrapper.appendChild(deleteBtn);
    controlsWrapper.appendChild(rotateBtn);
    
    rotationWrapper.appendChild(img);
    rotationWrapper.appendChild(controlsWrapper);
    rotationWrapper.appendChild(resizeHandle);
    container.appendChild(rotationWrapper);

    // Click outside to hide controls
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            controlsWrapper.style.display = 'none';
            resizeHandle.style.display = 'none';
        }
    });

    return container;
  }

  // Handle drop events on the canvas
  canvas.addEventListener('dragover', event => {
    event.preventDefault();
    console.log('Dragover event detected on canvas.');
  });
  
  // Handle drop events on the canvas for preselected foodware images
  canvas.addEventListener('drop', event => {
    event.preventDefault();
    console.log("Dropped an image.");
  
    const imageSrc = event.dataTransfer.getData('text/plain');
    console.log('Image source retrieved from data transfer:', imageSrc);
  
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.style.width = '100px';
      img.style.cursor = 'move';
      img.classList.add('canvas-item');
      
      img.onload = () => {
        const container = makeInteractive(img, canvas);
        
        const rect = canvas.getBoundingClientRect();
        container.style.position = 'absolute';
        container.style.left = `${event.clientX - rect.left - 50}px`;
        container.style.top = `${event.clientY - rect.top - 50}px`;
        
        canvas.appendChild(container);
        console.log('New image added to canvas successfully');
      }
    }
  });
  
  // Get references to the button and input for uploading images
  const uploadButton = document.getElementById('upload-btn');
  const uploadInput = document.getElementById('upload-input');
  
  uploadButton.addEventListener('click', () => {
    uploadInput.click();
    console.log('Upload button clicked, triggering file input.');
  });
  
  uploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const canvasElement = document.getElementById('canvas-area');
    console.log('File selected:', file);
    
    if (file && canvasElement) {
      console.log('Creating new image from file');
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.style.width = '100px';
      img.style.cursor = 'move';
      img.classList.add('canvas-item');

      img.onload = () => {
        console.log('Image loaded successfully');
        try {
          const container = makeInteractive(img, canvasElement);
          canvasElement.appendChild(container);
          console.log('Image added to canvas successfully');
        } catch (error) {
          console.error('Error adding image to canvas:', error);
        }
      };

      img.onerror = () => {
        console.error('Error loading image');
        URL.revokeObjectURL(img.src);
      };
    } else {
      console.error('No file selected or canvas not found');
    }
  });
  
  const presetImages = Array.from({length: 22}, (_, i) => `Foodware Images/image${i + 1}.jpg`);

  function generatePresetGallery() {
    const gallery = document.querySelector('.preset-images');
    
    presetImages.forEach((imagePath, index) => {
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Foodware Item ${index + 1}`;
        img.className = 'preset-item';
        img.setAttribute('draggable', true);
        
        gallery.appendChild(img);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    generatePresetGallery();
    
    const downloadButton = document.querySelector('#download button');
    if (downloadButton) {
        downloadButton.addEventListener('click', async () => {
            try {
                downloadButton.disabled = true;
                downloadButton.textContent = 'Generating PDF...';
                
                const canvas = document.getElementById('canvas-area');
                
                // Hide all control wrappers and resize handles before capturing
                const controls = canvas.querySelectorAll('.controls-wrapper, .resize-handle');
                controls.forEach(control => {
                    control.style.display = 'none';
                });
                
                const canvasImage = await html2canvas(canvas, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                });

                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'px',
                    format: [510, 680]
                });

                const imgData = canvasImage.toDataURL('image/png');
                doc.addImage(imgData, 'PNG', 0, 0, 510, 680);
                
                doc.save('waste-flow-sign.pdf');
                
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Error generating PDF. Please try again.');
            } finally {
                downloadButton.disabled = false;
                downloadButton.textContent = 'Download Sign as PDF';
            }
        });
    }
  });

  document.querySelectorAll('.preset-item').forEach(img => {
    img.addEventListener('mousedown', event => {
        event.preventDefault();
        const canvasElement = document.getElementById('canvas-area');
        const rect = canvasElement.getBoundingClientRect();
        
        const newImg = new Image();
        newImg.src = img.src;
        newImg.style.width = '100px';
        newImg.style.cursor = 'move';
        newImg.classList.add('canvas-item');
        
        newImg.onload = () => {
            const container = makeInteractive(newImg, canvasElement);
            container.style.left = `${event.clientX - rect.left - 50}px`;
            container.style.top = `${event.clientY - rect.top - 50}px`;
            canvasElement.appendChild(container);
        };
    });
  });