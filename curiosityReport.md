﻿# Curiosity Report: Upptime
## Setting up the Status page
Setting up the upptime page was very easy following the instructions at the website https://upptime.js.org/docs/get-started. The Upptime website is set up as a gh-pages website.

All of the configuration happens on the file `.upptimerc.yml`, including specifying endpoints and changing the messages on the website.

When I tried to set up the CNAME record on Route 53, I accidentally included https:// in the value of the record, so I had to fix that and wait 5 minutes for the new record to propagate.

Another error I encountered is GitHub wasn't recognizing one of the YAML files Upptime automatically made for me, which caused the Setup CI to fail. To remedy this, I had to make a copy of the YAML file for the Setup CI to find.

## Final Status Page
http://pizza-status.tictactoevs.click

### GitHub README.md
<img width="1265" alt="upptime_readme" src="https://github.com/user-attachments/assets/42ea1afb-e10f-4f21-aa85-9702ed63bfe5">

### Status Page
<img width="773" alt="upptime_page" src="https://github.com/user-attachments/assets/7f9c8d77-f4e7-45fe-a2cf-496f9e33c10c">
