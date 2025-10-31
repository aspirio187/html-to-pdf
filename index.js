#!/usr/bin/env node

const puppeteer = require("puppeteer");
const fs = require("node:fs");

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    input: null,
    output: null,
    help: false,
  };

  let i = 0;
  while (i < args.length) {
    const arg = args[i];

    switch (arg) {
      case "--help":
      case "-h":
        params.help = true;
        i++;
        break;
      case "--input":
      case "-i":
        params.input = args[i + 1];
        i += 2;
        break;
      case "--output":
      case "-o":
        params.output = args[i + 1];
        i += 2;
        break;
      default:
        i++;
        break;
    }
  }

  return params;
}

function showHelp() {
  console.log(`
Usage: node index.js [options]

Options:
  -i, --input <file>   Input HTML file path (required)
  -o, --output <file>  Output PDF file path (required)
  -h, --help           Show this help message

Example:
  node index.js -i input.html -o output.pdf
  node index.js --input report.html --output report.pdf
`);
}

(async () => {
  try {
    const params = parseArgs();

    // Show help if requested
    if (params.help) {
      showHelp();
      process.exit(0);
    }

    // Validate required parameters
    if (!params.input) {
      console.error(
        "Error: Input file is required. Use -i or --input to specify the input HTML file."
      );
      showHelp();
      process.exit(1);
    }

    if (!params.output) {
      console.error(
        "Error: Output file is required. Use -o or --output to specify the output PDF file."
      );
      showHelp();
      process.exit(1);
    }

    // Check if input file exists
    if (!fs.existsSync(params.input)) {
      console.error(`Error: Input file '${params.input}' does not exist.`);
      process.exit(1);
    }

    console.log(`Converting '${params.input}' to '${params.output}'...`);

    // Use system Chromium instead of Puppeteer's bundled Chrome
    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser", // or '/usr/bin/chromium' depending on your system
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-first-run",
        "--no-zygote",
        "--single-process", // This helps in WSL
        "--disable-features=VizDisplayCompositor",
      ],
      headless: true, // or 'new' for newer versions
    });

    const page = await browser.newPage();

    // Read the HTML file
    const html = fs.readFileSync(params.input, "utf8");

    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF with exact formatting
    await page.pdf({
      path: params.output,
      format: "A4",
      printBackground: true, // Important for preserving colors
      preferCSSPageSize: false,
      margin: {
        top: "40px",
        bottom: "20px",
        left: "20px",
        right: "20px",
      },
    });

    console.log(`PDF generated successfully: ${params.output}`);
    await browser.close();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
})();
