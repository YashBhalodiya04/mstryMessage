import "next-auth"

declare module "next-auth" {
    interface User{
        _id?:string;
        isVarified?:boolean;
        isAcceptingMessages?:boolean;
        username?:string;
    }

    interface Session {
        user?: User  & DefaultSession["user"];
    };
}

declare module "next-auth/jwt" {
    interface JWT {
        _id?:string;
        isVarified?:boolean;
        isAcceptingMessages?:boolean;
        username?:string;
    }
}