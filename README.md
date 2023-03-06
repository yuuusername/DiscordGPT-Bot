# DiscordGPT: A Highly Customisable GPT-Powered Discord Bot #
DiscordGPT is a Discord bot powered by GPT-3.5 which is fully-customisable and has now been refactored to suit the needs of those who would like to host their DiscordGPT bot on their own machines. 

## Features ##
* Continuous conversation - Ask a question and after your bot responds, you can ask a follow-up question that requires context from the first question.
  **Example:** Type "Hey DiscordGPT, who was the winner in the 2016 Olympics?" After your bot shares the results of the Olympics in 2016, you can ask "And what about 2020?" and get the results.
* Message history - Your bot can remember what you said in the past (default 20 messages max). 
* Endless customisation

## Getting Started ##
1. Clone the repository
2. Create a .env file in the root directory with the following contents:
  ```.env
   DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN
   OPENAI_API_KEY=YOUR_OPENAI_API_KEY
   LIB_API_KEY=YOUR_LIB_API_KEY
   DISCORD_CHANNEL_ID=YOUR_DISCORD_CHANNEL_ID
   ```
3. Install dependencies by running `npm install`
4. Start the application with `node index.js`
5. Chat with your bot in the channel you've determined in `.env`!

## To-Do ##
- [ ] A more user friendly setup
- [ ] Add a keyword for bot to keep message in database forever
- [x] Implement the new git-3.5-turbo model

## Acknowledgements ##
This project is a fork of the [DiscordGPT bot](https://autocode.com/openai/templates/discord-gpt/) developed by OpenAI using the GPT-3 language model and hosted on Autocode platform. The original bot was developed to generate text responses based on user input without message history, using text-divinci-003 in Discord servers.

I've made modifications to the original code to suit my specific needs. However, the core functionality of the bot remains the same. I would like to thank Autocode and OpenAI's for their contributions to this project.

This project uses the following libraries:

* Discord.js: (https://discord.js.org/)
* OpenAI GPT-3 API: (https://platform.openai.com/docs/introduction/overview)
* Autocode standard library: (https://github.com/acode/cli)
