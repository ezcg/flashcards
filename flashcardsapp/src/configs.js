const dev = {
  url:"//localhost:3000/",
  s3Url:"//s3.us-east-1.amazonaws.com/flashcards.full-stack-dev.net/",
  flashcardsadminfe:'//localhost:8081/'
}
const prod = {
  url:"//flashcards.full-stack-dev.net/",
  s3Url:"//flashcards.full-stack-dev.net/",
  flashcardsadminfe:'//flashcardsadminfe.full-stack-dev.net/'
}

const config = process.env.REACT_APP_ENVIRONMENT === 'dev'
  ? dev
  : prod;

export default config;
