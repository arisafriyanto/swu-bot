<h1 align="center">SWU BOT</h1>

SWU Bot is a backend service designed to reply to WhatsApp messages using the SWU API to send WhatsApp messages. To provide instant access to STMIK Widya Utama Purwokerto students for important information related to their academic activities. With this chatbot, students can easily access class schedules, GPA values, course grade details, and information about campus locations directly through the WhatsApp platform.

> Base url of this service is: http://localhost:8000

## Installation Guide

#### 1. Clone repository with the following command:
   
   ```bash
   git clone https://github.com/arisafriyanto/swu-bot.git
   ```
    
#### 2. Move to the repository directory with the command:
   
   ```bash
   cd swu-bot
   ```

#### 3. Run the following command to install the depedency:

   ```bash
   npm install
   ```

#### 4. Copy the `.env.example` file, rename it to `.env` and edit the `.env` file in the main directory, making sure the configuration values are appropriate:

   ```bash
    PORT=8000
    ENCRYPT_KEY=YOUR_ENCRYPT_KEY
    API_URL=YOUR_API_URL
   ```
  
#### 5. Start the Services:
    ```bash
    npm run start
    ```

   or

    ```bash
    node index.js
    ```

#### 6. Scan QR Code with WhatsApp

Open the bot's main URL on a browser and scan the generated QR code with your WhatsApp to link the bot to your account.
    
Congratulations! The swu bot service is now successfully running.
<br>
## API Documentation

Explore the SWU API endpoints using the [Postman Collection](https://documenter.getpostman.com/view/33657932/2sA3JGfjHi). The Postman Collection provides detailed information about available endpoints and how to interact with the API.

## Usage

- **WhatsApp Keyword Response:**
  - Send a message containing the keyword to trigger a response from the bot.

- **API for Sending WhatsApp Messages:**
  - Utilize the provided API endpoints to send WhatsApp messages programmatically.

## Contact

For any inquiries or support, please contact the SWU Bot development team at [arisapriyanto.new@gmail.com](mailto:arisapriyanto.new@gmail.com)
#### Thank you for using SWU Bot!
