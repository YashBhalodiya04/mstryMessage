import { Message } from "@/model/User";
export interface ApiResponse {
  success: boolean;
  message: string;
  isAccepted?: boolean;
  messages?: Message[];
}