<p align="center">
<img src="./assets/images/logo.svg?raw=true#gh-light-mode-only" width="600" alt="Tutorable Logo"/>
<img src="./assets/images/logo-dark.svg?raw=true#gh-dark-mode-only" width="600" alt="Tutorable Logo"/>
  <p align="center">
    <a href="https://tutorable.org/" target="_blank">🌐 Live Demo</a>&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://www.youtube.com/watch?v=gvoLHmavgx4" target="_blank">🎞️ Video Demo</a>
  </p>
  <p align="center">
    <b>Built for 2024 Congressional App Challenge (WA-09, Representative Adam Smith)</b>
  </p>
</p>

## Technologies Used
<p float="left" align="center"><img src="https://upload.wikimedia.org/wikipedia/commons/7/70/Docker_logo.png" width="33%" alt="Docker Logo" title="Docker Logo"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="https://rock-the-prototype.com/wp-content/uploads/2022/01/Nuxt_JavaScript_Framework.jpg" width="33%" alt="NuxtJS Logo" title="NuxtJS Logo"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="https://www.cdnlogo.com/logos/t/34/tailwind-css.svg" width="33%" alt="TailwindCSS Logo" title="TailwindCSS Logo"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<img src="https://beginswithai.com/wp-content/uploads/2024/06/claude-3.5-sonnet.png.webp" width="33%" alt="Claude 3.5 Sonnet Logo" title="Claude 3.5 Sonnet Logo"/></p>

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
