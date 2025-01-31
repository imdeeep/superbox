# Superbox

## Overview
Superbox is a powerful browser extension-based web app that revolutionizes how you manage chatbot conversations and web content. It serves as a centralized hub for saving multiple chatbot contexts, notes, and web content, making it easier to create project timelines, maintain records, and manage overall context.

What sets Superbox apart is its AI integration, allowing users to ask context-related questions and explore topics beyond their current context. The project was born from the need to overcome chatbot limitations and premium plan restrictions, aiming to provide a seamless experience for generating well-documented final reports and maintaining project momentum.

## Key Features

### Content Management
- **Context Saving**: Save and organize multiple chatbot contexts in one place
- **Web Content Capture**: Save DOM content from any webpage with a single click
- **Notes System**: Quick note-taking functionality for important details
- **Smart Organization**: Efficiently organize and manage all your saved content

### AI Integration
- **Context-Aware AI**: Ask questions related to your saved contexts
- **Extended Learning**: Explore topics beyond your current context
- **Project Timeline**: Create and maintain comprehensive project timelines

### User Experience
- **Responsive Design**: Optimized layout for all screen sizes
- **Intuitive Interface**: User-friendly design for effortless content management
- **Lightweight**: Minimal impact on browser performance
- **Cross-Platform**: Works seamlessly across different browsers

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Google Cloud Platform account (for authentication)
- Gemini API key

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/superbox.git
```

2. **Navigate to project directories**
```bash
# For web application
cd superbox/web

# For extension
cd superbox/extension

# For server
cd superbox/server
```

3. **Install dependencies**
```bash
# Install dependencies in each directory
npm install
```

4. **Environment Configuration**
Create a `.env` file in the server directory with the following configurations:
```env
# Database Configuration
MONGO_URI = "your_mongodb_connection_string"

# Application URLs
FRONTEND_URL = "your_frontend_url"
GOOGLE_CALLBACK_URL = "http://localhost:5000/auth/google/callback"

# Google Authentication
GOOGLE_CLIENT_ID = "your_google_client_id"
GOOGLE_CLIENT_SECRET = "your_google_client_secret"

# API Keys
GOOGLE_GEMINI_API_KEY = "your_gemini_api_key"

# Security
JWT_SECRET = "your_jwt_secret"

# Server Configuration
NODE_ENV = "production"
PORT = "5000"
```

5. **Build the project**
```bash
# In each directory
npm run build
```

6. **Load the extension**
- Open Chrome and navigate to `chrome://extensions/`
- Enable **Developer Mode** in the top-right corner
- Click **Load unpacked**
- Select the `dist` folder from the `superbox/extension` directory

## Usage

### Extension Features
1. **Saving Content**
   - Click the Superbox icon in your browser toolbar
   - Use "Save Context" to capture current webpage content
   - Add quick notes using the "Add Notes" feature

2. **Managing Content**
   - Access all saved contexts from the main interface
   - Copy content with one click
   - Continue previous conversations seamlessly

3. **AI Integration**
   - Ask questions about saved contexts
   - Explore related topics
   - Generate comprehensive reports

## Development

### Project Structure
```
superbox/
├── extension/     # Browser extension code
├── web/          # Web application
└── server/       # Backend server
```

### Running Locally
1. **Start the server**
```bash
cd server
npm run dev
```

2. **Start the web application**
```bash
cd web
npm run dev
```

3. **Development mode for extension**
```bash
cd extension
npm run watch
```

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support
For support, please open an issue in the GitHub repository or contact the maintainers directly.

## Acknowledgments
- Thanks to all contributors who have helped shape Superbox
- Special thanks to the open-source community for their invaluable tools and libraries
