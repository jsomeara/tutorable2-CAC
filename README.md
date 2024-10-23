<img src="./assets/images/logo.svg?raw=true#gh-light-mode-only" width="600" alt="Tutorable Logo"/>
<img src="./assets/images/logo.svg?raw=true#gh-dark-mode-only" width="600" alt="Tutorable Logo"/>

[Website](https://tutorable.org/)

[⭐ Video Demo](https://youtu.be/kxj85My7x6Y)

***Built for 2024 Congressional App Challenge (WA-09, Representative Adam Smith)***

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
