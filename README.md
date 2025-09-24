# Social Media Handle Checker MCP Server

A comprehensive Model Context Protocol (MCP) server that checks username availability across all major social media platforms. Perfect for qualifying brand names for your media business.

## Features

- 🎯 **Multi-Platform Support**: Check usernames across YouTube, TikTok, Threads, X (Twitter), and Instagram
- 📊 **Detailed Account Information**: Get follower counts, verification status, descriptions, and more
- 🚀 **Batch Checking**: Check availability across ALL platforms with a single command
- ⚡ **Individual Platform Tools**: Target specific platforms when needed
- 🔍 **Comprehensive Data**: Extract profile names, IDs, descriptions, and engagement metrics
- 💼 **Brand Research**: Perfect for media business name qualification and competitive analysis

## Installation

```bash
npm install
npm run build
```

## Usage

This is an MCP server that runs over STDIO. You can use it with any MCP-compatible client.

### Manual Testing

You can test the server manually by running:

```bash
npm start
```

Or, without cloning/building, run directly with npx (recommended for a quick try):

```bash
npx -y @raydeck/social-media-handle-checker-mcp
```

### Available Tools

#### 1. `check_all_platforms` - 🎯 **RECOMMENDED**

Check username availability across **all supported platforms** at once. This is the most powerful tool for comprehensive brand research.

**Parameters:**
- `username` (string): The username to check across all platforms (with or without @ prefix)

**Platforms checked:**
- YouTube
- TikTok
- Threads
- X (Twitter)
- Instagram

**Example Response:**
```
Multi-Platform Check Results for "@statechange"

✅ AVAILABLE ON (2/5 platforms):
• Threads
• TikTok

❌ TAKEN ON (3/5 platforms):
• YouTube - State Change (8.09K subscribers)
• X (Twitter) - State Change ✓ Verified
• Instagram - statechange (1.2M followers)

⚠️ Limited availability - this username is taken on most platforms.
```

#### 2. Individual Platform Tools

- `check_youtube_handle`: Check YouTube channel availability
- `check_tiktok_handle`: Check TikTok username availability  
- `check_threads_handle`: Check Threads username availability
- `check_x_handle`: Check X (Twitter) username availability
- `check_instagram_handle`: Check Instagram username availability

**Parameters for all individual tools:**
- `username` (string): The username to check (with or without @ prefix)

**Individual Tool Examples:**
- `statechange` - Check if @statechange is available
- `@statechange1` - Check if @statechange1 is available  
- `pewdiepie` - Check if @pewdiepie is available (spoiler: it's taken!)

**Response Format:**
- If taken: Returns detailed account information (name, followers, verification, description)
- If available: Confirms the username is available for registration

## How It Works

The server makes HTTP requests to social media platform profile pages to determine username availability:

**Platform URLs:**
- YouTube: `https://www.youtube.com/@{username}`
- TikTok: `https://www.tiktok.com/@{username}`
- Threads: `https://www.threads.net/@{username}`
- X (Twitter): `https://x.com/{username}`
- Instagram: `https://www.instagram.com/{username}/`

**Detection Logic:**
- If the page returns 404 or shows "not found" messages, the username is available
- If the page returns 200 with valid profile data, the username is taken
- When taken, we extract profile information like display names, follower counts, verification status, and descriptions

**Multi-Platform Checking:**
- Runs checks in parallel for maximum speed
- Handles errors gracefully (if one platform fails, others continue)
- Provides comprehensive availability summary with visual indicators

## Configuration for MCP Clients

Add this server to your MCP client configuration.

Option A — npx (recommended, zero install):

```json
{
  "mcpServers": {
    "social-media-handle-checker": {
      "command": "npx",
      "args": ["-y", "@raydeck/social-media-handle-checker-mcp"],
      "env": {}
    }
  }
}
```

## Windsurf Assistant UI

Add this MCP server to Windsurf Assistant UI using STDIO:

- Open Settings → MCP Servers → Add Server
- Name: `social-media-handle-checker`
- Command: `npx`
- Args: `-y @raydeck/social-media-handle-checker-mcp`
- Env: leave empty (not required)

Equivalent JSON (for builds that support JSON import):

```json
{
  "mcpServers": {
    "social-media-handle-checker": {
      "command": "npx",
      "args": ["-y", "@raydeck/social-media-handle-checker-mcp"],
      "env": {}
    }
  }
}
```

## Install in Cursor

Click to add this MCP server to Cursor.

Text link:
[cursor://anysphere.cursor-deeplink/mcp/install?name=social-media-handle-checker&config=eyJzb2NpYWwtbWVkaWEtaGFuZGxlLWNoZWNrZXIiOnsiY29tbWFuZCI6Im5weCIsImFyZ3MiOlsiLXkiLCJAcmF5ZGVjay9zb2NpYWwtbWVkaWEtaGFuZGxlLWNoZWNrZXItbWNwIl19fQ==](cursor://anysphere.cursor-deeplink/mcp/install?name=social-media-handle-checker&config=eyJzb2NpYWwtbWVkaWEtaGFuZGxlLWNoZWNrZXIiOnsiY29tbWFuZCI6Im5weCIsImFyZ3MiOlsiLXkiLCJAcmF5ZGVjay9zb2NpYWwtbWVkaWEtaGFuZGxlLWNoZWNrZXItbWNwIl19fQ==)
Buttons:

[![Add to Cursor (dark)](https://cursor.com/deeplink/mcp-install-dark.png)](cursor://anysphere.cursor-deeplink/mcp/install?name=social-media-handle-checker&config=eyJzb2NpYWwtbWVkaWEtaGFuZGxlLWNoZWNrZXIiOnsiY29tbWFuZCI6Im5weCIsImFyZ3MiOlsiLXkiLCJAcmF5ZGVjay9zb2NpYWwtbWVkaWEtaGFuZGxlLWNoZWNrZXItbWNwIl19fQ==)
[![Add to Cursor (light)](https://cursor.com/deeplink/mcp-install-light.png)](cursor://anysphere.cursor-deeplink/mcp/install?name=social-media-handle-checker&config=eyJzb2NpYWwtbWVkaWEtaGFuZGxlLWNoZWNrZXIiOnsiY29tbWFuZCI6Im5weCIsImFyZ3MiOlsiLXkiLCJAcmF5ZGVjay9zb2NpYWwtbWVkaWEtaGFuZGxlLWNoZWNrZXItbWNwIl19fQ==)

### Quick Start Usage

```bash
# Check all platforms at once (recommended)
check_all_platforms("mybrandname")
check_youtube_handle("mybrandname")
check_tiktok_handle("mybrandname")
check_instagram_handle("mybrandname")
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch mode for development
npm run dev

# Run the server
npm start
```

## Use Cases

Perfect for:
- 🎬 **Media Businesses**: Check brand name availability across all major platforms
- 📺 **Content Creators**: Explore username options and find consistent handles
- 🚀 **Startups**: Validate social media presence before launching
- 🔍 **Brand Consultants**: Conduct comprehensive competitive research
- 💼 **Marketing Agencies**: Qualify client brand names across platforms
- 🎨 **Influencers**: Find available usernames for brand expansion
- 🕰️ **Domain Hunters**: Check social media availability alongside domain research

## Real-World Examples

```bash
# Startup looking for consistent branding
check_all_platforms("techstartup2024")
# Result: Available on 4/5 platforms - perfect for consistent branding!

# Content creator checking variations
check_all_platforms("creativestudio")
check_all_platforms("creativestudio1")
check_all_platforms("creativestudiohq")
# Find the best available option across platforms

# Brand consultant competitive research
check_all_platforms("competitor1")
check_all_platforms("competitor2")
# Analyze competitor presence and find opportunities
```

## Limitations

- **Web Scraping Dependency**: Relies on web scraping, so platform changes could affect functionality
- **Rate Limiting**: May apply for excessive requests (recommended: max 1 request per second)
- **Privacy Settings**: Some account information might not be available due to privacy settings
- **Platform Updates**: Major platform redesigns may require updates to extraction logic
- **Temporary Failures**: Individual platform checks may fail due to network issues (other platforms continue working)

## License

MIT