/**
 * CSV Parser Unit Tests
 */

describe('CSVParser', () => {
    describe('sanitize', () => {
        test('should escape HTML entities', () => {
            const input = '<script>alert("xss")</script>';
            const output = CSVParser.sanitize(input);
            expect(output).not.toContain('<script>');
            expect(output).toContain('&lt;script&gt;');
        });

        test('should handle non-string inputs', () => {
            expect(CSVParser.sanitize(123)).toBe('123');
            expect(CSVParser.sanitize(null)).toBe('null');
            expect(CSVParser.sanitize(undefined)).toBe('undefined');
        });
    });

    describe('validateParticipants', () => {
        test('should validate correct participant data', () => {
            const data = [
                { name: 'John Doe', ticketnumber: '001' },
                { name: 'Jane Smith', ticketnumber: '002' }
            ];

            const result = CSVParser.validateParticipants(data);
            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('John Doe');
            expect(result[0].ticketNumber).toBe('001');
        });

        test('should throw error for empty data', () => {
            expect(() => {
                CSVParser.validateParticipants([]);
            }).toThrow('El archivo de participantes está vacío');
        });

        test('should throw error for missing columns', () => {
            const data = [{ name: 'John Doe' }];
            expect(() => {
                CSVParser.validateParticipants(data);
            }).toThrow('El CSV debe contener las columnas');
        });

        test('should detect duplicate ticket numbers', () => {
            const data = [
                { name: 'John Doe', ticketnumber: '001' },
                { name: 'Jane Smith', ticketnumber: '001' }
            ];

            expect(() => {
                CSVParser.validateParticipants(data);
            }).toThrow('Número de boleto duplicado');
        });

        test('should handle alternative column names', () => {
            const data = [
                { nombre: 'Juan Pérez', boleto: '001' }
            ];

            const result = CSVParser.validateParticipants(data);
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Juan Pérez');
        });
    });

    describe('validatePrizes', () => {
        test('should validate correct prize data', () => {
            const data = [
                { prize: 'Laptop' },
                { prize: 'Mouse' }
            ];

            const result = CSVParser.validatePrizes(data);
            expect(result).toHaveLength(2);
            expect(result[0]).toBe('Laptop');
            expect(result[1]).toBe('Mouse');
        });

        test('should throw error for empty data', () => {
            expect(() => {
                CSVParser.validatePrizes([]);
            }).toThrow('El archivo de premios está vacío');
        });

        test('should throw error for missing columns', () => {
            const data = [{ name: 'Not a prize' }];
            expect(() => {
                CSVParser.validatePrizes(data);
            }).toThrow('El CSV debe contener la columna');
        });

        test('should handle alternative column names', () => {
            const data = [
                { premio: 'Laptop' }
            ];

            const result = CSVParser.validatePrizes(data);
            expect(result).toHaveLength(1);
            expect(result[0]).toBe('Laptop');
        });
    });
});
