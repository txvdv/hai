# Deploy

The site is automatically deployed to Netlify using a GitHub workflow action.

To host it yourself, follow these steps:

1. [Signup for a Netlify account](https://www.netlify.com/)
2. Open a terminal to:
    1. Install [the Netlify CLI](https://docs.netlify.com/cli/get-started/)
    ```shell
    npm install netlify-cli -g
    ```
    2. Login to your account
    ```shell
    netlify login
    ```
    3. Create a site
    ```shell
   netlify sites:create
   ```
3. [Add 2 Github secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository):
    1. NETLIFY_SITE_ID  
    The secret is the created Site ID from the `netlify sites:create` command
    2. NETLIFY_SITE_TOKEN  
    [Create a Netlify personal access token](https://docs.netlify.com/api/get-started/#authentication) and use that as the secret.

To host it somewhere else, modify the GitHub deploy workflow to fit your needs.