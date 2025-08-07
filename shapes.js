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
    
    // Check if we're in narrow mode (aspect ratio will be different)
    const isNarrow = isNarrowMode && canvas.width === 400; // Only apply to main board, not control buttons
    switch(shape) {
        case 'stripes': {
            // Based on case 0 in the Objective-C code
            const stripeHeight = height * 0.1;
            const spacing = height * 0.1;
            const stripeWidth = isNarrow ? width * 0.9 : width * 0.8;
            const startY = height * 0.75;
            
            for (let i = 0; i < 4; i++) {
                ctx.fillRect(
                    isNarrow ? width * 0.05 : width * 0.1,
                    startY - i * (stripeHeight + spacing),
                    stripeWidth,
                    stripeHeight
                );
            }
            break;
        }
        
        case 'split-circle': {
            // Based on case 1 in the Objective-C code
            if (isNarrow) {
                // For narrow mode, draw a half-circle (ellipse) that spans the width
                const centerX = width *.85;
                const centerY = height * .5;
                const radiusX = height * 0.35; // Use height for horizontal radius (after rotation)
                const radiusY = width * 0.7; // Use width for vertical radius (after rotation)
                
                // Draw a half ellipse rotated 90 degrees (right half)
                ctx.beginPath();
                ctx.ellipse(centerX, centerY, radiusX, radiusY, Math.PI/2, 0, Math.PI, false);
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
            } else {
                const slotWidth = isNarrow ? width * 0.87: width * 0.87;
                const slotHeight = isNarrow ? width * 0.1 : width * 0.25;
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
            // Based on case 3 in the Objective-C code
            const size = isNarrow ? width * 0.64 : width * 0.64;
            const x = (width - size) / 2;
            const y = (height - size) / 2;
            
            ctx.fillRect(x, y, size, size);
            break;
        }
        
        case 'frame-dot': {
            // Based on case 4 in the Objective-C code
            const edgeInset = isNarrow ? width * 0.08 : width * 0.1;
            const horizontalStripeWidth = isNarrow ? width * 0.65 : width * 0.56;
            const horizontalStripeHeight = isNarrow ? height * 0.09 : height * 0.078;
            const verticalStripeWidth = isNarrow ? horizontalStripeHeight*2 : horizontalStripeHeight;
            const verticalStripeHeight = isNarrow ? horizontalStripeWidth * 0.9 : horizontalStripeWidth;
            
            // Top
            ctx.fillRect(
                (width - horizontalStripeWidth) / 2,
                edgeInset,
                horizontalStripeWidth,
                horizontalStripeHeight
            );
            
            // Bottom
            ctx.fillRect(
                (width - horizontalStripeWidth) / 2,
                height - edgeInset - horizontalStripeHeight,
                horizontalStripeWidth,
                horizontalStripeHeight
            );
            
            // Left
            ctx.fillRect(
                edgeInset,
                (height - verticalStripeHeight) / 2,
                verticalStripeWidth,
                verticalStripeHeight
            );
            
            
            // Right
            ctx.fillRect(
                width - edgeInset - verticalStripeWidth,
                (height - verticalStripeHeight) / 2,
                verticalStripeWidth,
                verticalStripeHeight
            );
            
            // Center circle
            const circleDiameter = width * 0.187;
            ctx.beginPath();
            ctx.ellipse(
                width / 2,
                height / 2,
                isNarrow ?  circleDiameter : circleDiameter/2,
                circleDiameter / 2,
                0, // rotation
                0,
                Math.PI * 2
            );
            ctx.fill();
            break;
        }
        
        case 'diamonds': {
            const insetX = isNarrow ? width * 0.04 : width * 0.06;
            const insetY = isNarrow ? height * 0.18 : height * 0.2;
            const gap = isNarrow ? width * 0.22 : width * 0.19;
            const midX = width / 2;
            const midY = height / 2;
            
            // Left triangle
          
            
            if (isNarrow) {
                ctx.beginPath();
                ctx.moveTo(width * 0.9, midY);
                ctx.lineTo(width * 0.1 , insetY);
                ctx.lineTo(width * 0.1 , height - insetY);
                ctx.closePath();
                ctx.fill();

            } else {

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
            }
            // Right triangle
           
            break;
        }
    }
    
    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
}

// Export the drawShape function
export { drawShape, drawShapeWithTransition };

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