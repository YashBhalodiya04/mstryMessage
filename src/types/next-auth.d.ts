import "next-auth"

declare module "next-auth" {
    interface User{
        _id?:string;
        isVarified?:boolean;
        isAcceptingMessages?:boolean;
        userName?:string;
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
        userName?:string;
    }
}