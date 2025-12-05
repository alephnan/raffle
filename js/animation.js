/**
 * Animation Controller Module
 * Handles all visual animations for the raffle application
 */

const AnimationController = {
    /**
     * Slot machine animation - scrolls through participant names
     * @param {HTMLElement} element - Element to animate
     * @param {Array<string>} names - Array of all participant names
     * @param {string} winner - Final winner name to display
     * @param {number} duration - Animation duration in milliseconds
     * @returns {Promise} Resolves when animation completes
     */
    async slotMachineAnimation(element, names, winner, duration = 3000) {
        if (!element || !names || names.length === 0) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const startTime = Date.now();
            const endTime = startTime + duration;

            // Start with fast interval, slow down gradually
            let currentInterval = 50; // Start at 50ms
            const maxInterval = 300; // Slow down to 300ms

            let currentIndex = 0;

            const updateName = () => {
                const now = Date.now();
                const elapsed = now - startTime;
                const progress = elapsed / duration;

                if (progress >= 1) {
                    // Animation complete - show winner
                    element.textContent = winner;
                    element.style.transform = 'scale(1)';
                    resolve();
                    return;
                }

                // Show random name from the pool
                currentIndex = (currentIndex + 1) % names.length;
                element.textContent = names[currentIndex];

                // Add scale effect
                element.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, currentInterval / 2);

                // Gradually slow down the animation
                currentInterval = 50 + (maxInterval - 50) * Math.pow(progress, 2);

                setTimeout(updateName, currentInterval);
            };

            updateName();
        });
    },

    /**
     * Reveals the winner with a zoom effect
     * @param {HTMLElement} element - Element to display winner
     * @param {string} winnerName - Name of the winner
     * @param {string} prize - Prize name
     * @returns {Promise} Resolves when animation completes
     */
    async revealWinner(element, winnerName, prize) {
        if (!element) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            // Set initial state
            element.textContent = `¡${winnerName}!`;
            element.style.opacity = '0';
            element.style.transform = 'scale(0.5)';
            element.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

            // Trigger animation
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
            }, 50);

            // Resolve after animation completes
            setTimeout(() => {
                resolve();
            }, 600);
        });
    },

    /**
     * Triggers confetti celebration animation
     * @param {number} duration - Duration of confetti in milliseconds
     * @returns {Promise} Resolves when animation completes
     */
    async confettiAnimation(duration = 2000) {
        if (typeof confetti === 'undefined') {
            console.warn('Confetti library not loaded');
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const endTime = Date.now() + duration;

            // Brand colors
            const colors = ['#2F59B8', '#1790D0', '#17A2C8', '#FFD700', '#FFF'];

            // Fire confetti multiple times
            const interval = setInterval(() => {
                confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.8 },
                    colors: colors
                });

                confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.8 },
                    colors: colors
                });

                if (Date.now() >= endTime) {
                    clearInterval(interval);
                    resolve();
                }
            }, 250);
        });
    },

    /**
     * Updates progress bar
     * @param {HTMLElement} progressBar - Progress bar element
     * @param {number} current - Current progress value
     * @param {number} total - Total value
     */
    updateProgress(progressBar, current, total) {
        if (!progressBar) return;

        const percentage = (current / total) * 100;
        progressBar.style.width = `${percentage}%`;
        progressBar.style.transition = 'width 0.3s ease-in-out';
    }
};
