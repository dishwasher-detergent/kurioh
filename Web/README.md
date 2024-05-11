Keep your portfolio up-to-date with all your latest and greatest creations!

## Built using 
- Next
- Tailwind
- Appwrite

## Using Appwrite Cloud
You will need to setup an Appwrite Cloud account. [Sign up here.](https://cloud.appwrite.io/register)

Once everything above is done, you can run these commands below.
1. appwrite login
2. appwrite deploy collection
   - use **space** to select all collections
4. appwrite deploy function
   - use **space** to select all functions
   - Update env variables based on the example.env files in each function directory.

## Self Hosting
You will need to setup your own [Appwrite](appwrite.io) instance, at this time Appwrite cloud does not support relationships so you will need to self host Appwrite version 1.3.7+ yourself. You can easily self host your own instance of Appwrite using Digital Ocean. [Find that here](https://marketplace.digitalocean.com/apps/appwrite)

Once everything above is done, you can run these commands below.
1. appwrite login
2. appwrite deploy collection
   - use **space** to select all collections
4. appwrite deploy function
   - use **space** to select all functions

## Congrats, you're done!
