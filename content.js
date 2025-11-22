let lastSpokenWord = ""; // Memory to prevent repetition
let currentUtterance = null; // Prevents browser garbage collection

// Force voices to load immediately
window.speechSynthesis.getVoices();

document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
        
        let wordToSpeak = null;

        // STRATEGY A: The "Cursor" Method (For normal typing)
        // Find the span that has the "untyped color" style (this is the cursor)
        const allSpans = Array.from(document.querySelectorAll('span'));
        const cursor = allSpans.find(span => 
            span.style.color && 
            span.style.color.includes('--textinput__color') && 
            span.innerText !== '' &&
            span.innerText.trim() !== ''
        );

        if (cursor) {
            // We found a cursor, so we look at the PREVIOUS word block
            const currentWordBlock = cursor.parentElement; 
            const previousWordBlock = currentWordBlock.previousElementSibling;
            
            if (previousWordBlock) {
                wordToSpeak = previousWordBlock.innerText;
            }
        } 
        // STRATEGY B: The "End of Lesson" Method (If cursor is gone)
        else {
            // If no cursor is found, we might be at the very end.
            // We look for the main text container (div with dir="ltr")
            const container = document.querySelector('div[dir="ltr"]');
            
            if (container && container.lastElementChild) {
                // Grab the very last word block in the list
                wordToSpeak = container.lastElementChild.innerText;
            }
        }

        // --- PROCESSING & SPEAKING ---
        if (wordToSpeak) {
            // 1. Clean the text (Remove the box symbol '' and whitespace)
            let cleanWord = wordToSpeak.replace(/[^a-zA-Z']/g, '').trim();

            // 2. CHECK: Is this word valid?
            if (cleanWord.length > 0) {

                // 3. CHECK: Did we just say this? (Prevents repetition on double space)
                // We use toLowerCase() to ensure case doesn't mess it up
                if (cleanWord.toLowerCase() === lastSpokenWord.toLowerCase()) {
                    console.log("Create duplicate prevented:", cleanWord);
                    return; 
                }

                // 4. Speak it
                console.log("🔊 Pronouncing:", cleanWord);
                
                // Update memory
                lastSpokenWord = cleanWord;

                // Cancel old audio to keep it snappy
                window.speechSynthesis.cancel();

                currentUtterance = new SpeechSynthesisUtterance(cleanWord);
                currentUtterance.rate = 1.1; // Speed
                currentUtterance.lang = 'en-US';
                window.speechSynthesis.speak(currentUtterance);
            }
        }
    }
});

// Optional: Reset memory if user presses "Escape" (to restart lesson manually)
document.addEventListener('keydown', (event) => {
    if (event.key === "Escape") {
        lastSpokenWord = "";
    }
});