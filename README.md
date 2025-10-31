# HTML to PDF CLI

A command-line tool to convert HTML files to PDF using Puppeteer and Chromium. Preserves styling, backgrounds, and formatting with customizable margins.

## Installation

Install globally via npm:

```bash
npm install -g html-to-pdf-cli
```

## Usage

```bash
html-to-pdf -i input.html -o output.pdf
```

### Options

- `-i, --input <file>` - Input HTML file path (required)
- `-o, --output <file>` - Output PDF file path (required)
- `-h, --help` - Show help message

### Examples

```bash
# Convert a single HTML file
html-to-pdf -i report.html -o report.pdf

# Using long options
html-to-pdf --input invoice.html --output invoice.pdf
```

## Features

- ✅ Preserves CSS styling and backgrounds
- ✅ A4 format with customizable margins
- ✅ Uses system Chromium for reliable rendering
- ✅ Handles complex layouts and fonts
- ✅ Fast and lightweight

## Requirements

- Node.js 14.0.0 or higher
- Chromium browser installed on your system

## License

MIT

## Author

Soultan Hatsijev
