# DSH-DDoS-Alerts

> installing nodejs on debian:
```bash
curl https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash 
source ~/.bashrc
nvm install node
npm install -g npm@latest
```
> installing screen and starting a new one
```bash
apt-get install screen
screen -S alerts
node alerts.js
```

> Make sure to replace the DSH-...... with your API token, add your IPs, DiscordUIDs and DiscordWebhooks<br />
> Sends notifications about the attacks, attack updates and attack ends<br />
> The default time for the requests is 45 seconds with 1 second delay between each IP
> You can get the api token via ticket https://dsh.gg/ticket (i recommen an external server to run the script as the api has a whitelist)

### ONLY TESTED WITH DSH-PATH-IPs
