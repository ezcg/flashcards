const dev = {
  url:"http://localhost:3000/",
  s3Url:"http://s3.us-east-1.amazonaws.com/flashcards.full-stack-dev.net",
  flashcardsadminfe:'http://localhost:8081/'
}
const prod = {
  url:"http://flashcards.full-stack-dev.net/",
  s3Url:"http://flashcards.full-stack-dev.net/",
  flashcardsadminfe:'http://flashcardsadminfe.full-stack-dev.net/'
}

const config = process.env.REACT_APP_ENVIRONMENT === 'dev'
  ? dev
  : prod;

export default config;
