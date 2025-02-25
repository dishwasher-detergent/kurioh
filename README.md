# Portfolio CMS

A modern, minimalist CMS designed for developers and creators to showcase their work. Built with Next.js and Appwrite, this CMS makes it easy to manage and display your portfolio projects through a clean API.

## Features

- 🚀 **Simple Setup**: Get started in minutes with guided installation
- 🎨 **Clean Interface**: Intuitive project management dashboard
- 📱 **Responsive Design**: Works seamlessly across all devices
- 🔑 **API Access**: Easily integrate with your frontend applications
- 🛠️ **Developer Friendly**: Built with modern web technologies

## Key Benefits

- **Zero Configuration**: Deploy and start adding projects right away
- **Flexible Integration**: Use the API with any frontend framework
- **Self-hosted Option**: Full control over your data and infrastructure
- **Cloud Ready**: Optional Appwrite Cloud deployment for quick starts

## How It Works

1. Create an organization
2. Add your portfolio projects
3. Access your content through our RESTful API
4. Display your work on any website or application

Perfect for creating simple portfolio websites. See it in action at [kennethbass.com](https://kennethbass.com)

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
3. appwrite deploy function
   - use **space** to select all functions
   - Update env variables based on the example.env files in each function directory.

## Self Hosting

You will need to setup your own [Appwrite](appwrite.io) instance, at this time Appwrite cloud does not support relationships so you will need to self host Appwrite version 1.3.7+ yourself. You can easily self host your own instance of Appwrite using Digital Ocean. [Find that here](https://marketplace.digitalocean.com/apps/appwrite)

Once everything above is done, you can run these commands below.

1. appwrite login
2. appwrite deploy collection
   - use **space** to select all collections
3. appwrite deploy function
   - use **space** to select all functions

## Congrats, you're done!
