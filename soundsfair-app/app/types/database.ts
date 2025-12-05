/**
 * Supabase Database Types
 *
 * These types are manually defined based on the database schema.
 * In production, you can generate these using:
 * npx supabase gen types typescript --project-id <project-id> > app/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      questions: {
        Row: {
          id: string;
          user_email: string;
          user_name: string | null;
          category: string;
          question_text: string;
          pricing_tier: string;
          payment_id: string | null;
          payment_status: string;
          amount_sats: number;
          status: string;
          priority: number;
          response_text: string | null;
          response_video_url: string | null;
          responded_at: string | null;
          responded_by: string | null;
          publish_to_archive: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
          attachment_urls: string[] | null;
        };
        Insert: {
          id?: string;
          user_email: string;
          user_name?: string | null;
          category: string;
          question_text: string;
          pricing_tier: string;
          payment_id?: string | null;
          payment_status?: string;
          amount_sats: number;
          status?: string;
          priority?: number;
          response_text?: string | null;
          response_video_url?: string | null;
          responded_at?: string | null;
          responded_by?: string | null;
          publish_to_archive?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          attachment_urls?: string[] | null;
        };
        Update: {
          id?: string;
          user_email?: string;
          user_name?: string | null;
          category?: string;
          question_text?: string;
          pricing_tier?: string;
          payment_id?: string | null;
          payment_status?: string;
          amount_sats?: number;
          status?: string;
          priority?: number;
          response_text?: string | null;
          response_video_url?: string | null;
          responded_at?: string | null;
          responded_by?: string | null;
          publish_to_archive?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          attachment_urls?: string[] | null;
        };
      };
      payments: {
        Row: {
          id: string;
          invoice_id: string;
          invoice_url: string;
          lightning_invoice: string;
          amount_sats: number;
          amount_btc: number;
          amount_usd: number | null;
          status: string;
          paid_at: string | null;
          expires_at: string;
          webhook_received: boolean;
          webhook_signature: string | null;
          webhook_payload: Json | null;
          created_at: string;
          updated_at: string;
          refunded: boolean;
          refund_reason: string | null;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          invoice_url: string;
          lightning_invoice: string;
          amount_sats: number;
          amount_btc: number;
          amount_usd?: number | null;
          status?: string;
          paid_at?: string | null;
          expires_at: string;
          webhook_received?: boolean;
          webhook_signature?: string | null;
          webhook_payload?: Json | null;
          created_at?: string;
          updated_at?: string;
          refunded?: boolean;
          refund_reason?: string | null;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          invoice_url?: string;
          lightning_invoice?: string;
          amount_sats?: number;
          amount_btc?: number;
          amount_usd?: number | null;
          status?: string;
          paid_at?: string | null;
          expires_at?: string;
          webhook_received?: boolean;
          webhook_signature?: string | null;
          webhook_payload?: Json | null;
          created_at?: string;
          updated_at?: string;
          refunded?: boolean;
          refund_reason?: string | null;
        };
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          role: string;
          created_at: string;
          last_login: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          role?: string;
          created_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          role?: string;
          created_at?: string;
          last_login?: string | null;
        };
      };
      question_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          display_order: number;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          display_order?: number;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          display_order?: number;
        };
      };
      pricing_tiers: {
        Row: {
          id: string;
          name: string;
          description: string;
          amount_sats: number;
          response_time_hours: number | null;
          response_format: string | null;
          display_order: number;
          active: boolean;
        };
        Insert: {
          id: string;
          name: string;
          description: string;
          amount_sats: number;
          response_time_hours?: number | null;
          response_format?: string | null;
          display_order?: number;
          active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          amount_sats?: number;
          response_time_hours?: number | null;
          response_format?: string | null;
          display_order?: number;
          active?: boolean;
        };
      };
    };
    Views: {
      public_qa_archive: {
        Row: {
          id: string | null;
          category: string | null;
          question_text: string | null;
          response_text: string | null;
          response_video_url: string | null;
          pricing_tier: string | null;
          amount_sats: number | null;
          published_at: string | null;
          created_at: string | null;
          category_name: string | null;
          category_icon: string | null;
          tier_name: string | null;
        };
      };
      admin_queue_view: {
        Row: {
          id: string | null;
          user_email: string | null;
          user_name: string | null;
          category: string | null;
          question_text: string | null;
          pricing_tier: string | null;
          amount_sats: number | null;
          status: string | null;
          priority: number | null;
          created_at: string | null;
          attachment_urls: string[] | null;
          category_name: string | null;
          tier_name: string | null;
          response_time_hours: number | null;
          paid_at: string | null;
        };
      };
    };
    Functions: {
      expire_old_payments: {
        Args: Record<PropertyKey, never>;
        Returns: void;
      };
      get_question_stats: {
        Args: Record<PropertyKey, never>;
        Returns: {
          total_questions: number;
          paid_questions: number;
          answered_questions: number;
          in_queue: number;
          total_revenue_sats: number;
          avg_response_time_hours: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
