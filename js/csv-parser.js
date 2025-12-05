/**
 * CSV Parser Module
 * Handles parsing and validation of CSV files for participants and prizes
 */

const CSVParser = {
    /**
     * Parses a CSV file for participants
     * @param {File} file - CSV file to parse
     * @returns {Promise<Array<{name: string, ticketNumber: string}>>} Array of participants
     */
    async parseParticipants(file) {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                transformHeader: (header) => {
                    return header.trim().toLowerCase();
                },
                complete: (results) => {
                    try {
                        const participants = this.validateParticipants(results.data);
                        resolve(participants);
                    } catch (error) {
                        reject(error);
                    }
                },
                error: (error) => {
                    reject(new Error(`Error al parsear CSV de participantes: ${error.message}`));
                }
            });
        });
    },

    /**
     * Parses a CSV file for prizes
     * @param {File} file - CSV file to parse
     * @returns {Promise<Array<string>>} Array of prize names
     */
    async parsePrizes(file) {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                transformHeader: (header) => {
                    return header.trim().toLowerCase();
                },
                complete: (results) => {
                    try {
                        const prizes = this.validatePrizes(results.data);
                        resolve(prizes);
                    } catch (error) {
                        reject(error);
                    }
                },
                error: (error) => {
                    reject(new Error(`Error al parsear CSV de premios: ${error.message}`));
                }
            });
        });
    },

    /**
     * Validates and sanitizes participant data
     * @param {Array<Object>} data - Raw parsed data
     * @returns {Array<{name: string, ticketNumber: string}>} Validated participants
     */
    validateParticipants(data) {
        if (!data || data.length === 0) {
            throw new Error('El archivo de participantes está vacío');
        }

        const participants = [];
        const ticketNumbers = new Set();
        const errors = [];

        // Check for required columns
        const firstRow = data[0];
        const hasName = 'name' in firstRow || 'nombre' in firstRow;
        const hasTicket = 'ticketnumber' in firstRow || 'ticket' in firstRow || 'boleto' in firstRow || 'numero' in firstRow;

        if (!hasName || !hasTicket) {
            throw new Error('El CSV debe contener las columnas: name (o nombre) y ticketnumber (o boleto)');
        }

        data.forEach((row, index) => {
            const name = this.sanitize(row.name || row.nombre || '').trim();
            const ticketNumber = this.sanitize(row.ticketnumber || row.ticket || row.boleto || row.numero || '').trim();

            if (!name) {
                errors.push(`Fila ${index + 2}: El nombre está vacío`);
                return;
            }

            if (!ticketNumber) {
                errors.push(`Fila ${index + 2}: El número de boleto está vacío`);
                return;
            }

            if (ticketNumbers.has(ticketNumber)) {
                errors.push(`Fila ${index + 2}: Número de boleto duplicado: ${ticketNumber}`);
                return;
            }

            ticketNumbers.add(ticketNumber);
            participants.push({
                name: name,
                ticketNumber: ticketNumber
            });
        });

        if (errors.length > 0) {
            throw new Error('Errores en el archivo de participantes:\n' + errors.join('\n'));
        }

        if (participants.length === 0) {
            throw new Error('No se encontraron participantes válidos');
        }

        return participants;
    },

    /**
     * Validates and sanitizes prize data
     * @param {Array<Object>} data - Raw parsed data
     * @returns {Array<string>} Validated prizes
     */
    validatePrizes(data) {
        if (!data || data.length === 0) {
            throw new Error('El archivo de premios está vacío');
        }

        const prizes = [];
        const errors = [];

        // Check for required columns
        const firstRow = data[0];
        const hasPrize = 'prize' in firstRow || 'premio' in firstRow || 'prizes' in firstRow || 'premios' in firstRow;

        if (!hasPrize) {
            throw new Error('El CSV debe contener la columna: prize (o premio)');
        }

        data.forEach((row, index) => {
            const prize = this.sanitize(row.prize || row.premio || row.prizes || row.premios || '').trim();

            if (!prize) {
                errors.push(`Fila ${index + 2}: El premio está vacío`);
                return;
            }

            prizes.push(prize);
        });

        if (errors.length > 0) {
            throw new Error('Errores en el archivo de premios:\n' + errors.join('\n'));
        }

        if (prizes.length === 0) {
            throw new Error('No se encontraron premios válidos');
        }

        return prizes;
    },

    /**
     * Sanitizes text to prevent XSS attacks
     * @param {string} text - Text to sanitize
     * @returns {string} Sanitized text
     */
    sanitize(text) {
        if (typeof text !== 'string') {
            return String(text);
        }
        return escapeHTML(text);
    }
};
