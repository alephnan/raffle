# Raffle Application

A professional web application for conducting fair and transparent raffles. Built as a static single-page application with no backend dependencies.

![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Fair & Secure**: Uses Web Crypto API for cryptographically secure random selection
- **No Duplicate Winners**: Each participant can only win once
- **Engaging Animations**: Slot-machine style reveals with confetti celebrations
- **Fully Client-Side**: No backend required, runs entirely in the browser
- **Export Results**: Download raffle results as CSV
- **Responsive Design**: Works on desktop and mobile devices

## Live Demo

Visit the live application: [Your GitHub Pages URL]

## Quick Start

### For Users

1. Visit the application URL
2. Upload your participants CSV file (format: `name,ticketnumber`)
3. Upload your prizes CSV file (format: `prize`)
4. Review the preview and click "Iniciar Sorteo"
5. Watch the animated raffle drawing
6. Download results as CSV

### CSV File Formats

**Participants File** (`participants.csv`):
```csv
name,ticketnumber
Juan Pérez,001
María González,002
Carlos Rodríguez,003
```

**Prizes File** (`prizes.csv`):
```csv
prize
Laptop HP 15"
Mouse Inalámbrico
Teclado Mecánico
```

Example files are available in the `tests/fixtures/` directory.

## Installation for Development

### Prerequisites

- Node.js 16+ (for running tests)
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/raffle-app.git
cd raffle-app
```

2. Install dependencies (for testing only):
```bash
npm install
```

3. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

4. Navigate to `http://localhost:8000`

## Running Tests

```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Project Structure

```
raffle-app/
├── index.html              # Main entry point
├── css/
│   └── styles.css         # Application styles
├── js/
│   ├── app.js            # Main application controller
│   ├── csv-parser.js     # CSV parsing module
│   ├── raffle-engine.js  # Core raffle logic
│   ├── animation.js      # Animation controller
│   ├── ui-controller.js  # DOM manipulation
│   └── utils.js          # Utility functions
├── assets/
│   └── logos/           # Application logos
├── tests/
│   ├── csv-parser.test.js
│   ├── raffle-engine.test.js
│   └── fixtures/        # Test CSV files
├── docs/
│   └── USER-GUIDE.md   # End-user documentation
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions deployment
```

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, flexbox, grid
- **Vanilla JavaScript**: ES6+ features
- **PapaParse**: CSV parsing library
- **Canvas Confetti**: Celebration animations
- **Web Crypto API**: Secure random number generation
- **Jest**: Testing framework

## Security Features

- **Input Validation**: All CSV data is validated and sanitized
- **XSS Prevention**: All user content is escaped before DOM insertion
- **CSP Headers**: Content Security Policy via meta tag
- **Secure Randomness**: Cryptographically secure random selection
- **Client-Side Only**: No data transmission to servers

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

### GitHub Pages

1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. GitHub Actions will automatically deploy on push to `main`

The application is fully static and can be hosted on any static web server.

## Customization

### Brand Colors

Edit CSS variables in `css/styles.css`:

```css
:root {
    --color-primary: #2F59B8;
    --color-secondary: #1790D0;
    --color-accent: #17A2C8;
}
```

### Logos

Replace logo files in `assets/logos/` with your own brand assets.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please open an issue on GitHub.

## Acknowledgments

- PapaParse for CSV parsing
- Canvas Confetti for celebration effects

---

**Built with ❤️**
