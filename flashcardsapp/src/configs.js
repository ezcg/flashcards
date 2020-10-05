const dev = {
  url:"http://localhost:3000/",
  s3Url:"https://s3.us-east-1.amazonaws.com/flashcards.ezcg.com/",
  flashcardsadminfe:'http://localhost:8081/'
}
const prod = {
  url:"https://flashcards.ezcg.com/",
  s3Url:"https://flashcards.ezcg.com/",
  flashcardsadminfe:'https://flashcardsadminfe.ezcg.com/'
}

const config = process.env.REACT_APP_ENVIRONMENT === 'dev'
  ? dev
  : prod;

export default config;
