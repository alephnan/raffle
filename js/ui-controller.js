/**
 * UI Controller Module
 * Manages DOM manipulation and user interactions
 * Updated for cybersecurity theme with click-to-reveal flow
 */

const UIController = {
    elements: {},

    /**
     * Initializes UI controller and caches DOM elements
     */
    init() {
        this.cacheElements();
        this.bindEvents();
    },

    /**
     * Caches all DOM element references
     */
    cacheElements() {
        this.elements = {
            sections: {
                upload: document.getElementById('upload-section'),
                preview: document.getElementById('preview-section'),
                raffle: document.getElementById('raffle-section'),
                results: document.getElementById('results-section')
            },
            header: {
                abortButton: document.getElementById('abort-button')
            },
            upload: {
                participantsDropZone: document.getElementById('participants-drop-zone'),
                participantsFile: document.getElementById('participants-file'),
                participantsStatusText: document.getElementById('participants-status-text'),
                participantsCountValue: document.getElementById('participants-count-value'),
                prizesDropZone: document.getElementById('prizes-drop-zone'),
                prizesFile: document.getElementById('prizes-file'),
                prizesStatusText: document.getElementById('prizes-status-text'),
                prizesCountValue: document.getElementById('prizes-count-value'),
                initializeButton: document.getElementById('initialize-button'),
                error: document.getElementById('upload-error')
            },
            preview: {
                participantsCount: document.getElementById('participants-count'),
                prizesCount: document.getElementById('prizes-count'),
                participantsPreview: document.getElementById('participants-preview'),
                prizesPreview: document.getElementById('prizes-preview'),
                warning: document.getElementById('preview-warning'),
                backButton: document.getElementById('back-to-upload'),
                startButton: document.getElementById('start-raffle')
            },
            raffle: {
                liveIndicator: document.getElementById('live-indicator'),
                progressCounter: document.getElementById('progress-counter'),
                currentPrize: document.getElementById('current-prize'),
                currentPrizeName: document.getElementById('current-prize-name'),
                slotMachine: document.getElementById('slot-machine'),
                slotContent: document.getElementById('slot-content'),
                winnerReveal: document.getElementById('winner-reveal'),
                drawButton: document.getElementById('draw-button'),
                drawButtonText: document.getElementById('draw-button-text'),
                statisticsBar: document.getElementById('statistics-bar'),
                statParticipants: document.getElementById('stat-participants'),
                statPrizes: document.getElementById('stat-prizes'),
                statWinners: document.getElementById('stat-winners'),
                statRemaining: document.getElementById('stat-remaining'),
                completionScreen: document.getElementById('completion-screen'),
                downloadFinalReport: document.getElementById('download-final-report')
            },
            auditLog: {
                container: document.getElementById('audit-log'),
                entries: document.getElementById('audit-entries'),
                downloadButton: document.getElementById('audit-download')
            },
            results: {
                tbody: document.getElementById('results-tbody'),
                downloadButton: document.getElementById('download-results'),
                newRaffleButton: document.getElementById('new-raffle'),
                auditEntries: document.getElementById('results-audit-entries'),
                auditDownload: document.getElementById('results-audit-download')
            },
            modal: {
                overlay: document.getElementById('abort-modal'),
                cancelButton: document.getElementById('abort-cancel'),
                confirmButton: document.getElementById('abort-confirm')
            }
        };
    },

    /**
     * Binds event listeners to UI elements
     */
    bindEvents() {
        const { upload, preview, results, header, modal, raffle } = this.elements;

        // Upload section events
        upload.participantsDropZone.addEventListener('click', (e) => {
            if (e.target === upload.participantsFile) return; // Avoid double dialogs in Chromium
            upload.participantsFile.click();
        });

        upload.prizesDropZone.addEventListener('click', (e) => {
            if (e.target === upload.prizesFile) return; // Avoid double dialogs in Chromium
            upload.prizesFile.click();
        });

        // Prevent file input clicks from bubbling back to the drop zone
        upload.participantsFile.addEventListener('click', (e) => e.stopPropagation());
        upload.prizesFile.addEventListener('click', (e) => e.stopPropagation());

        upload.participantsFile.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0], 'participants');
        });

        upload.prizesFile.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0], 'prizes');
        });

        this.setupDragAndDrop(upload.participantsDropZone, upload.participantsFile, 'participants');
        this.setupDragAndDrop(upload.prizesDropZone, upload.prizesFile, 'prizes');

        // Initialize button
        upload.initializeButton.addEventListener('click', () => {
            window.app.showPreview();
        });

        // Preview section events
        preview.backButton.addEventListener('click', () => {
            this.showSection('upload');
        });

        preview.startButton.addEventListener('click', () => {
            window.app.initializeRaffle();
        });

        // Raffle section events
        raffle.drawButton.addEventListener('click', () => {
            window.app.handleDrawClick();
        });

        raffle.downloadFinalReport.addEventListener('click', () => {
            window.app.downloadResults();
        });

        // Audit log download
        this.elements.auditLog.downloadButton.addEventListener('click', () => {
            window.app.downloadAuditLog();
        });

        // Results section events
        results.downloadButton.addEventListener('click', () => {
            window.app.downloadResults();
        });

        results.newRaffleButton.addEventListener('click', () => {
            window.app.reset();
        });

        results.auditDownload.addEventListener('click', () => {
            window.app.downloadAuditLog();
        });

        // Header abort button
        header.abortButton.addEventListener('click', () => {
            this.showAbortModal();
        });

        // Modal events
        modal.cancelButton.addEventListener('click', () => {
            this.hideAbortModal();
        });

        modal.confirmButton.addEventListener('click', () => {
            this.hideAbortModal();
            window.app.abortRaffle();
        });

        // Close modal on overlay click
        modal.overlay.addEventListener('click', (e) => {
            if (e.target === modal.overlay) {
                this.hideAbortModal();
            }
        });
    },

    /**
     * Sets up drag and drop functionality for a drop zone
     */
    setupDragAndDrop(dropZone, fileInput, type) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.remove('drag-over');
            });
        });

        dropZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                this.handleFileSelect(files[0], type);
            }
        });
    },

    /**
     * Handles file selection
     */
    handleFileSelect(file, type) {
        if (!file) return;

        if (!validateFileSize(file)) {
            this.updateUploadStatus(type, 'ERROR', 0);
            this.showError('El archivo es demasiado grande (maximo 5MB)');
            return;
        }

        if (!file.name.endsWith('.csv')) {
            this.updateUploadStatus(type, 'ERROR', 0);
            this.showError('Solo se aceptan archivos CSV');
            return;
        }

        const dropZone = type === 'participants'
            ? this.elements.upload.participantsDropZone
            : this.elements.upload.prizesDropZone;
        dropZone.classList.add('has-file');

        window.app.handleFileUpload(file, type);
    },

    /**
     * Updates upload status display
     */
    updateUploadStatus(type, status, count) {
        const statusElement = type === 'participants'
            ? this.elements.upload.participantsStatusText
            : this.elements.upload.prizesStatusText;
        const countElement = type === 'participants'
            ? this.elements.upload.participantsCountValue
            : this.elements.upload.prizesCountValue;

        statusElement.textContent = status;
        statusElement.classList.toggle('loaded', status === 'LOADED');
        countElement.textContent = count;

        // Update initialize button state
        this.checkInitializeButton();
    },

    /**
     * Checks if initialize button should be enabled
     */
    checkInitializeButton() {
        const participantsLoaded = this.elements.upload.participantsStatusText.textContent === 'LOADED';
        const prizesLoaded = this.elements.upload.prizesStatusText.textContent === 'LOADED';
        this.elements.upload.initializeButton.disabled = !(participantsLoaded && prizesLoaded);
    },

    /**
     * Shows a specific section and hides others
     */
    showSection(sectionName) {
        Object.values(this.elements.sections).forEach(section => {
            section.classList.remove('active');
        });

        if (this.elements.sections[sectionName]) {
            this.elements.sections[sectionName].classList.add('active');
        }

        // Show/hide abort button based on section
        const showAbort = sectionName === 'raffle';
        this.elements.header.abortButton.classList.toggle('visible', showAbort);
    },

    /**
     * Updates the preview section with participant and prize data
     */
    updatePreview(participants, prizes) {
        const { preview } = this.elements;

        preview.participantsCount.textContent = participants.length;
        preview.prizesCount.textContent = prizes.length;

        const previewParticipants = participants.slice(0, 5);
        preview.participantsPreview.textContent = '';
        previewParticipants.forEach(p => {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.textContent = p.name + ' (Ticket: ' + p.ticketNumber + ')';
            preview.participantsPreview.appendChild(div);
        });

        if (participants.length > 5) {
            const more = document.createElement('div');
            more.className = 'preview-item';
            more.textContent = '... and ' + (participants.length - 5) + ' more';
            more.style.fontStyle = 'italic';
            more.style.color = 'var(--text-muted)';
            preview.participantsPreview.appendChild(more);
        }

        preview.prizesPreview.textContent = '';
        prizes.forEach((prize, index) => {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.textContent = (index + 1) + '. ' + prize;
            preview.prizesPreview.appendChild(div);
        });

        if (prizes.length > participants.length) {
            preview.warning.textContent = 'Warning: More prizes than participants. Only the first ' + participants.length + ' prizes will be distributed.';
            preview.warning.classList.add('show');
            preview.startButton.disabled = false;
        } else {
            preview.warning.classList.remove('show');
            preview.startButton.disabled = false;
        }
    },

    /**
     * Updates progress counter in raffle header
     */
    updateProgressCounter(current, total) {
        this.elements.raffle.progressCounter.textContent = 'PROGRESS: ' + current + ' / ' + total;
    },

    /**
     * Displays current prize being drawn
     */
    displayCurrentPrize(prize) {
        this.elements.raffle.currentPrizeName.textContent = prize;
    },

    /**
     * Updates the draw button state
     */
    updateDrawButton(state) {
        const { drawButton, drawButtonText } = this.elements.raffle;

        switch (state) {
            case 'ready':
                drawButton.disabled = false;
                drawButton.classList.remove('animating');
                drawButtonText.textContent = 'DRAW WINNER';
                break;
            case 'animating':
                drawButton.disabled = true;
                drawButton.classList.add('animating');
                drawButtonText.textContent = 'DRAWING...';
                break;
            case 'revealed':
                drawButton.disabled = false;
                drawButton.classList.remove('animating');
                drawButtonText.textContent = 'NEXT PRIZE';
                break;
            case 'complete':
                drawButton.disabled = true;
                drawButton.classList.remove('animating');
                drawButtonText.textContent = 'COMPLETE';
                break;
            case 'disabled':
                drawButton.disabled = true;
                drawButton.classList.remove('animating');
                drawButtonText.textContent = 'DRAW WINNER';
                break;
        }
    },

    /**
     * Updates statistics bar
     */
    updateStatistics(participants, prizes, winners, remaining) {
        const { statParticipants, statPrizes, statWinners, statRemaining } = this.elements.raffle;
        statParticipants.textContent = participants;
        statPrizes.textContent = prizes;
        statWinners.textContent = winners;
        statRemaining.textContent = remaining;
    },

    /**
     * Creates an audit log entry element using safe DOM methods
     */
    createAuditEntryElement(result, index) {
        const entry = document.createElement('div');
        entry.className = 'audit-entry';

        // Header row
        const header = document.createElement('div');
        header.className = 'audit-entry-header';

        const rank = document.createElement('span');
        rank.className = 'audit-entry-rank';
        rank.textContent = '#' + index;

        const ticket = document.createElement('span');
        ticket.className = 'audit-entry-ticket';
        ticket.textContent = result.winner.ticketNumber;

        header.appendChild(rank);
        header.appendChild(ticket);

        // Name
        const name = document.createElement('div');
        name.className = 'audit-entry-name';
        name.textContent = result.winner.name;

        // Prize
        const prize = document.createElement('div');
        prize.className = 'audit-entry-prize';
        prize.textContent = result.prize;

        entry.appendChild(header);
        entry.appendChild(name);
        entry.appendChild(prize);

        return entry;
    },

    /**
     * Adds an entry to the audit log
     */
    addAuditLogEntry(result, index, total) {
        const { entries } = this.elements.auditLog;

        // Remove empty message if present
        const emptyMsg = entries.querySelector('.audit-empty');
        if (emptyMsg) {
            emptyMsg.remove();
        }

        const entry = this.createAuditEntryElement(result, index);

        // Insert at the top (newest first)
        entries.insertBefore(entry, entries.firstChild);
    },

    /**
     * Clears the audit log
     */
    clearAuditLog() {
        const { entries } = this.elements.auditLog;
        entries.textContent = '';
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'audit-empty';
        emptyDiv.textContent = 'No winners yet';
        entries.appendChild(emptyDiv);
    },

    /**
     * Shows the completion screen
     */
    showCompletionScreen() {
        const { raffle } = this.elements;
        raffle.completionScreen.classList.add('visible');
        raffle.slotMachine.parentElement.style.display = 'none';
        this.updateDrawButton('complete');
    },

    /**
     * Hides the completion screen
     */
    hideCompletionScreen() {
        const { raffle } = this.elements;
        raffle.completionScreen.classList.remove('visible');
        raffle.slotMachine.parentElement.style.display = 'block';
    },

    /**
     * Displays raffle results in the results section
     */
    displayResults(results) {
        const tbody = this.elements.results.tbody;
        tbody.textContent = '';

        results.forEach((result, index) => {
            const row = document.createElement('tr');

            const numCell = document.createElement('td');
            numCell.textContent = index + 1;

            const nameCell = document.createElement('td');
            nameCell.textContent = result.winner.name;

            const ticketCell = document.createElement('td');
            ticketCell.textContent = result.winner.ticketNumber;

            const prizeCell = document.createElement('td');
            prizeCell.textContent = result.prize;

            row.appendChild(numCell);
            row.appendChild(nameCell);
            row.appendChild(ticketCell);
            row.appendChild(prizeCell);

            tbody.appendChild(row);
        });

        // Copy audit log entries to results section
        this.copyAuditLogToResults();
    },

    /**
     * Copies audit log entries to results section using safe DOM cloning
     */
    copyAuditLogToResults() {
        const sourceEntries = this.elements.auditLog.entries;
        const targetEntries = this.elements.results.auditEntries;

        // Clear target
        targetEntries.textContent = '';

        // Clone each child node
        const children = sourceEntries.childNodes;
        for (let i = 0; i < children.length; i++) {
            const clone = children[i].cloneNode(true);
            targetEntries.appendChild(clone);
        }
    },

    /**
     * Shows the abort confirmation modal
     */
    showAbortModal() {
        this.elements.modal.overlay.classList.add('visible');
    },

    /**
     * Hides the abort confirmation modal
     */
    hideAbortModal() {
        this.elements.modal.overlay.classList.remove('visible');
    },

    /**
     * Shows error message
     */
    showError(message) {
        const errorElement = this.elements.upload.error;
        showError(errorElement, message);
    },

    /**
     * Hides error message
     */
    hideError() {
        const errorElement = this.elements.upload.error;
        hideError(errorElement);
    },

    /**
     * Resets the UI to initial state
     */
    reset() {
        // Reset upload section
        this.elements.upload.participantsFile.value = '';
        this.elements.upload.prizesFile.value = '';
        this.elements.upload.participantsDropZone.classList.remove('has-file');
        this.elements.upload.prizesDropZone.classList.remove('has-file');
        this.updateUploadStatus('participants', 'WAITING', 0);
        this.updateUploadStatus('prizes', 'WAITING', 0);

        // Reset raffle section
        this.elements.raffle.slotContent.textContent = '';
        this.elements.raffle.winnerReveal.textContent = '';
        this.elements.raffle.currentPrizeName.textContent = '-';
        this.updateProgressCounter(0, 0);
        this.updateStatistics(0, 0, 0, 0);
        this.updateDrawButton('disabled');
        this.hideCompletionScreen();

        // Clear audit log
        this.clearAuditLog();

        // Hide abort button
        this.elements.header.abortButton.classList.remove('visible');

        this.hideError();
        this.showSection('upload');
    }
};
