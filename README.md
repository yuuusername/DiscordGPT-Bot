# DiscordGPT: A Highly Customisable GPT-Powered Discord Bot #
DiscordGPT is a Discord bot powered by GPT-3.5, the same model that powers OpenAI's ChatGPT. The bot is fully-customisable and suits the needs of those who would like to host their own DiscordGPT bot on their own machines. 

## Features ##
* Continuous conversation - Ask a question and after your bot responds, you can ask a follow-up question that requires context from the first question.
  
  **Example:** Type "Hey DiscordGPT, who was the winner in the 2016 Olympics?" After your bot shares the results of the Olympics in 2016, you can ask "And what about 2020?" and get the results.
* Message history - Your bot can remember what you said in the past (default 20 messages max). 
* A customisable personality
* Endless customisation

## Requirements ##
* [Node.js](https://nodejs.org/en/)

## Getting Started ##
1. Clone the repository.
2. Rename `.env.template` file to `.env` in the root directory and fill in the following properties:
    * `DISCORD_TOKEN`: [Create a bot](https://discord.com/developers/applications/), selecting 'New Application' and following the steps to 'Create'. Once created, click 'Bot' on the left menu, 'Add Bot', then 'View Token'. The token that pops up should be coppied and pasted into the `.env` file, replacing `YOUR_DISCORD_BOT_TOKEN`.
    * `CLIENT_ID`: [View your applications](https://discord.com/developers/applications/), select your bot, click 'OAuth2', copy client id and paste into the `.env` file, replacing `YOUR_CLIENT_ID`.
    * `OPENAI_API_KEY`: [Open the API Keys page](https://platform.openai.com/account/api-keys) and create/login to an account, click 'Create new secret key' which allows you to copy the key and paste it into the `.env` file, replacing `YOUR_OPENAI_API_KEY`.
    * `DISCORD_CHANNEL_ID`: Right-click the desired channel for your bot to speak in, selecting the bottom most option 'Copy ID' and paste it into the `.env` file, replacing `YOUR_DISCORD_CHANNEL_ID`.
3. Edit `prompt-template.js` (optional) and rename to `prompt.js`
    * When editing `prompt.js` ensure that each message is in the format provided in the template `{role: "<whatever_role>", content: '<your_message>'}`, see [OpenAI's Documentation](https://platform.openai.com/docs/guides/chat/introduction).
4. Install dependencies by running `npm install`.
5. Start the application with `node index.js`.
6. Click or copy the URL in your console into the browser and select the server you want your bot to be invited into.
7. Chat with your bot in the channel you've determined in `.env`!

## To-Do ##
- [ ] Add a banned and increased likelihood word list (https://help.openai.com/en/articles/5247780-using-logit-bias-to-define-token-probability)
- [ ] Improve prompt influence
- [ ] Migrate instructions to the Wiki
- [ ] Improve error handling UX
- [x] Add a keyword/command for bot to keep information in database forever
- [x] Add indication that message has been received and generation is processing (bot is typing, etc.)
- [x] A more user friendly setup
- [x] Implement the new gpt-3.5-turbo model

## Acknowledgements ##
This project is a fork of the [DiscordGPT bot](https://autocode.com/openai/templates/discord-gpt/) developed by OpenAI using the GPT-3 language model and hosted on Autocode platform. The original bot was developed to generate text responses based on user input without message history, using text-divinci-003 in Discord servers.

I've made modifications to the original code to suit my specific needs. However, the core functionality of the bot remains the same. I would like to thank Autocode and OpenAI's for their contributions to this project.

This project uses the following libraries:

* Discord.js: (https://discord.js.org/)
* OpenAI GPT-3.5 API: (https://platform.openai.com/docs/guides/chat)
