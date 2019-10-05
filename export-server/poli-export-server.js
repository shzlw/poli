const http = require('http');
const puppeteer = require('puppeteer');

const poli = 'http://localhost:6688/poli';
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
      response.end(Buffer.from(pdf));
    }).catch(error => {
      console.log(error);
    })
  } else {
    response.end('Hello Poli!');
  }
});

async function pdfHandler(request) {
  const body = await getPostBody(request);
  const exportRequest = JSON.parse(body);
  const pdf = await generatePDF(exportRequest);
  return pdf;
}

function getPostBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e8) {
        request.connection.destroy();
      }
    });

    request.on('end', () => {
      resolve(body);
    });

    request.on("error", (err) => {
      reject(err);
    });
  });
}


async function generatePDF(exportRequest) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const width = parseInt(exportRequest.width, 10);
  const height = parseInt(exportRequest.height, 10);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const cookie = {
    name: 'pskey',
    value: exportRequest.sessionKey,
    domain: 'localhost',
    path: '/',
    expires: Math.floor(tomorrow.getTime() / 1000)
  };
  await page.setCookie(cookie);
  await page.setViewport({ width: width, height: height });
  await page.goto(poli + '/workspace/report/fullscreen?$showControl=false&$toReport=' + exportRequest.reportName, {waitUntil: 'networkidle2'});
  await page.waitFor(2000);
  const pdf = await page.pdf({
    width: width,
    height: height,
    printBackground: true 
  });
  await browser.close();
  return pdf;
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


