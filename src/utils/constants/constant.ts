export class Constants {
    public static JWT_TOKEN_EXPIRE_IN = 7 * 24 * 60 * 60; // 7 days

    public static USER_SESSION_EXPIRE_IN = 1 * 60 * 60; // 1 hour
 
    public static OTHER_TOKEN_EXPIRE_IN = 5 * 60; // 5 minute
 
    public static INVITE_EXPIRE_IN = 24 * 60 * 60; // 24 hour

    public static TOKEN_SECRET = {
        KEY: 'jwt_secret'
    };

    public static PASSWORD = {
        SALT_ROUND: 10
    };
}