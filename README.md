# beta-random-sandbox-js
Plots chart to compare the beta random number generation using two methods:
1. Using @stdlib/random-base-beta
2. Using simple mathematics of calculating via Random Gamma method where random numbers required for calculation are generated using Math.random()
3. Using simple mathematics of calculating via Random Gamma method where random numbers required for calculation of the same are generated from a normal distribution

The @stdlib/random-base-beta uses "Algorithm BB by Cheng".

Random Gamma method: https://en.wikipedia.org/wiki/Beta_distribution#Random_variate_generation


## How to use

### Install deps
`npm install`

### Specify Parameters
Takes three parameters - 
Shape parameters: `alpha` and `beta`
Number of random numbers to be generated for analysis: `n`

Specify in the top of file `index.js`

```
...deps

// Parameters for the beta distribution
const alpha = 10;
const beta = 64000;

// How many random numbers to be genereate
const n = 50000;

... rest of code
```

Run the script using 
`node index.js`

### How to visualise

Running the script will open an html file with three series:
1. Beta distribution
2. Random std numbers - using stdlib
3. Random raw numbers uniform - using simple method of Random Gamma using Math.random()
4. Random raw numbers normal - using simple method of Random Gamma using normal distribution

Use the interactive plot to visualise the range of random numbers generated via both methods. the chart can be zoomed in to view in detail
