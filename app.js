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
  function makeInteractive(img, canvasElement) {
    let isDragging = false;
    let isResizing = false;
    let isRotating = false;
    let rotation = 0;
    let startX, startY;
    let originalWidth, originalHeight;
    let lastAngle = 0;

    // Create container
    const container = document.createElement('div');
    container.className = 'canvas-image-container';
    container.style.position = 'absolute';

    // Create controls wrapper
    const controlsWrapper = document.createElement('div');
    controlsWrapper.className = 'controls-wrapper hidden';

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.title = 'Delete';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        container.remove();
    });

    // Create rotate button
    const rotateBtn = document.createElement('button');
    rotateBtn.className = 'rotate-btn';
    rotateBtn.innerHTML = '↻';
    rotateBtn.title = 'Drag to rotate';

    // Calculate angle between two points
    function getAngle(center, point) {
        return Math.atan2(point.y - center.y, point.x - center.x) * 180 / Math.PI;
    }

    // Rotation handlers
    rotateBtn.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isRotating = true;
        
        const rect = img.getBoundingClientRect();
        const center = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
        
        lastAngle = getAngle(center, { x: e.clientX, y: e.clientY });
        
        function handleRotation(e) {
            if (!isRotating) return;

            const currentAngle = getAngle(center, { x: e.clientX, y: e.clientY });
            let deltaAngle = currentAngle - lastAngle;

            if (deltaAngle > 180) deltaAngle -= 360;
            if (deltaAngle < -180) deltaAngle += 360;

            rotation += deltaAngle;
            img.style.transform = `rotate(${rotation}deg)`;
            controlsWrapper.style.transform = `rotate(${rotation}deg)`;
            
            lastAngle = currentAngle;
        }

        function stopRotation() {
            isRotating = false;
            document.removeEventListener('mousemove', handleRotation);
            document.removeEventListener('mouseup', stopRotation);
        }

        document.addEventListener('mousemove', handleRotation);
        document.addEventListener('mouseup', stopRotation);
    });

    // Create resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.innerHTML = '↘️';

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
        document.querySelectorAll('.canvas-image-container').forEach(cont => {
            if (cont !== container) {
                cont.querySelector('.controls-wrapper').classList.add('hidden');
                cont.classList.remove('selected');
            }
        });
        controlsWrapper.classList.remove('hidden');
        container.classList.add('selected');
    });

    // Add elements to container
    controlsWrapper.appendChild(deleteBtn);
    controlsWrapper.appendChild(rotateBtn);
    controlsWrapper.appendChild(resizeHandle);
    container.appendChild(img);
    container.appendChild(controlsWrapper);

    // Click outside to deselect
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            controlsWrapper.classList.add('hidden');
            container.classList.remove('selected');
        }
    });

    return container;
  }

  // Handle drop events on the canvas
  canvas.addEventListener('dragover', event => {
    event.preventDefault(); // Allow dropping
    console.log('Dragover event detected on canvas.');
  });
  
  // Handle drop events on the canvas for preselected foodware images
  canvas.addEventListener('drop', event => {
    event.preventDefault();
    console.log("Dropped an image.");
  
    const imageSrc = event.dataTransfer.getData('text/plain');
    console.log('Image source retrieved from data transfer:', imageSrc);
  
    if (imageSrc) {
      // Create a new image element
      const img = document.createElement('img');
      img.src = imageSrc;
      img.style.width = '100px'; // Default size
      img.style.cursor = 'move';
      img.classList.add('canvas-item');
      
      // Create interactive container
      const container = makeInteractive(img, canvas);
      
      // Position container where the image was dropped
      const rect = canvas.getBoundingClientRect();
      container.style.left = `${event.clientX - rect.left - 50}px`;
      container.style.top = `${event.clientY - rect.top - 50}px`;
      
      // Append container to canvas
      canvas.appendChild(container);
      console.log('New image added to canvas successfully');
    }
  });
  
  // Get references to the button and input for uploading images
  const uploadButton = document.getElementById('upload-btn');
  const uploadInput = document.getElementById('upload-input');
  
  // Show the file input when the upload button is clicked
  uploadButton.addEventListener('click', () => {
    uploadInput.click(); // Programmatically trigger the file input
    console.log('Upload button clicked, triggering file input.');
  });
  
  // Updated upload handler
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
        URL.revokeObjectURL(img.src); // Clean up the object URL
      };
    } else {
      console.error('No file selected or canvas not found');
    }
  });
  
  // Array of preset images
  const presetImages = Array.from({length: 22}, (_, i) => `Foodware Images/image${i + 1}.jpg`);

  // Function to generate preset image gallery
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

  // Initialize the gallery when the page loads
  document.addEventListener('DOMContentLoaded', generatePresetGallery);

  // Make preset images interactive
  document.querySelectorAll('.preset-item').forEach(img => {
    img.addEventListener('mousedown', event => {
        event.preventDefault();
        const canvasElement = document.getElementById('canvas-area');
        const rect = canvasElement.getBoundingClientRect();
        
        // Create new image for the canvas
        const newImg = new Image();
        newImg.src = img.src;
        newImg.style.width = '100px';
        newImg.style.cursor = 'move';
        newImg.classList.add('canvas-item');
        
        // Wait for image to load before adding to canvas
        newImg.onload = () => {
            const container = makeInteractive(newImg, canvasElement);
            container.style.left = `${event.clientX - rect.left - 50}px`;
            container.style.top = `${event.clientY - rect.top - 50}px`;
            canvasElement.appendChild(container);
        };
    });
  });