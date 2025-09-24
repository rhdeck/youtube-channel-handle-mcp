#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import {
  TikTokChecker,
  ThreadsChecker,
  XChecker,
  InstagramChecker,
  MultiPlatformChecker,
  PlatformAccountInfo,
} from "./platform-checkers.js";

interface YoutubeChannelInfo {
  exists: boolean;
  handle?: string;
  channelName?: string;
  channelId?: string;
  subscriberCount?: string;
  verified?: boolean;
  description?: string;
}

class YouTubeHandleChecker {
  private async checkHandleAvailability(handle: string): Promise<YoutubeChannelInfo> {
    try {
      // Normalize the handle (remove @ if present, convert to lowercase)
      const normalizedHandle = handle.replace(/^@/, '').toLowerCase();
      
      // Try to access the YouTube channel page
      const url = `https://www.youtube.com/@${normalizedHandle}`;
      
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
          timeout: 10000,
          validateStatus: (status) => status < 500, // Don't throw on 404, but throw on server errors
        });

        if (response.status === 404) {
          return {
            exists: false,
          };
        }

        if (response.status === 200) {
          // Parse the HTML to extract channel information
          const html = response.data;
          
          // Extract channel name
          const channelNameMatch = html.match(/<title>([^<]*)<\/title>/);
          const channelName = channelNameMatch ? channelNameMatch[1].replace(' - YouTube', '').trim() : undefined;
          
          // Extract channel ID from canonical URL
          const canonicalMatch = html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/([^"]*)">/);
          const channelId = canonicalMatch ? canonicalMatch[1] : undefined;
          
          // Extract subscriber count (this is tricky as YouTube often hides exact counts)
          const subscriberMatch = html.match(/(\d+(?:\.\d+)?[KMB]?) subscriber/i) || html.match(/(\d+(?:,\d+)*) subscriber/i);
          const subscriberCount = subscriberMatch ? subscriberMatch[1] : undefined;
          
          // Check if verified (look for verification badge indicators)
          const verified = html.includes('verified') || html.includes('check_circle');
          
          // Extract description
          const descriptionMatch = html.match(/<meta name="description" content="([^"]*)">/);
          const description = descriptionMatch ? descriptionMatch[1] : undefined;

          return {
            exists: true,
            handle: `@${normalizedHandle}`,
            channelName,
            channelId,
            subscriberCount,
            verified,
            description,
          };
        }

        return {
          exists: false,
        };
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return {
            exists: false,
          };
        }
        throw error;
      }
    } catch (error) {
      throw new Error(`Failed to check handle availability: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async checkHandle(handle: string): Promise<YoutubeChannelInfo> {
    return await this.checkHandleAvailability(handle);
  }
}

class YouTubeHandleMCPServer {
  private server: Server;
  private youtubeChecker: YouTubeHandleChecker;
  private tiktokChecker: TikTokChecker;
  private threadsChecker: ThreadsChecker;
  private xChecker: XChecker;
  private instagramChecker: InstagramChecker;
  private multiPlatformChecker: MultiPlatformChecker;

  constructor() {
    this.youtubeChecker = new YouTubeHandleChecker();
    this.tiktokChecker = new TikTokChecker();
    this.threadsChecker = new ThreadsChecker();
    this.xChecker = new XChecker();
    this.instagramChecker = new InstagramChecker();
    this.multiPlatformChecker = new MultiPlatformChecker();
    
    this.server = new Server(
      {
        name: "social-media-handle-checker",
        version: "2.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "check_youtube_handle",
            description: "Check if a YouTube channel handle is available or already taken. Returns information about the channel if it exists, or confirms availability if it doesn't.",
            inputSchema: {
              type: "object",
              properties: {
                handle: {
                  type: "string",
                  description: "The YouTube handle to check (with or without @ prefix)",
                },
              },
              required: ["handle"],
            },
          },
          {
            name: "check_tiktok_handle",
            description: "Check if a TikTok username is available or already taken. Returns information about the account if it exists, or confirms availability if it doesn't.",
            inputSchema: {
              type: "object",
              properties: {
                username: {
                  type: "string",
                  description: "The TikTok username to check (with or without @ prefix)",
                },
              },
              required: ["username"],
            },
          },
          {
            name: "check_threads_handle",
            description: "Check if a Threads username is available or already taken. Returns information about the account if it exists, or confirms availability if it doesn't.",
            inputSchema: {
              type: "object",
              properties: {
                username: {
                  type: "string",
                  description: "The Threads username to check (with or without @ prefix)",
                },
              },
              required: ["username"],
            },
          },
          {
            name: "check_x_handle",
            description: "Check if an X (Twitter) username is available or already taken. Returns information about the account if it exists, or confirms availability if it doesn't.",
            inputSchema: {
              type: "object",
              properties: {
                username: {
                  type: "string",
                  description: "The X (Twitter) username to check (with or without @ prefix)",
                },
              },
              required: ["username"],
            },
          },
          {
            name: "check_instagram_handle",
            description: "Check if an Instagram username is available or already taken. Returns information about the account if it exists, or confirms availability if it doesn't.",
            inputSchema: {
              type: "object",
              properties: {
                username: {
                  type: "string",
                  description: "The Instagram username to check (with or without @ prefix)",
                },
              },
              required: ["username"],
            },
          },
          {
            name: "check_all_platforms",
            description: "Check username availability across all supported platforms (YouTube, TikTok, Threads, X, Instagram) at once. Perfect for comprehensive brand name research.",
            inputSchema: {
              type: "object",
              properties: {
                username: {
                  type: "string",
                  description: "The username to check across all platforms (with or without @ prefix)",
                },
              },
              required: ["username"],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      switch (name) {
        case "check_youtube_handle": {
          const { handle } = args as { handle: string };
          
          if (!handle || typeof handle !== "string") {
            throw new Error("Handle parameter is required and must be a string");
          }

          try {
            const result = await this.youtubeChecker.checkHandle(handle);
            
            if (result.exists) {
              return {
                content: [
                  {
                    type: "text",
                    text: `YouTube handle "@${handle.replace(/^@/, '')}" is TAKEN.\n\nChannel Information:\n- Handle: ${result.handle}\n- Channel Name: ${result.channelName || 'N/A'}\n- Channel ID: ${result.channelId || 'N/A'}\n- Subscriber Count: ${result.subscriberCount || 'N/A'}\n- Verified: ${result.verified ? 'Yes' : 'No'}\n- Description: ${result.description || 'N/A'}`,
                  },
                ],
              };
            } else {
              return {
                content: [
                  {
                    type: "text",
                    text: `YouTube handle "@${handle.replace(/^@/, '')}" appears to be AVAILABLE! 🎉\n\nThis handle is not currently in use and could potentially be claimed for your media business.`,
                  },
                ],
              };
            }
          } catch (error) {
            throw new Error(`Failed to check YouTube handle: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
        
        case "check_tiktok_handle": {
          const { username } = args as { username: string };
          
          if (!username || typeof username !== "string") {
            throw new Error("Username parameter is required and must be a string");
          }

          try {
            const result = await this.tiktokChecker.checkUsername(username);
            return this.formatPlatformResponse(result, username);
          } catch (error) {
            throw new Error(`Failed to check TikTok username: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
        
        case "check_threads_handle": {
          const { username } = args as { username: string };
          
          if (!username || typeof username !== "string") {
            throw new Error("Username parameter is required and must be a string");
          }

          try {
            const result = await this.threadsChecker.checkUsername(username);
            return this.formatPlatformResponse(result, username);
          } catch (error) {
            throw new Error(`Failed to check Threads username: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
        
        case "check_x_handle": {
          const { username } = args as { username: string };
          
          if (!username || typeof username !== "string") {
            throw new Error("Username parameter is required and must be a string");
          }

          try {
            const result = await this.xChecker.checkUsername(username);
            return this.formatPlatformResponse(result, username);
          } catch (error) {
            throw new Error(`Failed to check X username: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
        
        case "check_instagram_handle": {
          const { username } = args as { username: string };
          
          if (!username || typeof username !== "string") {
            throw new Error("Username parameter is required and must be a string");
          }

          try {
            const result = await this.instagramChecker.checkUsername(username);
            return this.formatPlatformResponse(result, username);
          } catch (error) {
            throw new Error(`Failed to check Instagram username: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
        
        case "check_all_platforms": {
          const { username } = args as { username: string };
          
          if (!username || typeof username !== "string") {
            throw new Error("Username parameter is required and must be a string");
          }

          try {
            // Check YouTube separately since it uses a different interface
            const youtubeResult = await this.youtubeChecker.checkHandle(username);
            const otherPlatformResults = await this.multiPlatformChecker.checkAllPlatforms(username);
            
            // Format YouTube result to match PlatformAccountInfo interface
            const youtubeFormatted: PlatformAccountInfo = {
              platform: 'YouTube',
              exists: youtubeResult.exists,
              username: youtubeResult.handle,
              displayName: youtubeResult.channelName,
              profileId: youtubeResult.channelId,
              followerCount: youtubeResult.subscriberCount,
              verified: youtubeResult.verified,
              description: youtubeResult.description,
            };
            
            const allResults = [youtubeFormatted, ...otherPlatformResults];
            return this.formatMultiPlatformResponse(allResults, username);
          } catch (error) {
            throw new Error(`Failed to check username across platforms: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  private formatPlatformResponse(result: PlatformAccountInfo, username: string) {
    if (result.exists) {
      return {
        content: [
          {
            type: "text",
            text: `${result.platform} username "@${username.replace(/^@/, '')}" is TAKEN.\n\nAccount Information:\n- Username: ${result.username || 'N/A'}\n- Display Name: ${result.displayName || 'N/A'}\n- Profile ID: ${result.profileId || 'N/A'}\n- Follower Count: ${result.followerCount || 'N/A'}\n- Verified: ${result.verified ? 'Yes' : 'No'}\n- Description: ${result.description || 'N/A'}`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `${result.platform} username "@${username.replace(/^@/, '')}" appears to be AVAILABLE! 🎉\n\nThis username is not currently in use and could potentially be claimed for your media business.`,
          },
        ],
      };
    }
  }

  private formatMultiPlatformResponse(results: PlatformAccountInfo[], username: string) {
    const available = results.filter(r => !r.exists);
    const taken = results.filter(r => r.exists);
    
    let responseText = `Multi-Platform Check Results for "@${username.replace(/^@/, '')}"\n\n`;
    
    if (available.length > 0) {
      responseText += `✅ AVAILABLE ON (${available.length}/${results.length} platforms):\n`;
      available.forEach(platform => {
        responseText += `• ${platform.platform}\n`;
      });
      responseText += '\n';
    }
    
    if (taken.length > 0) {
      responseText += `❌ TAKEN ON (${taken.length}/${results.length} platforms):\n`;
      taken.forEach(platform => {
        responseText += `• ${platform.platform}`;
        if (platform.displayName) {
          responseText += ` - ${platform.displayName}`;
        }
        if (platform.followerCount) {
          responseText += ` (${platform.followerCount} followers)`;
        }
        if (platform.verified) {
          responseText += ` ✓ Verified`;
        }
        responseText += '\n';
      });
      responseText += '\n';
    }
    
    // Summary
    if (available.length === results.length) {
      responseText += '🎉 GREAT NEWS! This username is available on ALL platforms!';
    } else if (available.length > taken.length) {
      responseText += '👍 Good availability - more platforms have this username available than taken.';
    } else if (taken.length > available.length) {
      responseText += '⚠️ Limited availability - this username is taken on most platforms.';
    } else {
      responseText += '⚖️ Mixed availability - equally available and taken across platforms.';
    }
    
    return {
      content: [
        {
          type: "text",
          text: responseText,
        },
      ],
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Social Media Handle Checker MCP server running on stdio");
  }
}

const server = new YouTubeHandleMCPServer();
server.run().catch(console.error);