![Tutorable Logo](./assets/images/logo.svg?raw=true)

## .env file
- Don't forget to setup `.env` file.
- See `.env.example` for details

## Development
- `yarn` (you will need to re-run this command if you modify the whiteboard code)
- `yarn dev` will make the development server live on port 3000

## Production Hosting
- `docker build -t tutorable2 .`
- `docker run -p 29696:3000 --env-file ./.env tutorable2` (modify these command args to suit your specific needs)
- Server will be live on localhost:29696