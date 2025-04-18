# Vid WatchParty 🎥

A real-time video watching platform that lets you enjoy content together with friends. Watch videos in sync while chatting and interacting with other participants. Built with modern web technologies to create an engaging social watching experience.

## ✨ Features

- **Synchronized Video Playback**: Watch videos together in perfect sync
- **Real-time Chat**: Communicate with other participants through text chat
- **Voice Chat**: Talk with your friends while watching
- **User Profiles**: Customize your profile with avatars and usernames
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Easy on the eyes with automatic theme switching

## 🚀 Tech Stack

- [Next.js 14](https://nextjs.org/) - React Framework
- [Socket.IO](https://socket.io/) - Real-time communication
- [MongoDB](https://www.mongodb.com/) - Database
- [Firebase](https://firebase.google.com/) - Storage and Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn/ui](https://ui.shadcn.com/) - UI Components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB
- Firebase account

## ⚙️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vid-watchparty.git
cd vid-watchparty
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
# Firebase Configuration
FIREBASE_API=your_firebase_api_key

# MongoDB Configuration
url=your_mongodb_connection_string

# JWT Configuration
token_secret=your_jwt_secret_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🎯 Usage

1. Create an account or log in
2. Create a new watch party or join an existing one using the room ID
3. Share the room ID with friends to invite them
4. Start watching videos together!

## 🔒 Environment Variables

The following environment variables are required:

| Variable | Description | Example |
|----------|-------------|---------|
| `FIREBASE_API` | Firebase API Key for authentication and storage | `AIzaSyXXXXXXXXXXXXXXXXXXXXXX` |
| `url` | MongoDB Connection String | `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority` |
| `token_secret` | JWT Secret Key for authentication | A strong random string |

⚠️ **Security Notes:**
- Never commit your `.env` file to version control
- Use strong, unique values for `token_secret`
- Keep your Firebase API key and MongoDB credentials secure
- In production, use more complex JWT secrets
- Consider using environment variable management systems for production deployments

### Setting up Environment Variables in Development

1. Create a `.env.local` file in the root directory
2. Copy the variables above and replace with your values
3. For production, set these variables in your hosting platform's environment configuration

### Setting up Environment Variables in Production

When deploying to production:
1. Use your hosting platform's environment variable management system
2. Set up proper access controls for your MongoDB database
3. Configure Firebase security rules appropriately
4. Use different API keys and databases for development and production

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

- **Keshav Saini** - _Initial work_ - [GitHub](https://github.com/yourusername)
  - Computer Science Student at Indian Institute of Information Technology, Nagpur
  - Full Stack Developer
  - Project developed as part of web development portfolio

### Contact

- LinkedIn: [Keshav Saini](https://www.linkedin.com/in/keshav-saini-190a53256/)
- Email: [Your Email]
- Portfolio: [Your Portfolio]

Feel free to reach out if you have any questions about the project or would like to contribute!

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Firebase](https://firebase.google.com/)
- [MongoDB](https://www.mongodb.com/)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
#   v i d - w a t c h p a r t y 
 
 