# 🧙‍♂️ StoryGenerator - Children's Story Generator

StoryGenerator is a web application built with Next.js that generates personalized children's stories using artificial intelligence. Users can select a theme and describe the story they want, and the application will generate a unique and creative story.

![StoryGenerator Logo](public/file.svg)

## ✨ Features

- 📚 Generation of personalized children's stories
- 🎭 Different themes for stories (fun, bedtime, exciting, educational)
- 🤖 Uses OpenAI API to generate creative stories
- 💻 Kid-friendly and attractive interface
- 🎨 Responsive design with Tailwind CSS

## 🚀 Technologies

- [Next.js 15](https://nextjs.org/) - React Framework
- [React 19](https://react.dev/) - UI Library
- [OpenAI API](https://openai.com/) - AI Text Generation
- [Tailwind CSS 4](https://tailwindcss.com/) - CSS Framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript Superset
- [Turbopack](https://turbo.build/pack) - Optimized Web Bundler

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd storygenerator

# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file in the root of the project and add:
# OPENAI_API_KEY=your_openai_api_key
```

## 🖥️ Usage

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### How to generate a story:

1. Select a theme for your story (fun, bedtime, exciting, educational)
2. Write a description of what you'd like your story to include
3. Click the "Generate Story!" button
4. Enjoy your personalized story!

## 📝 Project Structure

```
storygenerator/
├── public/             # Static files
├── src/
│   ├── app/            # Application routes and pages
│   ├── components/     # Reusable components
│   └── api/            # API endpoints
└── ...                 # Configuration files
```

## 📚 API

The project includes API endpoints for communication with OpenAI:

- `POST /api/openai/message` - Generates a story based on the provided theme and description

## 👨‍💻 Development

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start in production mode
npm start
```

## 📄 License

[MIT](LICENSE)

---

Made with ❤️ as part of the Platzi Next.js 2024 course
