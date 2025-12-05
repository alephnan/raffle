/**
 * Raffle Engine Module
 * Implements cryptographically secure random selection for fair raffle draws
 */

const RaffleEngine = {
    /**
     * Gets a cryptographically secure random integer between 0 (inclusive) and max (exclusive)
     * @param {number} max - Maximum value (exclusive)
     * @returns {number} Random integer
     */
    getSecureRandomInt(max) {
        if (max <= 0) {
            throw new Error('Max must be greater than 0');
        }

        const array = new Uint32Array(1);
        const maxUint32 = 0xFFFFFFFF;
        const range = maxUint32 - (maxUint32 % max);

        let randomValue;
        do {
            crypto.getRandomValues(array);
            randomValue = array[0];
        } while (randomValue >= range);

        return randomValue % max;
    },

    /**
     * Performs Fisher-Yates shuffle with cryptographically secure randomness
     * @param {Array} array - Array to shuffle (will be modified in place)
     * @returns {Array} Shuffled array
     */
    secureShuffle(array) {
        const shuffled = [...array];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = this.getSecureRandomInt(i + 1);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    },

    /**
     * Selects a random participant from the pool
     * @param {Array} participants - Array of participant objects
     * @returns {Object} Selected participant
     */
    selectWinner(participants) {
        if (!participants || participants.length === 0) {
            throw new Error('No participants available');
        }

        const index = this.getSecureRandomInt(participants.length);
        return participants[index];
    },

    /**
     * Conducts a complete raffle drawing
     * @param {Array<{name: string, ticketNumber: string}>} participants - Array of participants
     * @param {Array<string>} prizes - Array of prize names
     * @param {Function} onPrizeAwarded - Callback function called after each prize is awarded
     * @returns {Promise<Array<{winner: Object, prize: string}>>} Array of results
     */
    async conductRaffle(participants, prizes, onPrizeAwarded = null) {
        if (!participants || participants.length === 0) {
            throw new Error('No participants provided');
        }

        if (!prizes || prizes.length === 0) {
            throw new Error('No prizes provided');
        }

        if (prizes.length > participants.length) {
            throw new Error('More prizes than participants');
        }

        const results = [];
        const availableParticipants = [...participants];

        for (let i = 0; i < prizes.length; i++) {
            const prize = prizes[i];

            // Select winner
            const winner = this.selectWinner(availableParticipants);

            // Remove winner from pool to prevent winning twice
            const winnerIndex = availableParticipants.findIndex(
                p => p.ticketNumber === winner.ticketNumber
            );
            availableParticipants.splice(winnerIndex, 1);

            const result = {
                winner: winner,
                prize: prize
            };

            results.push(result);

            // Call callback if provided
            if (onPrizeAwarded) {
                await onPrizeAwarded(result, i + 1, prizes.length);
            }
        }

        return results;
    },

    /**
     * Validates that all winners are unique and from the original participant pool
     * @param {Array} results - Raffle results to validate
     * @param {Array} originalParticipants - Original participant list
     * @returns {boolean} True if valid
     */
    validateResults(results, originalParticipants) {
        const winnerTickets = new Set();
        const participantTickets = new Set(
            originalParticipants.map(p => p.ticketNumber)
        );

        for (const result of results) {
            const ticket = result.winner.ticketNumber;

            // Check if winner is from original pool
            if (!participantTickets.has(ticket)) {
                return false;
            }

            // Check for duplicates
            if (winnerTickets.has(ticket)) {
                return false;
            }

            winnerTickets.add(ticket);
        }

        return true;
    }
};
