const Beta = require("@stdlib/stats-base-dists-beta-ctor");
const randomBeta = require("@stdlib/random-base-beta");
const fs = require("fs");
const { exec } = require("child_process"); // Import child_process module

// Parameters for the beta distribution
const alpha = 15342;
const beta = 1000000;

// How many random numbers to be genereate
const n = 50000;

/**
 * Generates beta distribution using stdlib package
 * @param {*} alpha
 * @param {*} beta
 * @returns
 */
function generateBetaDistribution(alpha, beta) {
  const betaDist = new Beta(alpha, beta);
  return betaDist;
}

/**
 * Generates n random numbers from beta distribution using stdlib package
 * @param {*} alpha
 * @param {*} beta
 * @param {*} n
 */
function generateBetaRandomUsingStdlib(alpha, beta, n) {
  const randomStdlibNumbers = [];
  for (let i = 0; i < n; i++) {
    const rng = randomBeta(alpha, beta);
    randomStdlibNumbers.push(rng);
  }
  return randomStdlibNumbers;
}

function standard_gamma_raw_uniform(shape) {
  let d = shape - 1 / 3;
  let c = 1 / Math.sqrt(9 * d);

  while (true) {
    let x, v;
    do {
      x = Math.random() * 2 - 1;
      v = 1 + c * x;
    } while (v <= 0);

    v = v * v * v;
    let u = Math.random();

    if (u < 1 - 0.0331 * x * x * x * x) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

// Standard Normal variate using Box-Muller transform.
function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}

function standard_gamma_raw_normal(shape) {
  let d = shape - 1 / 3;
  let c = 1 / Math.sqrt(9 * d);

  while (true) {
    let x, v;
    do {
      x = gaussianRandom() * 2 - 1;
      v = 1 + c * x;
    } while (v <= 0);

    v = v * v * v;
    let u = Math.random();

    if (u < 1 - 0.0331 * x * x * x * x) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

function stdLibSample2(alpha, beta) {
  var sigma;
  var flg;
  var mu;
  var A;
  var B;
  var C;
  var L;
  var s;
  var u;
  var x;
  var y;

  A = alpha - 1.0;
  B = beta - 1.0;
  C = A + B;
  L = C * Math.log(C);
  mu = A / C;
  sigma = 0.5 / Math.pow(C, 0.5);

  flg = true;
  while (flg === true) {
    s = gaussianRandom();
    x = mu + s * sigma;
    if (x >= 0.0 && x <= 1.0) {
      u = Math.random();
      y = A * Math.log(x / A);
      y += B * Math.log((1.0 - x) / B);
      y += L + 0.5 * s * s;
      if (y >= Math.log(u)) {
        flg = false;
      }
    }
  }
  return x;
}

function generateBetaRandomUsingRandomGammaUniform(alpha, beta, n) {
  const randomNumbers = [];
  for (let i = 0; i < n; i++) {
    const gamma1 = standard_gamma_raw_uniform(alpha);
    const gamma2 = standard_gamma_raw_uniform(beta);
    randomNumbers.push(gamma1 / (gamma1 + gamma2));
  }
  return randomNumbers;
}

function generateBetaRandomUsingStdlibRaw(alpha, beta, n) {
  const randomNumbers = [];
  for (let i = 0; i < n; i++) {
    const rng = stdLibSample2(alpha, beta);
    randomNumbers.push(rng);
  }
  return randomNumbers;
}

function generateBetaRandomUsingRandomGammaNormal(alpha, beta, n) {
  const randomNumbers = [];
  for (let i = 0; i < n; i++) {
    const gamma1 = standard_gamma_raw_normal(alpha);
    const gamma2 = standard_gamma_raw_normal(beta);
    randomNumbers.push(gamma1 / (gamma1 + gamma2));
  }
  return randomNumbers;
}

function generateBetaDistributionPlotPoints(alpha, beta) {
  const betaDist = generateBetaDistribution(alpha, beta);
  const xValues = [];
  const yValues = [];
  for (let x = 0; x <= 1; x += 0.0001) {
    xValues.push(x);
    yValues.push(betaDist.pdf(x));
  }
  return { xValues, yValues };
}

function plotRandomNumberComparison(alpha, beta, n) {
  const betaDistributionPoints = generateBetaDistributionPlotPoints(
    alpha,
    beta
  );
  const randomStdlibNumbers = generateBetaRandomUsingStdlib(alpha, beta, n);
  const randomRawNumbersUniform = generateBetaRandomUsingRandomGammaUniform(
    alpha,
    beta,
    n
  );
  const randomRawNumbersNormal = generateBetaRandomUsingRandomGammaNormal(
    alpha,
    beta,
    n
  );
  const randomStdlibNumbersSample2 = generateBetaRandomUsingStdlibRaw(
    alpha,
    beta,
    n
  );
  const createHtmlContent = `
    <html>
    <head>
      <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    </head>
    <body>
      <div id="plot"></div>
      <script>
        const xValues = ${JSON.stringify(betaDistributionPoints.xValues)};
        const yValues = ${JSON.stringify(betaDistributionPoints.yValues)};
        const randomNumbers = ${JSON.stringify(randomStdlibNumbers)};
        const randomRawNumbersUniform = ${JSON.stringify(
          randomRawNumbersUniform
        )};
        const randomRawNumbersNormal = ${JSON.stringify(
          randomRawNumbersNormal
        )};
        const randomStdlibNumbersSample2 = ${JSON.stringify(
          randomStdlibNumbersSample2
        )};
        const data = [
          {
            x: xValues,
            y: yValues,
            type: 'scatter',
            mode: 'lines',
            name: 'Beta Distribution'
          },
          {
            x: randomNumbers,
            type: 'histogram',
            name: 'Random Numbers'
          },
          {
            x: randomRawNumbersUniform,
            type: 'histogram',
            name: 'Random Raw Numbers Uniform'
          },
          {
            x: randomRawNumbersNormal,
            type: 'histogram',
            name: 'Random Raw Numbers Normal'
          },
          {
            x: randomStdlibNumbersSample2,
            type: 'histogram',
            name: 'Random Stdlib Numbers Sample2'
            
          }
        ];
        Plotly.newPlot('plot', data);
      </script>
    </body>
    </html>
    `;
  return createHtmlContent;
}

const htmlContent = plotRandomNumberComparison(alpha, beta, n);
// Write the HTML content to a file
fs.writeFileSync("beta-distribution.html", htmlContent, "utf8");

console.log("HTML file created: beta-distribution.html");

// Open the HTML file in the default web browser
exec("open beta-distribution.html", (error) => {
  if (error) {
    console.error("Failed to open the HTML file:", error);
  } else {
    console.log("HTML file created and opened: beta-distribution.html");
  }
});
