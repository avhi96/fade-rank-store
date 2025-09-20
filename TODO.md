# TODO: Move Webhook URL to Environment Variable

## Task: Change webhookurl to .env in contact.jsx

### Steps to Complete:
- [x] Replace hardcoded webhook URL in Contact.jsx with environment variable
- [ ] Test the contact form functionality
- [ ] Verify no console errors

### Current Status:
- [x] Plan approved by user
- [x] Implementation completed

### Details:
- **File to modify**: src/pages/Contact.jsx
- **Line to change**: Line 42 in handleSubmit function
- **Current value**: `const webhookUrl = 'https://discordapp.com/api/webhooks/1418606148797464767/ifUqOdiHqJqmIq_T1gQxiFsvVq4KcVCECEfYTLkcr1aRtDDmXAyC03gYJzn1ZBD4b_n1';`
- **New value**: `const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_CONTACT;`
- **Environment variable**: VITE_DISCORD_WEBHOOK_CONTACT
