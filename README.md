# DiscordGPT: A Highly Customisable GPT-Powered Discord Bot #
DiscordGPT is a Discord bot powered by GPT-3 which is fully-customisable and has now been refactored to suit the needs of those who would like to host their DiscordGPT bot on their own machines. 

The forked version includes message conversation history retention. It retains the last 10 messages for all users combined.

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

## To-Do ##
- [ ] Refactor to support the new git-3.5-turbo model

## Acknowledgements ##
This project is a fork of the [DiscordGPT bot](https://autocode.com/openai/templates/discord-gpt/) developed by OpenAI using the GPT-3 language model and hosted on Autocode platform. The original bot was developed to generate text responses based on user input without message history in Discord servers.

I've made some modifications to the original code to suit my specific needs. However, the core functionality of the bot remains the same. I would like to thank Autocode and OpenAI's for their contributions to this project.

This project uses the following libraries:

* Discord.js: (https://discord.js.org/)
* OpenAI GPT-3 API: (https://platform.openai.com/docs/introduction/overview)
* Autocode standard library: (https://github.com/acode/cli)
