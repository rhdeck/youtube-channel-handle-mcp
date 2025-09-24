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
export declare class TikTokChecker {
    checkUsername(username: string): Promise<PlatformAccountInfo>;
}
export declare class ThreadsChecker {
    checkUsername(username: string): Promise<PlatformAccountInfo>;
}
export declare class XChecker {
    checkUsername(username: string): Promise<PlatformAccountInfo>;
}
export declare class InstagramChecker {
    checkUsername(username: string): Promise<PlatformAccountInfo>;
}
export declare class MultiPlatformChecker {
    private tiktokChecker;
    private threadsChecker;
    private xChecker;
    private instagramChecker;
    constructor();
    checkAllPlatforms(username: string): Promise<PlatformAccountInfo[]>;
}
//# sourceMappingURL=platform-checkers.d.ts.map