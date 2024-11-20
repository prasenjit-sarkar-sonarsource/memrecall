# Content Summarizer Chrome Extension

A powerful Chrome extension that summarizes web content, YouTube videos, PDFs, Podcast, Blogs, Wikipedia using OpenAI's GPT API. Get concise or detailed summaries with keyword extraction and content categorization.

```mermaid
graph LR
    %% Main Components
    User((User)) --> |Interacts| P[Popup UI]
    User --> |Configures| S[Settings Page]
    
    %% Core Components
    subgraph "Chrome Extension Components"
        P[Popup UI] --> |Triggers| BG[Background Script]
        S[Settings Page] --> |Saves| CS[(Chrome Storage)]
        BG --> |Reads| CS
        BG --> |Injects| CON[Content Script]
        CON --> |Extracts| C[Content]
    end

    %% Content Processing
    subgraph "Content Detection & Extraction"
        C --> |Detects| CT{Content Type}
        CT -->|Article| WA[Web Articles]
        CT -->|Video| YT[YouTube]
        CT -->|Document| PD[PDF Documents]
        CT -->|Audio| PC[Podcasts]
        CT -->|Blog| BL[Blog Posts]
        CT -->|Wiki| WK[Wikipedia]

        %% Content Handlers
        subgraph "Specialized Handlers"
            WA --> |Extract| TEX[Text Extractor]
            YT --> |Extract| VID[Video Info & Transcripts]
            PD --> |Extract| PDF[PDF Parser]
            PC --> |Extract| AUD[Audio Transcripts]
            BL --> |Extract| BLG[Blog Parser]
            WK --> |Extract| WIKI[Wiki Parser]
        end
    end

    %% API Integration
    subgraph "OpenAI API Processing"
        BG --> |Sends| API[OpenAI API]
        API --> |1. Summarizes| SP[Summary Processing]
        API --> |2. Translates| TP[Translation Processing]
        API --> |3. Categorizes| CP[Content Categories]
        API --> |4. Keywords| KW[Keyword Extraction]
    end

    %% Results Processing
    SP --> |Returns| SUM[Summary]
    TP --> |Returns| TR[Translated Content]
    CP --> |Returns| CAT[Categories]
    KW --> |Returns| KEY[Keywords]

    %% Storage
    subgraph "Data Storage"
        SUM --> |Stores| CS
        TR --> |Stores| CS
        CAT --> |Stores| CS
        KEY --> |Stores| CS
    end

    %% Styling
    classDef primary fill:#6750a4,stroke:#333,stroke-width:2px,color:white;
    classDef secondary fill:#2c2d31,stroke:#333,stroke-width:2px,color:white;
    classDef handler fill:#4a90e2,stroke:#333,stroke-width:2px,color:white;
    classDef api fill:#87CEEB,stroke:#333,stroke-width:2px;
    classDef storage fill:#FFB6C1,stroke:#333,stroke-width:2px;
    
    class P,S,BG,CON primary;
    class WA,YT,PD,PC,BL,WK secondary;
    class TEX,VID,PDF,AUD,BLG,WIKI handler;
    class API api;
    class CS storage;
```

## 🌟 Features

- **Smart Content Detection**: Automatically detects and processes different types of content:
  - Web Articles
  - YouTube Videos
  - PDF Documents
  - Podcast
  - Blogs
  - Wikipedia

- **Dual Summary Modes**:
  - Concise: Quick overview with key points
  - Detailed: Comprehensive analysis with more context

- **Advanced Processing**:
  - Automatic content categorization
  - Keyword extraction
  - Content type tagging
  - Save summaries for offline access

- **User-Friendly Interface**:
  - Clean, modern design
  - Dark/light theme support
  - Keyboard shortcuts
  - Copy and export options

## 🛠 Prerequisites

Before installing the extension, ensure you have:

1. Node.js (v14 or higher)
2. npm (v6 or higher)
3. Chrome browser (v88 or higher)
4. OpenAI API key

## 📥 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/stretchcloud/memrecall.git
   cd memcall
   ```

2. **Set Up Environment**
   ```bash
   # Install dependencies
   npm install

   # Create .env file
   cp .env.example .env
   ```

3. **Configure API Key**
   - Open `.env` file
   - Add your OpenAI API key:
     ```env
     OPENAI_API_KEY=your_api_key_here
     ```

4. **Build the Extension**
   ```bash
   npm init -y
   npm install dotenv-webpack
   npm install --save-dev @babel/preset-env babel-plugin-transform-react-jsx
   npm install marked
   npm install --save-dev @babel/core @babel/preset-react babel-loader webpack webpack-cli
   npm install react react-dom lucide-react
   npm run build
   ```

## 🚀 Loading the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top-right corner)
3. Click "Load unpacked"
4. Select the extension's directory

## 💡 Usage

### Basic Usage
1. Click the extension icon in Chrome toolbar
2. Select summary mode (Concise/Detailed)
3. Click "Summarize" button

### 🌍 Translation Features
The extension supports automatic translation of summaries into multiple languages:

#### Supported Languages

- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German
- 🇮🇹 Italian
- 🇵🇹 Portuguese
- 🇷🇺 Russian
- 🇯🇵 Japanese
- 🇰🇷 Korean
- 🇨🇳 Chinese (Simplified)
  

![image](https://github.com/user-attachments/assets/51f50d39-e14a-4390-839e-c5967de06392)


#### Translation Settings

1. Access settings through the extension options 
2. Select your preferred target language
3. Enable/disable autosave for translated summaries
4. All new summaries will be automatically translated

#### How Translation Works

- Content is first summarized in the original language
- If a target language is selected, the summary is automatically translated
- Both original and translated versions are saved
- Switch between languages anytime

#### Note on Translation Quality

- Translations are powered by OpenAI's API
- Technical and domain-specific terms are preserved
- Context and meaning are maintained across languages

### Keyboard Shortcuts
- `Ctrl+Shift+S` (Windows/Linux) or `Cmd+Shift+S` (Mac): Open summarizer
- `Alt+S`: Summarize current page

### Features Diagram

```mermaid
graph TD
    A[Web Page] --> B[Content Detection]
    B --> C{Content Type}
    C -->|Web Article| D[Extract Text]
    C -->|YouTube| E[Extract Video Info]
    C -->|PDF| F[Extract PDF Content]
    C -->|Podcast| X[Extract Podcast Info]
    C -->|Blogs| Y[Extract Blog Articles Info]
    C -->|Wikipedia| Z[Extract Wikipedia Content]
    D --> G[Summarization]
    E --> G
    F --> G
    X --> G
    Y --> G
    Z --> G
    G --> H[Generate Summary]
    H --> I[Keywords]
    H --> J[Categories]
    I --> K[Display Results]
    J --> K
```

## 🗂 Project Structure

```
memcall/
├── components/
│   ├── CategoryTree.jsx
│   ├── KeywordPills.jsx
│   └── LanguageSelector.jsx
├── content-scripts/
│   └── content.js
├── lib/
│   └── summarizer.js
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── styles/
│   └── library.css
├── .env.example
├── config.js
├── background.js
├── manifest.json
└── webpack.config.js
```

## ⚙️ Configuration

The extension can be configured through:
1. Options page (accessible via extension menu)
2. `.env` file for API configuration
3. `manifest.json` for extension settings

## 🔄 Development Workflow

1. Make changes to source files
2. Run build command:
   ```bash
   npm run build
   ```
3. Reload extension in Chrome:
   - Go to `chrome://extensions/`
   - Find your extension
   - Click the reload icon

## 🧪 Testing

1. **Different Content Types**
   - Test with various websites
   - Try different YouTube videos
   - Test with PDF documents

2. **Features Testing**
   - Try both summary modes
   - Check keyword extraction
   - Verify content categorization
   - Test save/export functionality

## ⚠️ Troubleshooting

Common issues and solutions:

1. **Extension Not Loading**
   - Check if developer mode is enabled
   - Verify build was successful
   - Check console for errors

2. **API Errors**
   - Verify API key in `.env`
   - Check API rate limits
   - Ensure correct API endpoint

3. **Content Not Summarizing**
   - Check console for errors
   - Verify content script injection
   - Check page compatibility

## 📝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for GPT API
- Chrome Extensions Documentation
- React and related libraries

