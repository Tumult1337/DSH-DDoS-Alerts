# DDoS Alert Notification Script

This script is designed to monitor DDoS attack incidents using the DSH API and notify Discord users about the attack details through a webhook.

## Setup

1. Replace `TOKEN` with your DSH API token.
2. Modify the `API_REQ_IPS` array with the list of IP addresses you want to monitor, corresponding Discord user IDs, and webhook URLs.
3. Set the desired delay in seconds for how often the script should check for updates.

## Dependencies

The script uses the `xhr2` package for sending HTTP requests. To install it, use the following command:

```bash
npm install xhr2
chmod +x start.sh
chmod +x alerts.sh
```

## Usage
1. Start the script in a screen:
   `bash
     bash start.sh
   `

- The script will periodically check for DDoS attack incidents and send notifications to the specified Discord channels.

## Script Behavior

- The script retrieves DDoS attack incident data from the DSH API and sends notifications to Discord via webhooks.
- It distinguishes between ongoing attacks, new peak updates during an attack, and attack summaries when an attack ends.
- Attack details, such as server information, attack reasons, and traffic statistics, are included in the notifications.

## Webhook Format

- The script constructs a Discord webhook payload with the necessary information.
- It formats the content with details such as attack status, start/end times, traffic peak, and attack reason.

## Important Notes

- This script assumes you have access to the DSH API and valid webhook URLs.
- Ensure you have configured the necessary permissions and endpoints correctly.
- Be cautious with sharing sensitive information like API tokens.

- Make sure to replace the DSH-...... with your API token, add your IPs, DiscordUIDs and DiscordWebhooks<br />
- The default time for the requests is 45 seconds with 1 second delay between each IP
- You can get the api token via ticket https://dsh.gg/ticket (i recommen an external server to run the script as the api has a whitelist)

### ONLY TESTED WITH DSH-PATH-IPs
