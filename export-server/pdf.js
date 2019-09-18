const http = require('http');
const qs = require('querystring');
const puppeteer = require('puppeteer');

const hostname = '127.0.0.1';
const port = 6689;

const server = http.createServer((request, response) => {
  const { 
    url,
    method
  } = request;
  if (url === '/pdf' && method === 'POST') {
    pdfHandler(request).then(pdf => {
      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader('Content-Length', pdf.length);
      response.end(pdf);
    });
  } else {
    response.end('Hello Poli!');
  }
});

async function pdfHandler(request) {
  const body = await getPostBody(request);
  const pdf = await generatePDF(body);
  return pdf;
}


function getPostBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e7) {
        request.connection.destroy();
      }
    });

    request.on('end', () => {
      resolve(qs.parse(body));
    });

    request.on("error", (err) => {
      reject(err);
    });
  });
}

async function generatePDF(data) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const content = data;
  await page.setContent(content);
  // await page.emulateMedia('screen');
  const pdf = await page.pdf({
    path: 'test.pdf', 
    format: 'A4'
  });
  await browser.close();
  return pdf;
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


