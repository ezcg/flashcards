Install aws-cli on your host machine.

Assuming you have already set up a bucket on S3, update the bucket name in package.json. My bucket name was flashcards.ezcg.com and my script block in package.json looks like:

```
scripts": {
    ...snip...
    "deploy": "aws s3 sync build/ s3://flashcards.ezcg.com"
  },
```

To deploy to S3, type on the command line:

```
npm run build && npm run deploy
```
