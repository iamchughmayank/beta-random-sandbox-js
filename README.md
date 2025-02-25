# beta-random-sandbox-js
Plots chart to compare the beta random number generation using two methods:
1. Using @stdlib/random-base-beta
2. Using simple mathematics of calculating via Random Gamma method where random numbers required for calculation are generated using Math.random()
3. Using simple mathematics of calculating via Random Gamma method where random numbers required for calculation of the same are generated from a normal distribution
4. Using @stdlib/random-base-beta but instead of using the library, manually coding in the condition which will get called for the case `alpha, beta > 1` - mostly our use case.

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
5. Random raw numbers stdlib sampl2 - copy/pasting the logic which will get executed for our case in stdlib: https://github.com/stdlib-js/random-base-beta/blob/9df02d1a13a74070704b66c9386ec9e70fefd225/lib/beta.js#L47

Use the interactive plot to visualise the range of random numbers generated via both methods. the chart can be zoomed in to view in detail
