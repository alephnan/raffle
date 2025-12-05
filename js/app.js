/**
 * Main Application Controller
 * Orchestrates all modules and manages application state
 * Updated for click-to-reveal raffle flow
 */

class RaffleApp {
    constructor() {
        this.state = {
            participants: null,
            prizes: null,
            results: [],
            participantsFile: null,
            prizesFile: null,
            // New state for click-to-reveal flow
            currentPrizeIndex: 0,
            availableParticipants: [],
            prizesToUse: [],
            raffleState: 'idle' // 'idle' | 'ready' | 'animating' | 'revealed' | 'complete'
        };

        this.init();
    }

    /**
     * Initializes the application
     */
    init() {
        // Initialize particles background
        if (typeof ParticlesConfig !== 'undefined') {
            ParticlesConfig.init();
        }

        UIController.init();
        console.log('Raffle Application initialized - Secure Selection System v1.0');
    }

    /**
     * Handles file upload
     */
    async handleFileUpload(file, type) {
        try {
            UIController.hideError();

            if (type === 'participants') {
                this.state.participantsFile = file;
                this.state.participants = await CSVParser.parseParticipants(file);
                UIController.updateUploadStatus('participants', 'LOADED', this.state.participants.length);
                console.log('Loaded ' + this.state.participants.length + ' participants');
            } else if (type === 'prizes') {
                this.state.prizesFile = file;
                this.state.prizes = await CSVParser.parsePrizes(file);
                UIController.updateUploadStatus('prizes', 'LOADED', this.state.prizes.length);
                console.log('Loaded ' + this.state.prizes.length + ' prizes');
            }

        } catch (error) {
            console.error('Error loading ' + type + ':', error);
            UIController.showError(error.message);
            UIController.updateUploadStatus(type, 'ERROR', 0);

            if (type === 'participants') {
                this.state.participants = null;
                this.state.participantsFile = null;
            } else {
                this.state.prizes = null;
                this.state.prizesFile = null;
            }
        }
    }

    /**
     * Shows the preview section
     */
    showPreview() {
        if (!this.state.participants || !this.state.prizes) {
            UIController.showError('Please upload both files first');
            return;
        }

        this.state.prizesToUse = this.state.prizes.length > this.state.participants.length
            ? this.state.prizes.slice(0, this.state.participants.length)
            : this.state.prizes;

        UIController.updatePreview(this.state.participants, this.state.prizesToUse);
        UIController.showSection('preview');
    }

    /**
     * Initializes the raffle (replaces startRaffle)
     * Sets up state for click-to-reveal flow
     */
    initializeRaffle() {
        try {
            // Reset results
            this.state.results = [];
            this.state.currentPrizeIndex = 0;

            // Create a copy of participants for the available pool
            this.state.availableParticipants = [...this.state.participants];

            // Show raffle section
            UIController.showSection('raffle');

            // Initialize UI
            UIController.clearAuditLog();
            UIController.hideCompletionScreen();

            // Update statistics
            this.updateStatisticsDisplay();

            // Update progress
            UIController.updateProgressCounter(0, this.state.prizesToUse.length);

            // Display first prize
            this.displayCurrentPrizeInfo();

            // Set state to ready
            this.state.raffleState = 'ready';
            UIController.updateDrawButton('ready');

            console.log('Raffle initialized with ' + this.state.prizesToUse.length + ' prizes');

        } catch (error) {
            console.error('Error initializing raffle:', error);
            UIController.showError('Error initializing raffle: ' + error.message);
            UIController.showSection('preview');
        }
    }

    /**
     * Displays information about the current prize
     */
    displayCurrentPrizeInfo() {
        const prize = this.state.prizesToUse[this.state.currentPrizeIndex];
        UIController.displayCurrentPrize(prize);
    }

    /**
     * Updates the statistics display
     */
    updateStatisticsDisplay() {
        const totalParticipants = this.state.participants.length;
        const totalPrizes = this.state.prizesToUse.length;
        const winners = this.state.results.length;
        const remaining = totalPrizes - winners;

        UIController.updateStatistics(totalParticipants, totalPrizes, winners, remaining);
    }

    /**
     * Handles draw button click
     * Either draws a winner or proceeds to next prize
     */
    async handleDrawClick() {
        if (this.state.raffleState === 'ready') {
            await this.drawNextWinner();
        } else if (this.state.raffleState === 'revealed') {
            this.proceedToNextPrize();
        }
    }

    /**
     * Draws the next winner
     */
    async drawNextWinner() {
        try {
            this.state.raffleState = 'animating';
            UIController.updateDrawButton('animating');

            // Clear previous winner display
            UIController.elements.raffle.winnerReveal.textContent = '';

            // Select winner
            const prize = this.state.prizesToUse[this.state.currentPrizeIndex];
            const winner = RaffleEngine.selectWinner(this.state.availableParticipants);

            // Remove winner from available pool
            const winnerIndex = this.state.availableParticipants.findIndex(
                p => p.ticketNumber === winner.ticketNumber
            );
            if (winnerIndex > -1) {
                this.state.availableParticipants.splice(winnerIndex, 1);
            }

            // Create result object
            const result = { winner, prize };

            // Get all participant names for animation
            const participantNames = this.state.participants.map(p => p.name);

            // Run slot machine animation
            await AnimationController.slotMachineAnimation(
                UIController.elements.raffle.slotContent,
                participantNames,
                winner.name,
                3000
            );

            // Reveal winner
            await AnimationController.revealWinner(
                UIController.elements.raffle.winnerReveal,
                winner.name,
                prize
            );

            // Run confetti
            await AnimationController.confettiAnimation(2000);

            // Add to results
            this.state.results.push(result);

            // Update UI
            const currentIndex = this.state.currentPrizeIndex + 1;
            UIController.addAuditLogEntry(result, currentIndex, this.state.prizesToUse.length);
            UIController.updateProgressCounter(currentIndex, this.state.prizesToUse.length);
            this.updateStatisticsDisplay();

            // Check if complete
            if (currentIndex >= this.state.prizesToUse.length) {
                this.state.raffleState = 'complete';
                await this.completeRaffle();
            } else {
                this.state.raffleState = 'revealed';
                UIController.updateDrawButton('revealed');
            }

        } catch (error) {
            console.error('Error drawing winner:', error);
            UIController.showError('Error drawing winner: ' + error.message);
            this.state.raffleState = 'ready';
            UIController.updateDrawButton('ready');
        }
    }

    /**
     * Proceeds to the next prize
     */
    proceedToNextPrize() {
        this.state.currentPrizeIndex++;

        // Clear winner display
        UIController.elements.raffle.winnerReveal.textContent = '';
        UIController.elements.raffle.slotContent.textContent = '';

        // Display next prize
        this.displayCurrentPrizeInfo();

        // Set state to ready
        this.state.raffleState = 'ready';
        UIController.updateDrawButton('ready');
    }

    /**
     * Completes the raffle
     */
    async completeRaffle() {
        // Validate results
        const isValid = RaffleEngine.validateResults(this.state.results, this.state.participants);
        if (!isValid) {
            console.warn('Results validation failed');
        }

        console.log('Raffle completed successfully', this.state.results);

        // Wait a moment before showing completion
        await sleep(1000);

        // Show completion screen
        UIController.showCompletionScreen();
    }

    /**
     * Aborts the current raffle (called after confirmation)
     */
    abortRaffle() {
        console.log('Raffle aborted');
        this.reset();
    }

    /**
     * Shows the results section
     */
    showResults() {
        UIController.displayResults(this.state.results);
        UIController.showSection('results');
    }

    /**
     * Downloads results as CSV
     */
    downloadResults() {
        if (!this.state.results || this.state.results.length === 0) {
            return;
        }

        const data = [
            ['#', 'Winner', 'Ticket', 'Prize']
        ];

        this.state.results.forEach((result, index) => {
            data.push([
                (index + 1).toString(),
                result.winner.name,
                result.winner.ticketNumber,
                result.prize
            ]);
        });

        const timestamp = new Date().toISOString().slice(0, 10);
        downloadCSV('raffle_results_' + timestamp + '.csv', data);
    }

    /**
     * Downloads audit log as CSV
     */
    downloadAuditLog() {
        if (!this.state.results || this.state.results.length === 0) {
            return;
        }

        const data = [
            ['Sequence', 'Timestamp', 'Winner Name', 'Ticket Number', 'Prize Awarded']
        ];

        const now = new Date();
        this.state.results.forEach((result, index) => {
            data.push([
                (index + 1).toString(),
                now.toISOString(),
                result.winner.name,
                result.winner.ticketNumber,
                result.prize
            ]);
        });

        const timestamp = new Date().toISOString().slice(0, 10);
        downloadCSV('audit_log_' + timestamp + '.csv', data);
    }

    /**
     * Resets the application to initial state
     */
    reset() {
        this.state = {
            participants: null,
            prizes: null,
            results: [],
            participantsFile: null,
            prizesFile: null,
            currentPrizeIndex: 0,
            availableParticipants: [],
            prizesToUse: [],
            raffleState: 'idle'
        };

        UIController.reset();
        console.log('Application reset');
    }
}

window.app = new RaffleApp();
