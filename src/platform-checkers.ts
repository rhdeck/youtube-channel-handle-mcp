import axios from "axios";

export interface PlatformAccountInfo {
  platform: string;
  exists: boolean;
  username?: string;
  displayName?: string;
  profileId?: string;
  followerCount?: string;
  verified?: boolean;
  description?: string;
  profilePicture?: string;
}

export class TikTokChecker {
  async checkUsername(username: string): Promise<PlatformAccountInfo> {
    try {
      const normalizedUsername = username.replace(/^@/, '').toLowerCase();
      const url = `https://www.tiktok.com/@${normalizedUsername}`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 10000,
        validateStatus: (status) => status < 500,
      });

      if (response.status === 404 || response.data.includes('Couldn\'t find this account')) {
        return {
          platform: 'TikTok',
          exists: false,
        };
      }

      if (response.status === 200) {
        const html = response.data;
        
        // Extract display name
        const displayNameMatch = html.match(/<title>([^<]*)<\/title>/);
        const displayName = displayNameMatch ? displayNameMatch[1].replace(' | TikTok', '').trim() : undefined;
        
        // Extract follower count
        const followerMatch = html.match(/(\d+(?:\.\d+)?[KMB]?) Followers/i) || html.match(/(\d+(?:,\d+)*) Followers/i);
        const followerCount = followerMatch ? followerMatch[1] : undefined;
        
        // Check if verified
        const verified = html.includes('verified') || html.includes('Official account');
        
        // Extract description
        const descriptionMatch = html.match(/<meta name="description" content="([^"]*)">/);
        const description = descriptionMatch ? descriptionMatch[1] : undefined;

        return {
          platform: 'TikTok',
          exists: true,
          username: `@${normalizedUsername}`,
          displayName,
          followerCount,
          verified,
          description,
        };
      }

      return {
        platform: 'TikTok',
        exists: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          platform: 'TikTok',
          exists: false,
        };
      }
      throw new Error(`Failed to check TikTok username: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export class ThreadsChecker {
  async checkUsername(username: string): Promise<PlatformAccountInfo> {
    try {
      const normalizedUsername = username.replace(/^@/, '').toLowerCase();
      const url = `https://www.threads.net/@${normalizedUsername}`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 10000,
        validateStatus: (status) => status < 500,
      });

      if (response.status === 404) {
        return {
          platform: 'Threads',
          exists: false,
        };
      }

      if (response.status === 200) {
        const html = response.data;
        
        // Extract display name
        const displayNameMatch = html.match(/<title>([^<]*)<\/title>/);
        const displayName = displayNameMatch ? displayNameMatch[1].replace(' (@' + normalizedUsername + ') • Threads', '').trim() : undefined;
        
        // Extract follower count
        const followerMatch = html.match(/(\d+(?:\.\d+)?[KMB]?) followers/i) || html.match(/(\d+(?:,\d+)*) followers/i);
        const followerCount = followerMatch ? followerMatch[1] : undefined;
        
        // Check if verified
        const verified = html.includes('verified') || html.includes('check_circle');
        
        // Extract description
        const descriptionMatch = html.match(/<meta name="description" content="([^"]*)">/);
        const description = descriptionMatch ? descriptionMatch[1] : undefined;

        return {
          platform: 'Threads',
          exists: true,
          username: `@${normalizedUsername}`,
          displayName,
          followerCount,
          verified,
          description,
        };
      }

      return {
        platform: 'Threads',
        exists: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          platform: 'Threads',
          exists: false,
        };
      }
      throw new Error(`Failed to check Threads username: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export class XChecker {
  async checkUsername(username: string): Promise<PlatformAccountInfo> {
    try {
      const normalizedUsername = username.replace(/^@/, '').toLowerCase();
      const url = `https://x.com/${normalizedUsername}`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 10000,
        validateStatus: (status) => status < 500,
      });

      if (response.status === 404 || response.data.includes('This account doesn\'t exist')) {
        return {
          platform: 'X (Twitter)',
          exists: false,
        };
      }

      if (response.status === 200) {
        const html = response.data;
        
        // Extract display name
        const displayNameMatch = html.match(/<title>([^<]*)<\/title>/);
        const displayName = displayNameMatch ? displayNameMatch[1].replace(' (@' + normalizedUsername + ') / X', '').trim() : undefined;
        
        // Extract follower count
        const followerMatch = html.match(/(\d+(?:\.\d+)?[KMB]?) Followers/i) || html.match(/(\d+(?:,\d+)*) Followers/i);
        const followerCount = followerMatch ? followerMatch[1] : undefined;
        
        // Check if verified
        const verified = html.includes('verified') || html.includes('Verified account');
        
        // Extract description
        const descriptionMatch = html.match(/<meta name="description" content="([^"]*)">/);
        const description = descriptionMatch ? descriptionMatch[1] : undefined;

        return {
          platform: 'X (Twitter)',
          exists: true,
          username: `@${normalizedUsername}`,
          displayName,
          followerCount,
          verified,
          description,
        };
      }

      return {
        platform: 'X (Twitter)',
        exists: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          platform: 'X (Twitter)',
          exists: false,
        };
      }
      throw new Error(`Failed to check X username: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export class InstagramChecker {
  async checkUsername(username: string): Promise<PlatformAccountInfo> {
    try {
      const normalizedUsername = username.replace(/^@/, '').toLowerCase();
      const url = `https://www.instagram.com/${normalizedUsername}/`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 10000,
        validateStatus: (status) => status < 500,
      });

      if (response.status === 404 || response.data.includes('Page Not Found')) {
        return {
          platform: 'Instagram',
          exists: false,
        };
      }

      if (response.status === 200) {
        const html = response.data;
        
        // Extract display name
        const displayNameMatch = html.match(/<title>([^<]*)<\/title>/);
        const displayName = displayNameMatch ? displayNameMatch[1].replace(' (@' + normalizedUsername + ') • Instagram photos and videos', '').trim() : undefined;
        
        // Extract follower count
        const followerMatch = html.match(/(\d+(?:\.\d+)?[KMB]?) Followers/i) || html.match(/(\d+(?:,\d+)*) Followers/i);
        const followerCount = followerMatch ? followerMatch[1] : undefined;
        
        // Check if verified
        const verified = html.includes('verified') || html.includes('Verified');
        
        // Extract description
        const descriptionMatch = html.match(/<meta name="description" content="([^"]*)">/);
        const description = descriptionMatch ? descriptionMatch[1] : undefined;

        return {
          platform: 'Instagram',
          exists: true,
          username: `@${normalizedUsername}`,
          displayName,
          followerCount,
          verified,
          description,
        };
      }

      return {
        platform: 'Instagram',
        exists: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          platform: 'Instagram',
          exists: false,
        };
      }
      throw new Error(`Failed to check Instagram username: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export class MultiPlatformChecker {
  private tiktokChecker: TikTokChecker;
  private threadsChecker: ThreadsChecker;
  private xChecker: XChecker;
  private instagramChecker: InstagramChecker;

  constructor() {
    this.tiktokChecker = new TikTokChecker();
    this.threadsChecker = new ThreadsChecker();
    this.xChecker = new XChecker();
    this.instagramChecker = new InstagramChecker();
  }

  async checkAllPlatforms(username: string): Promise<PlatformAccountInfo[]> {
    const results = await Promise.allSettled([
      this.tiktokChecker.checkUsername(username),
      this.threadsChecker.checkUsername(username),
      this.xChecker.checkUsername(username),
      this.instagramChecker.checkUsername(username),
    ]);

    return results.map((result, index) => {
      const platforms = ['TikTok', 'Threads', 'X (Twitter)', 'Instagram'];
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          platform: platforms[index],
          exists: false,
          error: result.reason?.message || 'Unknown error',
        } as PlatformAccountInfo;
      }
    });
  }
}