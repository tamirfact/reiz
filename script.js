document.addEventListener('DOMContentLoaded', function() {
    const boardsContainer = document.querySelector('.boards-container');
    const controlsContainer = document.querySelector('.controls');
    const baseWidth = 800;
    // Track the current mode (0: standard, 1: narrow, 2: wide)
    let boardMode = 0; // Default to standard mode
    
    // Animation timing constants
    const BOARD_ANIMATION_DURATION = 0.1; // Duration for board animations in seconds
    const CALENDAR_ANIMATION_DURATION = 0.3; // Duration for calendar animations in seconds
    
    // Initialize based on body classes
    if (document.body.classList.contains('narrow-mode')) {
        boardMode = 1;
    } else if (document.body.classList.contains('wide-mode')) {
        boardMode = 2;
    }
    
    // Initialize the resize-toggle icon rotation based on current mode
    const resizeToggleBtn = document.getElementById('resizeToggle');
    if (resizeToggleBtn) {
        const iconElement = resizeToggleBtn.querySelector('.material-icons');
        if (boardMode === 1) { // narrow mode
            iconElement.style.transform = 'rotate(90deg)';
        } else if (boardMode === 2) { // wide mode
            iconElement.style.transform = 'rotate(180deg)';
        }
    }
    
    // Define board colors and shapes based on the Objective-C code
    const boardConfigs = [
        { 
            shape: 'stripes', 
            colors: { 
                primary: '#FFE100',   // Yellow
                secondary: '#5E35B1',  // Deep Purple
                off: '#666666'        // Gray for off state
            } 
        },
        { 
            shape: 'split-circle', 
            colors: { 
                primary: '#F4511E',   // Deep Orange
                secondary: '#7CB342',  // Light Green
                off: '#666666'        // Gray for off state
            } 
        },
        { 
            shape: 'capsule', 
            colors: { 
                primary: '#FF6F00',   // Amber
                secondary: '#3949AB',  // Indigo
                off: '#666666'        // Gray for off state
            } 
        },
        { 
            shape: 'square', 
            colors: { 
                primary: '#E53935',   // Red
                secondary: '#0097A7',  // Cyan
                off: '#666666'        // Gray for off state
            } 
        },
        { 
            shape: 'frame-dot', 
            colors: { 
                primary: '#4CAF50',   // Green
                secondary: '#D81B60',  // Pink
                off: '#666666'        // Gray for off state
            } 
        },
        { 
            shape: 'diamonds', 
            colors: { 
                primary: '#1565C0',   // Blue
                secondary: '#00897B',  // Teal
                off: '#666666'        // Gray for off state
            } 
        }
    ];
    
    // Shuffle the board configs to randomize order
    shuffleArray(boardConfigs);
    
    // Create canvas boards
    let boards = [];
    
    // Initialize SortableJS variable
    let sortable = null;
    
    // Function to draw different shapes on canvas
    function drawShape(canvas, shape, color) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Fill the entire canvas with the color first (for negative space)
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        
        // Set composite operation to cut out shapes
        ctx.globalCompositeOperation = 'destination-out';
        
        // Check what mode we're in
        const isNarrow = boardMode === 1 // Only apply to main board, not control buttons
        const isWide = boardMode === 2 // Only apply to main board, not control buttons
           // start top hole
           const topHolerectWidth = isNarrow ? width * 0.9 : isWide ? width * 0.25 : width * 0.5;
           const topHolerectHeight = width * 0.025;
           const topHolerectX = isNarrow ? width * 0.05 : isWide ? width * 0.375 : width * 0.25;
           const topHolerectY = width * 0.025;
           const topHoleradius = isWide ? 6 : isNarrow ? 12 : topHolerectHeight / 2; // Radius for rounded corners
          
        switch(shape) {
            case 'stripes': {


                 ctx.beginPath();
                ctx.moveTo(topHolerectX + topHoleradius, topHolerectY);
                ctx.lineTo(topHolerectX + topHolerectWidth - topHoleradius, topHolerectY);
                ctx.arcTo(topHolerectX + topHolerectWidth, topHolerectY, topHolerectX + topHolerectWidth, topHolerectY + topHoleradius, topHoleradius);
                ctx.lineTo(topHolerectX + topHolerectWidth, topHolerectY + topHolerectHeight - topHoleradius);
                ctx.arcTo(topHolerectX + topHolerectWidth, topHolerectY + topHolerectHeight, topHolerectX + topHolerectWidth - topHoleradius, topHolerectY + topHolerectHeight, topHoleradius);
                ctx.lineTo(topHolerectX + topHoleradius, topHolerectY + topHolerectHeight);
                ctx.arcTo(topHolerectX, topHolerectY + topHolerectHeight, topHolerectX, topHolerectY + topHolerectHeight - topHoleradius, topHoleradius);
                ctx.lineTo(topHolerectX, topHolerectY + topHoleradius);
                ctx.arcTo(topHolerectX, topHolerectY, topHolerectX + topHoleradius, topHolerectY, topHoleradius);
                ctx.closePath();
                ctx.fill();


                // Based on case 0 in the Objective-C code
                const stripeHeight = height * 0.09;
                const spacing = height * 0.09;
                const stripeWidth =  isWide ? width * 0.9 : width * 0.8;
                const startY = height * 0.725;
                

                for (let i = 0; i < 4; i++) {
                    ctx.fillRect(
                        isWide ? width * 0.05 : width * 0.1,
                        startY - i * (stripeHeight + spacing),
                        stripeWidth,
                        stripeHeight
                    );
                }
                break;
            }
            
            case 'split-circle': {



                 ctx.beginPath();
                  ctx.moveTo(topHolerectX + topHoleradius, topHolerectY);
                  ctx.lineTo(topHolerectX + topHolerectWidth - topHoleradius, topHolerectY);
                  ctx.arcTo(topHolerectX + topHolerectWidth, topHolerectY, topHolerectX + topHolerectWidth, topHolerectY + topHoleradius, topHoleradius);
                  ctx.lineTo(topHolerectX + topHolerectWidth, topHolerectY + topHolerectHeight - topHoleradius);
                  ctx.arcTo(topHolerectX + topHolerectWidth, topHolerectY + topHolerectHeight, topHolerectX + topHolerectWidth - topHoleradius, topHolerectY + topHolerectHeight, topHoleradius);
                  ctx.lineTo(topHolerectX + topHoleradius, topHolerectY + topHolerectHeight);
                  ctx.arcTo(topHolerectX, topHolerectY + topHolerectHeight, topHolerectX, topHolerectY + topHolerectHeight - topHoleradius, topHoleradius);
                  ctx.lineTo(topHolerectX, topHolerectY + topHoleradius);
                  ctx.arcTo(topHolerectX, topHolerectY, topHolerectX + topHoleradius, topHolerectY, topHoleradius);
                  ctx.closePath();
                  ctx.fill();


                // Based on case 1 in the Objective-C code
                if (isNarrow) {
                    // For narrow mode, draw a half-circle (ellipse) that spans the width
                    const centerX = width * .5;
                    const centerY = height * .5;
                    const radiusX = height * 0.15; // Use height for horizontal radius (after rotation)
                    const radiusY = width * 0.3; // Use width for vertical radius (after rotation)
                    const barWidth = width * 0.09; 
                    const barHalfWidth = barWidth / 2;
                    // Draw the top half of the circle
                    ctx.beginPath();
                    ctx.ellipse(centerX, centerY, radiusX, radiusY, Math.PI/2, 0, Math.PI * 2, false);
                    ctx.fill();
                    // Now cut out the middle bar by drawing with destination-out
                    ctx.globalCompositeOperation = 'source-over';
                    
                    ctx.fillRect(
                        centerX - radiusY,
                        centerY - barHalfWidth,
                        radiusY * 2,
                        barWidth
                    );
                    
                    // Reset composite operation
                    ctx.globalCompositeOperation = 'destination-out';

                } else if (isWide) {
                      // For narrow mode, draw a half-circle (ellipse) that spans the width
                      const centerX = width * .5;
                      const centerY = height * .5;
                      const radiusX = height * 0.4; // Use height for horizontal radius (after rotation)
                      const radiusY = width * 0.2; // Use width for vertical radius (after rotation)
                      const barWidth = width * 0.08; 
                      const barHalfWidth = barWidth / 2;
                      // Draw the top half of the circle
                      ctx.beginPath();
                      ctx.ellipse(centerX, centerY, radiusX, radiusY, Math.PI/2, 0, Math.PI * 2, false);
                      ctx.fill();
                      // Now cut out the middle bar by drawing with destination-out
                      ctx.globalCompositeOperation = 'source-over';
                    //   ctx.fillRect(
                    //       centerX - barHalfWidth,
                    //       centerY - radiusX,
                    //       barWidth,
                    //       radiusX * 2
                    //   );
                      // Reset composite operation
                      ctx.globalCompositeOperation = 'destination-out';

                       // Draw the half ellipse on the left
                       ctx.beginPath();
                       ctx.ellipse(centerX * 1.5, centerY, radiusX/2, radiusY*2, 0, -Math.PI/2, Math.PI/2, false);
                       ctx.fill();
                       // Draw the half ellipse on the right
                       ctx.beginPath();
                       ctx.ellipse(centerX * .5, centerY, radiusX/2, radiusY*2, 0, Math.PI/2, Math.PI*3/2, false);
                       ctx.fill();

                } else {
                    // Original split-circle for regular mode
                    const centerX = width / 2;
                    const centerY = height / 2;
                    const radius = width * 0.4;
                    const barWidth = width * 0.19; 
                    const barHalfWidth = barWidth / 2;
                    
                    // Draw a full circle first
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Now cut out the middle bar by drawing with destination-out
                    ctx.globalCompositeOperation = 'source-over';
                    
                    // Middle bar (slightly tapered)
                    ctx.fillRect(
                        centerX - barHalfWidth,
                        centerY - radius,
                        barWidth,
                        radius * 2
                    );
                    
                    // Reset composite operation
                    ctx.globalCompositeOperation = 'destination-out';
                }
                break;
            }
            
            case 'capsule': {

                  // start top hole
                ctx.beginPath();
                  ctx.moveTo(topHolerectX + topHoleradius, topHolerectY);
                  ctx.lineTo(topHolerectX + topHolerectWidth - topHoleradius, topHolerectY);
                  ctx.arcTo(topHolerectX + topHolerectWidth, topHolerectY, topHolerectX + topHolerectWidth, topHolerectY + topHoleradius, topHoleradius);
                  ctx.lineTo(topHolerectX + topHolerectWidth, topHolerectY + topHolerectHeight - topHoleradius);
                  ctx.arcTo(topHolerectX + topHolerectWidth, topHolerectY + topHolerectHeight, topHolerectX + topHolerectWidth - topHoleradius, topHolerectY + topHolerectHeight, topHoleradius);
                  ctx.lineTo(topHolerectX + topHoleradius, topHolerectY + topHolerectHeight);
                  ctx.arcTo(topHolerectX, topHolerectY + topHolerectHeight, topHolerectX, topHolerectY + topHolerectHeight - topHoleradius, topHoleradius);
                  ctx.lineTo(topHolerectX, topHolerectY + topHoleradius);
                  ctx.arcTo(topHolerectX, topHolerectY, topHolerectX + topHoleradius, topHolerectY, topHoleradius);
                  ctx.closePath();
                  ctx.fill();


                if (isNarrow) {
                    const circleDiameter = width * 0.187;
                    ctx.beginPath();
                    ctx.ellipse(
                        width / 2,
                        height * 0.75,
                        circleDiameter,
                        circleDiameter / 2,
                        0, // rotation
                        0,
                        Math.PI * 2
                    );
                    ctx.ellipse(
                        width / 2,
                        height * 0.25,
                        circleDiameter,
                        circleDiameter / 2,
                        0, // rotation
                        0,
                        Math.PI * 2
                    );
                    ctx.rect((width * .5 - circleDiameter), height * 0.25, circleDiameter*2, height * 0.5);
                    ctx.fill();
                } else if (isWide) {
                    // Wide mode - For now, using regular mode settings with adjustments
                    const slotWidth = width * 0.9;
                    const slotHeight = width * 0.2;
                    const x = (width - slotWidth) / 2;
                    const y = (height - slotHeight) / 2;
                    const radius = slotHeight / 2;
                    const xRadius = radius / 2; // x radius is now half of the original radius
                    
                    ctx.beginPath();
                    ctx.moveTo(x + xRadius, y);
                    ctx.lineTo(x + slotWidth - xRadius, y);
                    ctx.ellipse(x + slotWidth - xRadius, y + radius, xRadius, radius, 0, -Math.PI/2, Math.PI/2, false);
                    ctx.lineTo(x + xRadius, y + slotHeight);
                    ctx.ellipse(x + xRadius, y + radius, xRadius, radius, 0, Math.PI/2, -Math.PI/2, false);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    const slotWidth = width * 0.87;
                    const slotHeight = width * 0.27;
                    const x = (width - slotWidth) / 2;
                    const y = (height - slotHeight) / 2;
                    const radius = slotHeight / 2;
                    
                    ctx.beginPath();
                    ctx.moveTo(x + radius, y);
                    ctx.lineTo(x + slotWidth - radius, y);
                    ctx.arc(x + slotWidth - radius, y + radius, radius, -Math.PI/2, Math.PI/2, false);
                    ctx.lineTo(x + radius, y + slotHeight);
                    ctx.arc(x + radius, y + radius, radius, Math.PI/2, -Math.PI/2, false);
                    ctx.closePath();
                    ctx.fill();
                }
                break;
              
            }
            
            case 'square': {

                  // start top hole
                ctx.beginPath();
                  ctx.moveTo(topHolerectX + topHoleradius, topHolerectY);
                  ctx.lineTo(topHolerectX + topHolerectWidth - topHoleradius, topHolerectY);
                  ctx.arcTo(topHolerectX + topHolerectWidth, topHolerectY, topHolerectX + topHolerectWidth, topHolerectY + topHoleradius, topHoleradius);
                  ctx.lineTo(topHolerectX + topHolerectWidth, topHolerectY + topHolerectHeight - topHoleradius);
                  ctx.arcTo(topHolerectX + topHolerectWidth, topHolerectY + topHolerectHeight, topHolerectX + topHolerectWidth - topHoleradius, topHolerectY + topHolerectHeight, topHoleradius);
                  ctx.lineTo(topHolerectX + topHoleradius, topHolerectY + topHolerectHeight);
                  ctx.arcTo(topHolerectX, topHolerectY + topHolerectHeight, topHolerectX, topHolerectY + topHolerectHeight - topHoleradius, topHoleradius);
                  ctx.lineTo(topHolerectX, topHolerectY + topHoleradius);
                  ctx.arcTo(topHolerectX, topHolerectY, topHolerectX + topHoleradius, topHolerectY, topHoleradius);
                  ctx.closePath();
                  ctx.fill();


                // Based on case 3 in the Objective-C code
                const size = isNarrow ? width * 0.48 : (isWide ? width * 0.7 : width * 0.57);
                const x = (width - size) / 2;
                const y = (height - size) / 2;
                
                ctx.fillRect(x, y, size, size);
                break;
            }
            
            case 'frame-dot': {

                  // start top hole
                ctx.beginPath();
                  ctx.moveTo(topHolerectX + topHoleradius, topHolerectY);
                  ctx.lineTo(topHolerectX + topHolerectWidth - topHoleradius, topHolerectY);
                  ctx.arcTo(topHolerectX + topHolerectWidth, topHolerectY, topHolerectX + topHolerectWidth, topHolerectY + topHoleradius, topHoleradius);
                  ctx.lineTo(topHolerectX + topHolerectWidth, topHolerectY + topHolerectHeight - topHoleradius);
                  ctx.arcTo(topHolerectX + topHolerectWidth, topHolerectY + topHolerectHeight, topHolerectX + topHolerectWidth - topHoleradius, topHolerectY + topHolerectHeight, topHoleradius);
                  ctx.lineTo(topHolerectX + topHoleradius, topHolerectY + topHolerectHeight);
                  ctx.arcTo(topHolerectX, topHolerectY + topHolerectHeight, topHolerectX, topHolerectY + topHolerectHeight - topHoleradius, topHoleradius);
                  ctx.lineTo(topHolerectX, topHolerectY + topHoleradius);
                  ctx.arcTo(topHolerectX, topHolerectY, topHolerectX + topHoleradius, topHolerectY, topHoleradius);
                  ctx.closePath();
                  ctx.fill();
                // Based on case 4 in the Objective-C code
                const edgeInsetH = isNarrow ? width * 0.1 : (isWide ? width * 0.1 : width * 0.1);
                const edgeInsetV = width * 0.1;
               
                const horizontalStripeWidth = isNarrow ? width * 0.4 : (isWide ? width * 0.8 : width * 0.56);
                const horizontalStripeHeight =  height * 0.078;
               
                const verticalStripeWidth = isNarrow ? horizontalStripeHeight*2 : (isWide ? horizontalStripeHeight/2 : horizontalStripeHeight);
                const verticalStripeHeight = width * 0.6;
               
                const circleDiameter = width * 0.187;

                // Top
                ctx.fillRect(
                    (width - horizontalStripeWidth) / 2,
                    edgeInsetV,
                    horizontalStripeWidth,
                    horizontalStripeHeight
                );
                
                // Bottom
                ctx.fillRect(
                    (width - horizontalStripeWidth) / 2,
                    height - edgeInsetV - horizontalStripeHeight,
                    horizontalStripeWidth,
                    horizontalStripeHeight
                );
                
                // Left
                ctx.fillRect(
                    isWide ? edgeInsetH/2 : edgeInsetH,
                    (height - verticalStripeHeight) / 2,
                    verticalStripeWidth,
                    verticalStripeHeight
                );
                
                
                // Right
                ctx.fillRect(
                    isWide ? width - (edgeInsetH/2) - verticalStripeWidth : width - edgeInsetH - verticalStripeWidth,
                    (height - verticalStripeHeight) / 2,
                    verticalStripeWidth,
                    verticalStripeHeight
                );
                
                // Center circle
                ctx.beginPath();
                ctx.ellipse(
                    width / 2,
                    height / 2,
                    isNarrow ? circleDiameter : isWide ? circleDiameter/4 : circleDiameter/2,
                    isWide ? circleDiameter/2  : circleDiameter / 2,
                    0, // rotation
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                break;
            }
            
            case 'diamonds': {

                     ctx.beginPath();
                  ctx.moveTo(topHolerectX + topHoleradius, topHolerectY);
                  ctx.lineTo(topHolerectX + topHolerectWidth - topHoleradius, topHolerectY);
                  ctx.arcTo(topHolerectX + topHolerectWidth, topHolerectY, topHolerectX + topHolerectWidth, topHolerectY + topHoleradius, topHoleradius);
                  ctx.lineTo(topHolerectX + topHolerectWidth, topHolerectY + topHolerectHeight - topHoleradius);
                  ctx.arcTo(topHolerectX + topHolerectWidth, topHolerectY + topHolerectHeight, topHolerectX + topHolerectWidth - topHoleradius, topHolerectY + topHolerectHeight, topHoleradius);
                  ctx.lineTo(topHolerectX + topHoleradius, topHolerectY + topHolerectHeight);
                  ctx.arcTo(topHolerectX, topHolerectY + topHolerectHeight, topHolerectX, topHolerectY + topHolerectHeight - topHoleradius, topHoleradius);
                  ctx.lineTo(topHolerectX, topHolerectY + topHoleradius);
                  ctx.arcTo(topHolerectX, topHolerectY, topHolerectX + topHoleradius, topHolerectY, topHoleradius);
                  ctx.closePath();
                  ctx.fill();


                const insetX = isNarrow ? width * 0.04 : (isWide ? width * 0.3 : width * 0.06);
                const insetY = isNarrow ? height * 0.24 : (isWide ? height * 0.2 : height * 0.21);
                const gap = isNarrow ? width * 0.5 : (isWide ? width * 0.1 : width * 0.19);
                const midX = width / 2;
                const midY = height / 2;
                // Increase the gap between triangles
                const triangleOffset = isNarrow ? width * 0.1 : (isWide ? width * 0.02 : width * 0.03);
                
                if (isNarrow) {
                    // Top triangle
                    ctx.beginPath();
                    ctx.moveTo(midX, insetY);
                    ctx.lineTo(midX - gap / 2, midY - triangleOffset);
                    ctx.lineTo(midX + gap / 2, midY - triangleOffset);
                    ctx.closePath();
                    ctx.fill();

                    // Bottom triangle
                    ctx.beginPath();
                    ctx.moveTo(midX, height - insetY);
                    ctx.lineTo(midX - gap / 2, midY + triangleOffset);
                    ctx.lineTo(midX + gap / 2, midY + triangleOffset);
                    ctx.closePath();
                    ctx.fill();
                } else if (isWide) {


                    ctx.beginPath();
                    ctx.moveTo(insetX, midY);
                    ctx.lineTo(midX - gap / 2, insetY);
                    ctx.lineTo(midX - gap / 2, height - insetY);
                    ctx.closePath();
                    ctx.fill();

                    ctx.beginPath();
                    ctx.moveTo(width - insetX, midY);
                    ctx.lineTo(midX + gap / 2, insetY);
                    ctx.lineTo(midX + gap / 2, height - insetY);
                    ctx.closePath();
                    ctx.fill();

                    const diamondWidth = width * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(width - insetX + diamondWidth, midY);
                    ctx.lineTo(midX + gap / 2 + diamondWidth, insetY);
                    ctx.lineTo(midX + gap / 2 + diamondWidth, height - insetY);
                    ctx.closePath();
                    ctx.fill();
                    
                    ctx.beginPath();
                    ctx.moveTo(insetX -diamondWidth, midY);
                    ctx.lineTo(midX - gap / 2 -diamondWidth, insetY);
                    ctx.lineTo(midX - gap / 2 - diamondWidth, height - insetY);
                    ctx.closePath();
                    ctx.fill();
                    


                } else {
                    // Left triangle - regular mode
                    ctx.beginPath();
                    ctx.moveTo(insetX, midY);
                    ctx.lineTo(midX - gap / 2, insetY);
                    ctx.lineTo(midX - gap / 2, height - insetY);
                    ctx.closePath();
                    ctx.fill();

                    // Right triangle - regular mode
                    ctx.beginPath();
                    ctx.moveTo(width - insetX, midY);
                    ctx.lineTo(midX + gap / 2, insetY);
                    ctx.lineTo(midX + gap / 2, height - insetY);
                    ctx.closePath();
                    ctx.fill();
                }
                break;
            }
        }
        
        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
    }
    
    // Function to draw different shapes on canvas with transition
    function drawShapeWithTransition(canvas, shape, targetColor, boardState, previousState, callback) {
        // Create a temporary canvas for the transition
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        
        // Draw the target shape on the temp canvas
        drawShape(tempCanvas, shape, targetColor);
        
        // Perform the transition
        const ctx = canvas.getContext('2d');
        const startTime = performance.now();
        const duration = 100; // transition duration in ms
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Clear the main canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw with progress-based blending for color transition
            ctx.drawImage(tempCanvas, 0, 0);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Ensure final state is properly set
                ctx.drawImage(tempCanvas, 0, 0);
                
                // Execute callback if provided
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Function to create and initialize boards
    function initializeBoards() {
        // Clear existing boards and controls
        boardsContainer.innerHTML = '';
        controlsContainer.innerHTML = '';
        boards = [];
        
        // Shuffle the board configs for a new order
        shuffleArray(boardConfigs);
        
    boardConfigs.forEach((config, i) => {
        // Create board container
        const boardContainer = document.createElement('div');
        boardContainer.className = 'board-container';
        
        // Set initial z-index (top board in UI = highest z-index)
        const visualPosition = boardConfigs.length - 1 - i;
        boardContainer.style.zIndex = visualPosition;
        
        boardContainer.dataset.index = i;
        
        // Create canvas for the board
        const canvas = document.createElement('canvas');
        canvas.className = 'board-canvas';
        canvas.width = baseWidth;
        canvas.height = baseWidth;
        boardContainer.appendChild(canvas);
        
        // Randomly determine initial state (0: primary, 1: secondary, 2: off)
        const initialState = Math.floor(Math.random() * 3);
        let initialColor;
        
        if (initialState === 0) {
            initialColor = config.colors.primary;
        } else if (initialState === 1) {
            initialColor = config.colors.secondary;
        } else {
            initialColor = config.colors.off;
            // Hide board if it's in off state
            boardContainer.style.display = 'none';
        }
        
        // Draw the shape on the canvas with initial color
        drawShape(canvas, config.shape, initialColor);
        
        // Add drag functionality
        let startX, startY;
        let initialTransform = '';
        let dragStartTime = 0;
        
        boardContainer.addEventListener('mousedown', function(e) {
            if (this.style.display === 'none') return;
            
            // Store initial position and time
            startX = e.clientX;
            startY = e.clientY;
            initialTransform = this.style.transform || '';
            dragStartTime = Date.now();
            
            // Add dragging class
            this.classList.add('dragging');
            
            // Add mousemove and mouseup listeners
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', handleDragEnd);
        });
        
        function handleDrag(e) {
            // if (!boardContainer.classList.contains('dragging')) return;
            
            // const deltaX = e.clientX - startX;
            // const deltaY = e.clientY - startY;
            // const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // // Apply transform
            // boardContainer.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            
            // // Change color to gray if dragged beyond 200px
            // if (distance > 200) {
            //     const canvas = boardContainer.querySelector('canvas');
            //     if (canvas) {
            //         drawShape(canvas, config.shape, '#666666');
            //     }
            // } else {
            //     // Restore original color
            //     const canvas = boardContainer.querySelector('canvas');
            //     if (canvas) {
            //         const color = getColorForBoard(boards[parseInt(boardContainer.dataset.index)]);
            //         drawShape(canvas, config.shape, color);
            //     }
            // }
        }
        
        function handleDragEnd(e) {
            // if (!boardContainer.classList.contains('dragging')) return;
            
            // const deltaX = e.clientX - startX;
            // const deltaY = e.clientY - startY;
            // const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            // const dragDuration = Date.now() - dragStartTime;
            
            // // Remove dragging class
            // boardContainer.classList.remove('dragging');
            
            // // Remove event listeners
            // document.removeEventListener('mousemove', handleDrag);
            // document.removeEventListener('mouseup', handleDragEnd);
            
            // if (distance > 200) {
            //     // If dragged more than 100px, make the board disappear
            //     const controlBtn = controlsContainer.querySelector(`.control-btn[data-board-index="${i}"]`);
            //     if (controlBtn) {
            //         // Click the control button until the board is hidden
            //         const clickUntilHidden = () => {
            //             if (boardContainer.style.display !== 'none') {
            //                 controlBtn.click();
            //                 setTimeout(clickUntilHidden, 50); // Small delay between clicks
            //                 setTimeout(() => {
            //                     gsap.to(boardContainer, {
            //                         x: 0,
            //                         y: 0,
            //                         duration: 0.3,
            //                         ease: "elastic.out(1, 0.7)"
            //                     });
            //                 }, 100);
            //             }
            //         };
            //         clickUntilHidden();
            //     }
            // } else {
            //     // Snap back to original position
            //     gsap.to(boardContainer, {
            //         x: 0,
            //         y: 0,
            //         duration: 0.3,
            //         ease: "elastic.out(1, 0.7)"
            //     });
            // }
        }
        
        // Add click event listener to the board container
        boardContainer.addEventListener('click', function(e) {
            // Only trigger if the board is visible and it's a quick click (not a drag)
            if (this.style.display !== 'none' && Date.now() - dragStartTime < 200) {
                // Find the corresponding control button
                const controlBtn = controlsContainer.querySelector(`.control-btn[data-board-index="${i}"]`);
                if (controlBtn) {
                    // Trigger the control button's click event
                    controlBtn.click();
                }
            }
        });
        
        boardsContainer.appendChild(boardContainer);
        boards.push({
            container: boardContainer,
            canvas: canvas,
            config: config,
            colorState: initialState // Set initial state
        });
        
        // Create control button for this board
        const controlBtn = document.createElement('div');
        controlBtn.className = 'control-btn';
        
        // Add inactive class if in off state
        if (initialState === 2) {
            controlBtn.classList.add('inactive');
        }
            
            // Assign a random shiver animation class (1-6)
            const shiverClass = `shiver-${Math.floor(Math.random() * 6) + 1}`;
            controlBtn.dataset.shiverClass = shiverClass;
        
        controlBtn.dataset.boardIndex = i;
        
        // Create mini canvas for the control button
        const controlCanvas = document.createElement('canvas');
        controlCanvas.width = 160;
        controlCanvas.height = 160;
        
        // Draw control with initial color (no opacity changes in JS)
        drawShape(controlCanvas, config.shape, initialColor);
        controlBtn.appendChild(controlCanvas);
        
        controlBtn.addEventListener('click', function() {
            const boardIndex = parseInt(this.dataset.boardIndex);
            const board = boards[boardIndex];
            const previousState = board.colorState;
            board.colorState = (board.colorState + 1) % 3;
            
            // Add click animation
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 300);
            
            let color;
            if (board.colorState === 0) {
                color = board.config.colors.primary;
                // Make sure board is visible
                board.container.style.display = 'block';
                // Remove inactive class
                this.classList.remove('inactive');
            } else if (board.colorState === 1) {
                color = board.config.colors.secondary;
                // Make sure board is visible
                board.container.style.display = 'block';
                // Remove inactive class
                this.classList.remove('inactive');
            } else {
                color = board.config.colors.off;
                // Add inactive class
                this.classList.add('inactive');
                // For off state, fade out then hide the board
                    board.container.style.display = 'none';
            }
            
            // Apply color transition without opacity changes
            drawShapeWithTransition(board.canvas, board.config.shape, color, board.colorState, previousState);
            drawShapeWithTransition(controlCanvas, board.config.shape, color, board.colorState, previousState);
            
            // Update download button color after the state change
            updateDownloadButtonColor();
        });
        
        controlsContainer.appendChild(controlBtn);
    });
    
        // Re-initialize SortableJS for the controls
        if (sortable) {
            sortable.destroy();
        }
        initializeSortable();
    }
    
    // Initial creation of boards
    initializeBoards();
    
    // Hover detection for controls area
    let isHoveringControls = false;
    let isDragging = false;
    
    // Handle hover detection around controls
    function handleControlsHover(event) {
        const controlsRect = controlsContainer.getBoundingClientRect();
        const buffer = 20; // 20px buffer area
        
        // Check if mouse is within the extended area around controls
        const isInHoverArea = (
            event.clientX >= controlsRect.left - buffer &&
            event.clientX <= controlsRect.right + buffer &&
            event.clientY >= controlsRect.top - buffer &&
            event.clientY <= controlsRect.bottom + buffer
        );
        
        // Only update class and animations if state changed
        if (isInHoverArea !== isHoveringControls) {
            isHoveringControls = isInHoverArea;
            updateShiverAnimations();
        }
    }
    
    // Update shiver animations based on hover state
    function updateShiverAnimations() {
        const controlBtns = controlsContainer.querySelectorAll('.control-btn');
        
        controlBtns.forEach(btn => {
            if (isDragging) {
                // During drag, don't apply shiver to the dragged button
                if (!btn.classList.contains('sortable-chosen') && !btn.classList.contains('sortable-drag')) {
                    btn.classList.add(btn.dataset.shiverClass);
                }
            } else if (isHoveringControls) {
                // Apply shiver animation when hovering
                btn.classList.add(btn.dataset.shiverClass);
            } else {
                // Remove all shiver animations when not hovering
                for (let i = 1; i <= 6; i++) {
                    btn.classList.remove(`shiver-${i}`);
                }
            }
        });
    }
    
    // Add mousemove event listener to detect hover
    document.addEventListener('mousemove', handleControlsHover);
    
    // Function to initialize SortableJS for the controls
    function initializeSortable() {
        sortable = new Sortable(controlsContainer, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        onStart: function(evt) {

            document.querySelectorAll('.hide-on-drag').forEach(el => el.classList.add('hidden'));

            // Start 3D perspective animation
            const calendar = document.querySelector('.calendar');
            calendar.classList.add('dragging');
                
                // Mark as dragging and update controls container
                isDragging = true;
                controlsContainer.classList.add('is-dragging');
            
            // Store the original order for animation reference
            window.originalBoardOrder = Array.from(controlsContainer.children).map(
                control => parseInt(control.dataset.boardIndex)
            );
            
            // Apply initial 3D transforms
            applyPerspectiveToBoards();
                
                // Update shiver animations
                updateShiverAnimations();
        },
        onEnd: function(evt) {
            const fromIndex = evt.oldIndex;
            const toIndex = evt.newIndex;
            
            if (fromIndex !== toIndex) {
                // Update z-index of boards based on final order
                updateBoardOrder();
                
                // Visual feedback for the swap
                const movedElement = controlsContainer.children[toIndex];
                movedElement.classList.add('swapped');
                setTimeout(() => movedElement.classList.remove('swapped'), 500);
            }
            
            // Reset 3D perspective animation
            resetPerspective();
                
                // Mark as no longer dragging
                isDragging = false;
                controlsContainer.classList.remove('is-dragging');
                // Hide elements with the hide-on-drag class during dragging
                document.querySelectorAll('.hide-on-drag').forEach(el => el.classList.remove('hidden'));
                // Update shiver animations based on hover state
                updateShiverAnimations();
            
            // Clean up
            delete window.originalBoardOrder;
            delete window.currentDragDirection;
        },
        onChange: function(evt) {
            // Get current order during drag
            const currentOrder = Array.from(controlsContainer.children).map(
                control => parseInt(control.dataset.boardIndex)
            );
            
            // Determine drag direction
            const newIndex = evt.newIndex;
            const oldIndex = evt.oldIndex;
            window.currentDragDirection = newIndex > oldIndex ? 1 : -1;
            
            // Animate boards to their new positions based on current order
            animateBoardsToNewOrder(currentOrder);
                
                // Update shiver animations for non-dragged items
                updateShiverAnimations();
        }
    });
    }
    
    // Function to update board z-index based on control order
    function updateBoardOrder() {
        // Get the current order of controls
        const controlOrder = Array.from(controlsContainer.children).map(
            control => parseInt(control.dataset.boardIndex)
        );
        
        // Update z-index of boards based on new order
        // Higher position in the UI = higher z-index
        controlOrder.forEach((boardIndex, orderIndex) => {
            const visualPosition = boardConfigs.length - 1 - orderIndex;
            boards[boardIndex].container.style.zIndex = visualPosition;
        });
        
        // Update download button color to match the top board
        updateDownloadButtonColor();
    }
    
    // Function to update download button color based on top board
    function updateDownloadButtonColor() {

        updateFavicon();

        const downloadBtn = document.getElementById('downloadBtn');
        if (!downloadBtn) return;
        
        // Find the board with highest z-index (top board)
        const topBoard = [...boards].sort((a, b) => {
            return parseInt(b.container.style.zIndex) - parseInt(a.container.style.zIndex);
        }).find(board => board.container.style.display !== 'none');
        
        if (topBoard) {
            let color;
            if (topBoard.colorState === 0) {
                color = topBoard.config.colors.primary;
            } else if (topBoard.colorState === 1) {
                color = topBoard.config.colors.secondary;
            } else {
                color = '#FFE100'; // Default color if somehow the top board is off
            }
            
            downloadBtn.style.backgroundColor = color;
            
            // Set text color to black or white based on background brightness
            const rgb = hexToRgb(color);
            const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
            downloadBtn.style.color = brightness > 128 ? '#000000' : '#FFFFFF';
        }
    }
    
    // Helper function to convert hex color to RGB
    function hexToRgb(hex) {
        // Remove the # if present
        hex = hex.replace(/^#/, '');
        
        // Parse the hex values
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        
        return { r, g, b };
    }
    // Function to generate and update favicon based on current board stack
    function updateFavicon() {
        // Create a canvas for the favicon
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Fill background with dark color
        ctx.fillStyle = '#212121';
        ctx.fillRect(0, 0, 32, 32);
        
        // Get boards in their current visual order (top to bottom)
        const orderedBoards = [...boards].sort((a, b) => {
            return parseInt(a.container.style.zIndex) - parseInt(b.container.style.zIndex);
        }).filter(board => board.container.style.display !== 'none');
        
      
        // Draw mini versions of the boards stacked
        orderedBoards.forEach((board, index) => {
            // Determine color based on board's current state
            let color;
            if (board.colorState === 0) {
                color = board.config.colors.primary;
            } else {
                color = board.config.colors.secondary;
            } 
            // Create a temporary canvas for drawing the shape
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            
            // Draw the shape on the temp canvas
            drawShape(tempCanvas, board.config.shape, color);
            
            // Add the result to the main canvas
            ctx.drawImage(tempCanvas, 0, 0);
            });
        
        // Convert canvas to favicon
        const faviconUrl = canvas.toDataURL('image/png');
        
        // Update or create favicon link element
        let favicon = document.querySelector('link[rel="icon"]');
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
        }
        
        // Set the new favicon
        favicon.href = faviconUrl;
    }
    
 
    // Function to apply initial 3D perspective to boards
    function applyPerspectiveToBoards() {
        const calendar = document.querySelector('.calendar');
        const maxZ = boardConfigs.length * 30;
        
        // Animate the calendar
        gsap.to(calendar, {
            rotateX: 20,
            duration: CALENDAR_ANIMATION_DURATION,
            ease: "power2.out"
        });
        
        // Get the current order of controls
        const controlOrder = Array.from(controlsContainer.children).map(
            control => parseInt(control.dataset.boardIndex)
        );
        
        // Create a mapping of board indices to their visual positions
        const positionMap = {};
        controlOrder.forEach((boardIndex, position) => {
            positionMap[boardIndex] = position;
        });
        
        // Animate each board
        boards.forEach((board, boardIndex) => {
            const isActive = board.container.style.display !== 'none';
            
            if (isActive) {
                // Get the current position of this board in the stack
                const currentPosition = positionMap[boardIndex];
                
                // Calculate z-index and 3D position (higher position = closer to viewer)
                // This ensures top board in UI is top board in 3D space
                const visualPosition = boardConfigs.length - 1 - currentPosition;
                const zPosition = visualPosition * 30;
                const yPosition = visualPosition * -5;
                
                gsap.to(board.container, {
                    z: zPosition,
                    y: yPosition,
                    boxShadow: `0 ${zPosition/5}px ${zPosition/2}px rgba(0,0,0,${0.1 + (zPosition/maxZ) * 0.3})`,
                    duration: BOARD_ANIMATION_DURATION,
                    ease: "back.out(1.2)"
                });
            }
        });
    }
    
    // Function to animate boards to their new order during drag
    function animateBoardsToNewOrder(currentOrder) {
        const calendar = document.querySelector('.calendar');
        const maxZ = boardConfigs.length * 30;
        const direction = window.currentDragDirection || 0;
        
        // Rotate calendar based on drag direction
        gsap.to(calendar, {
            rotateY: direction * 5,
            duration: CALENDAR_ANIMATION_DURATION,
            ease: "power1.out"
        });
        
        // Create a mapping of board indices to their visual positions
        const positionMap = {};
        currentOrder.forEach((boardIndex, position) => {
            positionMap[boardIndex] = position;
        });
        
        // Animate each board based on its new position
        boards.forEach((board, boardIndex) => {
            const isActive = board.container.style.display !== 'none';
            
            if (isActive) {
                // Get the new position of this board in the stack
                const newPosition = positionMap[boardIndex];
                
                // Calculate z-index and 3D position (higher position = closer to viewer)
                // This ensures top board in UI is top board in 3D space
                const visualPosition = boardConfigs.length - 1 - newPosition;
                const zPosition = visualPosition * 30;
                const yPosition = visualPosition * -5;
                const xOffset = direction * visualPosition * 3;
                
                // Add active-drag class for visual emphasis
                board.container.classList.add('active-drag');
                
                // Animate to new position
                gsap.to(board.container, {
                    z: zPosition,
                    y: yPosition,
                    x: xOffset,
                    boxShadow: `0 ${zPosition/5}px ${zPosition/2}px rgba(0,0,0,${0.1 + (zPosition/maxZ) * 0.3})`,
                    duration: BOARD_ANIMATION_DURATION,
                    ease: "power1.out"
                });
            }
        });
    }
    
    // Function to reset perspective with GSAP
    function resetPerspective() {
        const calendar = document.querySelector('.calendar');
        
        // Animate calendar back to normal
        gsap.to(calendar, {
            rotateX: 0,
            rotateY: 0,
            duration: CALENDAR_ANIMATION_DURATION,
            ease: "elastic.out(1, 0.7)"
        });
        
        // Animate boards back to normal
        boards.forEach(board => {
            // Remove active-drag class
            board.container.classList.remove('active-drag');
            
            gsap.to(board.container, {
                x: 0,
                y: 0,
                z: 0,
                boxShadow: "none",
                duration: BOARD_ANIMATION_DURATION,
                ease: "elastic.out(1, 0.7)"
            });
        });
    }
    
    // Update date and time
    function updateDateTime() {
        const now = new Date();
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        
        document.querySelector('.day-label').textContent = days[now.getDay()];
        document.querySelector('.month-label').textContent = months[now.getMonth()];
        document.querySelector('.date-label').textContent = now.getDate();
    }
    
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute

    // Initialize Sortable for date labels
    const calendarFooter = document.querySelector('.calendar-footer');
    if (calendarFooter) {
        new Sortable(calendarFooter, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            // forceFallback: true, // 👈 now 'dragClass' works
            dragClass: 'sortable-drag',
            // onStart: function() {
                // Add 15deg rotation to the sortable-drag element
                // setTimeout(() => {
                //     console.log(document.querySelector('.sortable-drag'));
                //     // document.querySelector('.sortable-drag')[0].style.transform = 'rotate(15deg)';
                // }, 100);
            // },
            onEnd: function(evt) {
                // Add a subtle animation when the drag ends
                const movedElement = evt.item;
                movedElement.style.animation = 'none';
                setTimeout(() => {
                    movedElement.style.animation = 'date-label-settle 0.3s ease';
                }, 5);
            }
        });
    }

    // Touch device support for hover effect
    controlsContainer.addEventListener('touchstart', function() {
        isHoveringControls = true;
        updateShiverAnimations();
    });
    
    document.addEventListener('touchend', function() {
        if (!isDragging) {
            isHoveringControls = false;
            updateShiverAnimations();
        }
    });

    // Function to shuffle array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to detect mobile devices
    function isMobileDevice() {
        return (window.innerWidth <= 700 || window.innerHeight <= 550 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }

    // Add refresh button functionality
    const refreshBtn = document.querySelector('.refresh-btn');
    
    refreshBtn.addEventListener('click', function() {
        // Add rotation animation class
        this.classList.add('rotating');
        
        // Apply a 3D effect to the calendar
        const calendar = document.querySelector('.calendar');
        
        // Check if we're on a mobile device
        if (isMobileDevice()) {
            // MOBILE VERSION - Simplified animation
            const tl = gsap.timeline();
            
            // First half - slide up and fade out
            tl.to(calendar, {
                translateY: -20,
                opacity: 0.8,
                duration: 0.3,
                ease: "power1.in",
                onStart: function() {
                    calendar.classList.add('showing-back');
                }
            })
            // Swap boards at the midpoint
            .call(() => {
                // Reinitialize all boards immediately
                initializeBoards();
                
                // Update download button color after boards are reinitialized
                updateDownloadButtonColor();
            })
            // Second half - slide down and fade in
            .to(calendar, {
                translateY: 0,
                opacity: 1,
                duration: 0.3,
                ease: "power1.out",
                delay: 0.1, // Small delay to ensure boards are initialized
                onComplete: function() {
                    calendar.classList.remove('showing-back');
                    
                    // Reset any transform properties that might have accumulated
                    gsap.set(calendar, { 
                        clearProps: "transform,filter,boxShadow" 
                    });
                }
            })
            // Small bounce effect
            .to(calendar, {
                scale: 1.02,
                duration: 0.1,
                ease: "power2.out"
            })
            .to(calendar, {
                scale: 1,
                duration: 0.1,
                ease: "power2.in",
                onComplete: function() {
                    // Remove the rotation class after animation completes
                    refreshBtn.classList.remove('rotating');
                }
            });
        } else {
            // DESKTOP VERSION - Full 3D rotation
            const tl = gsap.timeline();
            
            // First half of the rotation (0 to 180 degrees)
            tl.to(calendar, {
                rotateY: 180,
                scale: 0.9, // Scale down during flip
                duration: 0.5,  // Half duration
                ease: "power1.inOut",
                onUpdate: function() {
                    // Get current rotation
                    const rotation = gsap.getProperty(calendar, "rotateY");
                    
                    // Enhanced 3D effect with shadow and lighting based on rotation
                    const shadowBlur = Math.abs(Math.sin(rotation * Math.PI / 180)) * 25;
                    const brightness = 1 - Math.abs(Math.sin(rotation * Math.PI / 180)) * 0.2;
                    
                    calendar.style.boxShadow = `0px ${shadowBlur}px ${shadowBlur * 1.5}px rgba(0, 0, 0, 0.2)`;
                    calendar.style.filter = `brightness(${brightness})`;
                    
                    // Add or remove a class to indicate the back side is showing
                    if (rotation > 90 && rotation < 270) {
                        calendar.classList.add('showing-back');
                        // Hide boards container immediately when showing back
                        boardsContainer.style.visibility = 'hidden';
                        boardsContainer.style.opacity = '0';
                    } else {
                        calendar.classList.remove('showing-back');
                        // Show boards container when not showing back
                        boardsContainer.style.visibility = 'visible';
                        boardsContainer.style.opacity = '1';
                    }
                    
                    // At the midpoint of the animation (around 180 degrees), swap the boards
                    if (rotation > 170 && rotation < 190 && !tl.hasSwappedBoards) {
                        tl.hasSwappedBoards = true;
                        // Small delay before reinitializing the boards
                        setTimeout(() => {
                            // Reinitialize all boards when the calendar is flipped
                            initializeBoards();
                        }, 50);
                    }
                }
            })
            // Second half of the rotation (180 to 360/0 degrees)
            .to(calendar, {
                rotateY: 360,
                scale: 1, // Return to original scale
                duration: 0.5,  // Half duration
                ease: "power1.inOut",
                onUpdate: function() {
                    // Get current rotation
                    const rotation = gsap.getProperty(calendar, "rotateY");
                    
                    // Enhanced 3D effect with shadow and lighting based on rotation
                    const shadowBlur = Math.abs(Math.sin(rotation * Math.PI / 180)) * 25;
                    const brightness = 1 - Math.abs(Math.sin(rotation * Math.PI / 180)) * 0.2;
                    
                    calendar.style.boxShadow = `0px ${shadowBlur}px ${shadowBlur * 1.5}px rgba(0, 0, 0, 0.2)`;
                    calendar.style.filter = `brightness(${brightness})`;
                    
                    // Add or remove a class to indicate the back side is showing
                    if (rotation > 90 && rotation < 270) {
                        calendar.classList.add('showing-back');
                        // Hide boards container immediately when showing back
                        boardsContainer.style.visibility = 'hidden';
                        boardsContainer.style.opacity = '0';
                    } else {
                        calendar.classList.remove('showing-back');
                        // Show boards container when not showing back
                        boardsContainer.style.visibility = 'visible';
                        boardsContainer.style.opacity = '1';
                    }
                },
                onComplete: function() {
                    // Reset the rotation to 0 to avoid accumulating rotations
                    gsap.set(calendar, { rotateY: 0 });
                    // Reset any added styles
                    updateDownloadButtonColor();
                    calendar.style.boxShadow = '';
                    calendar.style.filter = '';
                    calendar.classList.remove('showing-back'); // Ensure the class is removed
                    // Ensure boards are fully visible at the end
                    boardsContainer.style.visibility = 'visible';
                    boardsContainer.style.opacity = '1';
                }
            })
            // Add a bounce effect at the end
            .to(calendar, {
                scale: 1.03,
                duration: 0.2,
                ease: "power2.out"
            })
            .to(calendar, {
                scale: 1,
                duration: 0.15,
                ease: "power2.in",
                onComplete: function() {
                    // Remove the rotation class after animation completes
                    refreshBtn.classList.remove('rotating');
                }
            });
            
            // Reset the flag for the next animation
            tl.hasSwappedBoards = false;
        }
    });
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    
    // Toggle between light and dark themes
    themeToggle.addEventListener('click', function() {
        // Toggle light mode class
        document.body.classList.toggle('light-mode');
        
        // Add a subtle animation to the toggle button
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = 'theme-toggle-rotate 0.5s ease';
        }, 5);
    });
    
    // Resize toggle functionality
    const resizeToggle = document.getElementById('resizeToggle');
    
    // Toggle between square, narrow, and wide board layouts
    resizeToggle.addEventListener('click', function() {
        // Check if we're on mobile and prevent wide mode
        const isMobile = window.innerWidth < 600;
        
        // Increment the board mode (0: standard, 1: narrow, 2: wide)
        // On mobile, only toggle between standard (0) and narrow (1)
        if (isMobile && boardMode === 1) {
            boardMode = 0; // Skip wide mode on mobile
        } else {
            boardMode = (boardMode + 1) % 3;
        }
        
        // Update body classes based on the new mode
        document.body.classList.remove('narrow-mode', 'wide-mode');
        if (boardMode === 1) {
            document.body.classList.add('narrow-mode');
        } else if (boardMode === 2) {
            document.body.classList.add('wide-mode');
        }
        
        // Reset animation first
        this.style.animation = 'none';
        
        // Get the icon element
        const iconElement = this.querySelector('.material-icons');
        
        // Update the toggle button rotation based on current mode
        setTimeout(() => {
            if (boardMode === 1) {
                // Animate to 90 degrees if switching to narrow mode
                this.style.animation = 'resize-toggle-to-narrow 0.5s ease forwards';
                iconElement.style.transform = 'rotate(90deg)';
            } else if (boardMode === 2) {
                // Animate to 180 degrees if switching to wide mode
                this.style.animation = 'resize-toggle-to-wide 0.5s ease forwards';
                iconElement.style.transform = 'rotate(180deg)';
            } else {
                // Animate to 0 degrees if switching to standard mode
                this.style.animation = 'resize-toggle-to-standard 0.5s ease forwards';
                iconElement.style.transform = 'rotate(0deg)';
            }
        }, 5);
        
        // Update control button sizes and redraw shapes
        const controlBtns = controlsContainer.querySelectorAll('.control-btn');
        controlBtns.forEach(btn => {
            // Remove all size classes
            btn.classList.remove('narrow', 'regular', 'wide');
            
            // Add appropriate size class
            if (boardMode === 1) {
                btn.classList.add('narrow');
            } else if (boardMode === 2) {
                btn.classList.add('wide');
            } else {
                btn.classList.add('regular');
            }
            
            // Get the canvas and redraw the shape
            const canvas = btn.querySelector('canvas');
            if (canvas) {
                const boardIndex = parseInt(btn.dataset.boardIndex);
                const board = boards[boardIndex];
                console.log(board);
                const color = getColorForBoard(board);
                drawShape(canvas, board.config.shape, color);
            }
        });
        
        // Redraw all visible boards with new aspect ratio
        boards.forEach(board => {
            if (board.container.style.display !== 'none') {
                const color = getColorForBoard(board);
                drawShape(board.canvas, board.config.shape, color);
            }
        });
        
        // Update download button color after layout change
        updateDownloadButtonColor();
    });
    // Helper function to get the current color for a board
    function getColorForBoard(board) {
        if (board.colorState === 0) {
            return board.config.colors.primary;
        } else if (board.colorState === 1) {
            return board.config.colors.secondary;
        } else {
            return board.config.colors.off;
        }
    }

    // Initial board creation and download button color update
    initializeBoards();
    updateDownloadButtonColor();
    
    // Download button click handler (placeholder for now)
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // For now, just add a subtle animation
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'button-pulse 0.5s ease';
            }, 5);
            
            console.log('Download button clicked - functionality will be implemented later');
        });
    }

    // Drawer functionality
    const header = document.querySelector('.header');
    const drawer = document.querySelector('.drawer');
    const h1 = header.querySelector('h1');
    const closeDrawer = drawer.querySelector('.close-drawer');

    h1.addEventListener('click', function() {
        drawer.classList.toggle('open');
    });

    closeDrawer.addEventListener('click', function() {
        drawer.classList.remove('open');
    });

    // Close drawer when clicking outside
    document.addEventListener('click', function(event) {
        if (!header.contains(event.target) && drawer.classList.contains('open')) {
            drawer.classList.remove('open');
        }
    });
    // Add this after the board creation code
function initializeBoardAnimations() {
    const boards = document.querySelectorAll('.board-container');
    const totalDuration = 3000; // 3 seconds total animation
    const staggerDelay = totalDuration / boards.length;
    // Filter out hidden boards and only animate visible ones
    const visibleBoards = Array.from(boards).filter(board => 
        window.getComputedStyle(board).display !== 'none'
    ).reverse();
    
    visibleBoards.forEach((board, index) => {
            board.classList.add('animate-in');
            board.style.animationDelay = `${index * staggerDelay}ms`;
            
            // Remove animation class after animation completes
            setTimeout(() => {
                board.classList.remove('animate-in');
                document.querySelector('.calendar').classList.remove('initial-state');
            }, totalDuration + (index * staggerDelay));
        }   
    );
}

// Call this after all boards are created
    initializeBoardAnimations();

});

// Add this at the bottom of the CSS style block
function addGlobalStyle(css) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
}

// Add a pulse animation for the download button
addGlobalStyle(`
    @keyframes button-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
    }
`); 