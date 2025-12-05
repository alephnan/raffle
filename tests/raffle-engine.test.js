/**
 * Raffle Engine Unit Tests
 */

describe('RaffleEngine', () => {
    describe('getSecureRandomInt', () => {
        test('should generate number within range', () => {
            for (let i = 0; i < 100; i++) {
                const num = RaffleEngine.getSecureRandomInt(10);
                expect(num).toBeGreaterThanOrEqual(0);
                expect(num).toBeLessThan(10);
            }
        });

        test('should throw error for invalid max', () => {
            expect(() => {
                RaffleEngine.getSecureRandomInt(0);
            }).toThrow('Max must be greater than 0');

            expect(() => {
                RaffleEngine.getSecureRandomInt(-5);
            }).toThrow('Max must be greater than 0');
        });
    });

    describe('secureShuffle', () => {
        test('should shuffle array', () => {
            const original = [1, 2, 3, 4, 5];
            const shuffled = RaffleEngine.secureShuffle(original);

            expect(shuffled).toHaveLength(original.length);
            expect(shuffled.sort()).toEqual(original.sort());
        });

        test('should not modify original array', () => {
            const original = [1, 2, 3, 4, 5];
            const copy = [...original];
            RaffleEngine.secureShuffle(original);

            expect(original).toEqual(copy);
        });

        test('should produce different results (statistical)', () => {
            const original = [1, 2, 3, 4, 5];
            const results = new Set();

            for (let i = 0; i < 50; i++) {
                const shuffled = RaffleEngine.secureShuffle(original);
                results.add(shuffled.join(','));
            }

            expect(results.size).toBeGreaterThan(1);
        });
    });

    describe('selectWinner', () => {
        test('should select a participant from the pool', () => {
            const participants = [
                { name: 'John', ticketNumber: '001' },
                { name: 'Jane', ticketNumber: '002' },
                { name: 'Bob', ticketNumber: '003' }
            ];

            const winner = RaffleEngine.selectWinner(participants);
            expect(participants).toContainEqual(winner);
        });

        test('should throw error for empty array', () => {
            expect(() => {
                RaffleEngine.selectWinner([]);
            }).toThrow('No participants available');
        });

        test('should distribute fairly (statistical test)', () => {
            const participants = [
                { name: 'A', ticketNumber: '001' },
                { name: 'B', ticketNumber: '002' },
                { name: 'C', ticketNumber: '003' }
            ];

            const counts = { A: 0, B: 0, C: 0 };
            const iterations = 3000;

            for (let i = 0; i < iterations; i++) {
                const winner = RaffleEngine.selectWinner(participants);
                counts[winner.name]++;
            }

            const expected = iterations / 3;
            const tolerance = expected * 0.15;

            expect(counts.A).toBeGreaterThan(expected - tolerance);
            expect(counts.A).toBeLessThan(expected + tolerance);
            expect(counts.B).toBeGreaterThan(expected - tolerance);
            expect(counts.B).toBeLessThan(expected + tolerance);
            expect(counts.C).toBeGreaterThan(expected - tolerance);
            expect(counts.C).toBeLessThan(expected + tolerance);
        });
    });

    describe('conductRaffle', () => {
        test('should conduct raffle successfully', async () => {
            const participants = [
                { name: 'John', ticketNumber: '001' },
                { name: 'Jane', ticketNumber: '002' },
                { name: 'Bob', ticketNumber: '003' }
            ];

            const prizes = ['Laptop', 'Mouse'];

            const results = await RaffleEngine.conductRaffle(participants, prizes);

            expect(results).toHaveLength(2);
            expect(results[0]).toHaveProperty('winner');
            expect(results[0]).toHaveProperty('prize');
        });

        test('should not allow duplicate winners', async () => {
            const participants = [
                { name: 'John', ticketNumber: '001' },
                { name: 'Jane', ticketNumber: '002' },
                { name: 'Bob', ticketNumber: '003' }
            ];

            const prizes = ['Prize1', 'Prize2', 'Prize3'];

            const results = await RaffleEngine.conductRaffle(participants, prizes);

            const winnerTickets = results.map(r => r.winner.ticketNumber);
            const uniqueTickets = new Set(winnerTickets);

            expect(uniqueTickets.size).toBe(winnerTickets.length);
        });

        test('should throw error for more prizes than participants', async () => {
            const participants = [
                { name: 'John', ticketNumber: '001' }
            ];

            const prizes = ['Prize1', 'Prize2'];

            await expect(
                RaffleEngine.conductRaffle(participants, prizes)
            ).rejects.toThrow('More prizes than participants');
        });

        test('should call callback for each prize', async () => {
            const participants = [
                { name: 'John', ticketNumber: '001' },
                { name: 'Jane', ticketNumber: '002' }
            ];

            const prizes = ['Prize1', 'Prize2'];
            const callback = jest.fn();

            await RaffleEngine.conductRaffle(participants, prizes, callback);

            expect(callback).toHaveBeenCalledTimes(2);
        });
    });

    describe('validateResults', () => {
        test('should validate correct results', () => {
            const participants = [
                { name: 'John', ticketNumber: '001' },
                { name: 'Jane', ticketNumber: '002' }
            ];

            const results = [
                { winner: { ticketNumber: '001' }, prize: 'Prize1' },
                { winner: { ticketNumber: '002' }, prize: 'Prize2' }
            ];

            expect(RaffleEngine.validateResults(results, participants)).toBe(true);
        });

        test('should detect duplicate winners', () => {
            const participants = [
                { name: 'John', ticketNumber: '001' },
                { name: 'Jane', ticketNumber: '002' }
            ];

            const results = [
                { winner: { ticketNumber: '001' }, prize: 'Prize1' },
                { winner: { ticketNumber: '001' }, prize: 'Prize2' }
            ];

            expect(RaffleEngine.validateResults(results, participants)).toBe(false);
        });

        test('should detect invalid winner', () => {
            const participants = [
                { name: 'John', ticketNumber: '001' }
            ];

            const results = [
                { winner: { ticketNumber: '999' }, prize: 'Prize1' }
            ];

            expect(RaffleEngine.validateResults(results, participants)).toBe(false);
        });
    });
});
