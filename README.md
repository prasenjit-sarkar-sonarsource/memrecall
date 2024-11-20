# <div align="left">Content Summarizer & Translater Chrome Extension <div>

<div align="left">
<p><strong>Stop drowning in endless content. Get instant, intelligent summaries of any web content - articles, videos, PDFs, podcasts - in your preferred language. Built with GPT for professionals who value their time.</strong></p>
<a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License"></a>
<a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome"></a>
<a href="https://linkedin.com/in/jit2600"><img src="https://img.shields.io/badge/LinkedIn-Connect-blue" alt="LinkedIn"></a>
<a href="https://twitter.com/stretchcloud"><img src="https://img.shields.io/twitter/follow/stretchcloud?label=Follow%20@stretchcloud&style=social" alt="Twitter"></a>
<a href="https://github.com/stretchcloud/memrecall/stargazers"><img src="https://img.shields.io/github/stars/stretchcloud/memrecall?style=social" alt="GitHub Stars"></a>
<a href="https://github.com/stretchcloud/memrecall/network/members"><img src="https://img.shields.io/github/forks/stretchcloud/memrecall?style=social" alt="GitHub Forks"></a>
<a href="https://github.com/stretchcloud/memrecall/issues"><img src="https://img.shields.io/github/issues/stretchcloud/memrecall" alt="GitHub Issues"></a>
<a href="https://github.com/stretchcloud/memrecall/pulls"><img src="https://img.shields.io/github/issues-pr/stretchcloud/memrecall" alt="GitHub Pull Requests"></a>
</div>

# 🌟 MemRecall: Time is Knowledge
Never miss the essence of content again. Transform lengthy web content into crystal-clear summaries with AI precision. Whether it's a YouTube deep-dive, a technical PDF, or a Wikipedia rabbit hole - get the insights you need, in the language you prefer.


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

## ✨ Features

- **Universal Content Support**: Automatically detects and processes different types of content:
  - Web Articles
  - YouTube Videos
  - PDF Documents
  - Podcast
  - Blogs
  - Wikipedia

- Smart Categorization & Keyword Extraction
- 10 Language Translations
- One-Click Summaries
- Offline Access

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


### ⏳ Sequence Diagram


```mermaid
sequenceDiagram
    participant U as User
    participant P as Popup UI
    participant BG as Background Script
    participant CS as Content Script
    participant H as Content Handlers
    participant API as OpenAI API
    participant ST as Chrome Storage

    U->>P: Clicks Extension Icon
    P->>BG: Request Summary
    BG->>CS: Detect Content Type
    CS->>H: Route to Appropriate Handler
    
    alt Web Article
        H->>CS: Extract Article Content
    else YouTube Video
        H->>CS: Extract Video Info & Transcript
    else PDF Document
        H->>CS: Parse PDF Content
    else Podcast
        H->>CS: Get Audio Transcript
    else Blog Post
        H->>CS: Parse Blog Content
    else Wikipedia
        H->>CS: Extract Wiki Content
    end
    
    CS-->>BG: Return Processed Content
    
    BG->>ST: Check Settings
    ST-->>BG: Return Language Preference
    
    BG->>API: Request Summary
    API-->>BG: Return Summary
    
    BG->>API: Extract Keywords
    API-->>BG: Return Keywords
    
    alt Translation Enabled
        BG->>API: Request Translation
        API-->>BG: Return Translated Text
    end
    
    BG->>API: Categorize Content
    API-->>BG: Return Categories
    
    BG->>ST: Store Results
    
    BG-->>P: Return Complete Result
    P-->>U: Display Summary & Options
    
    Note over U,P: User can toggle between original and translated content
```

### 🧩 Component Structure

```mermaid
graph TD
    subgraph "Extension Structure"
        Root[Chrome Extension]
        Root --> Popup[Popup Interface]
        Root --> Background[Background Service]
        Root --> Content[Content Scripts]
        Root --> Settings[Settings Page]
        
        subgraph "Popup Components"
            Popup --> Sum[Summary Display]
            Popup --> KW[Keyword Pills]
            Popup --> Cat[Category Tags]
            Sum --> Trans[Translation Toggle]
            Sum --> Export[Export Options]
            Sum --> Media[Media Preview]
        end
        
        subgraph "Background Services"
            Background --> API[API Service]
            Background --> Store[Storage Service]
            Background --> Trans2[Translation Service]
        end
        
        subgraph "Content Handlers"
            Content --> Web[Article Extractor]
            Content --> YT[YouTube Handler]
            Content --> PDF[PDF Processor]
            Content --> Pod[Podcast Handler]
            Content --> Blog[Blog Parser]
            Content --> Wiki[Wikipedia Parser]
            
            subgraph "Content Processing"
                Web & YT & PDF & Pod & Blog & Wiki --> Text[Text Processing]
                Web & YT & PDF & Pod & Blog & Wiki --> Meta[Metadata Extraction]
                YT & Pod --> Media2[Media Processing]
            end
        end
        
        subgraph "Settings Components"
            Settings --> Lang[Language Selector]
            Settings --> Auto[Autosave Toggle]
            Settings --> Theme[Theme Switch]
            Settings --> Prefs[Content Preferences]
        end
    end
    
    classDef component fill:#6750a4,stroke:#333,stroke-width:2px,color:white;
    classDef service fill:#2c2d31,stroke:#333,stroke-width:2px,color:white;
    classDef handler fill:#4a90e2,stroke:#333,stroke-width:2px,color:white;
    classDef ui fill:#87CEEB,stroke:#333,stroke-width:2px;
    
    class Root,Popup,Background,Content,Settings component;
    class API,Store,Trans2 service;
    class Web,YT,PDF,Pod,Blog,Wiki handler;
    class Sum,KW,Cat,Trans,Export,Lang,Auto,Theme ui;
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

This project is licensed under the Apache 2.0 - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for GPT API
- Chrome Extensions Documentation
- React and related libraries

