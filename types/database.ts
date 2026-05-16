export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "user" | "admin";
export type QuestionType = "multiple_choice" | "fill_blank" | "true_false" | "sentence_correction";
export type CurriculumDifficulty = "easy" | "medium" | "hard" | "review";
export type QuestionScope =
  | "practice"
  | "lesson_test"
  | "mistake_focus"
  | "topic_test"
  | "level_test"
  | "mixed_test"
  | "final_exam";
export type LessonProgressStatus = "not_started" | "in_progress" | "completed";
type EmptyObject = { [_ in never]: never };

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type GrammarLevel = Database["public"]["Tables"]["grammar_levels"]["Row"];
export type GrammarTopic = Database["public"]["Tables"]["grammar_topics"]["Row"];
export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
export type Question = Database["public"]["Tables"]["questions"]["Row"];
export type UserLessonProgress = Database["public"]["Tables"]["user_lesson_progress"]["Row"];
export type UserAnswer = Database["public"]["Tables"]["user_answers"]["Row"];
export type UserMistake = Database["public"]["Tables"]["user_mistakes"]["Row"];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          role: UserRole;
          current_level_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          role?: UserRole;
          current_level_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string | null;
          full_name?: string | null;
          role?: UserRole;
          current_level_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      grammar_levels: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          level_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          level_order: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          description?: string | null;
          level_order?: number;
          is_published?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      grammar_topics: {
        Row: {
          id: string;
          level_id: string;
          title: string;
          slug: string;
          description: string | null;
          topic_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          level_id: string;
          title: string;
          slug: string;
          description?: string | null;
          topic_order: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          level_id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          topic_order?: number;
          is_published?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          topic_id: string;
          title: string;
          slug: string;
          difficulty: CurriculumDifficulty;
          summary: string | null;
          explanation: string;
          formula: string | null;
          usage_when: string | null;
          usage_when_not: string | null;
          examples: Json;
          common_mistakes: Json;
          wrong_correct_examples: Json;
          short_notes: Json;
          mini_practice: Json;
          lesson_order: number;
          estimated_minutes: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          topic_id: string;
          title: string;
          slug: string;
          difficulty?: CurriculumDifficulty;
          summary?: string | null;
          explanation: string;
          formula?: string | null;
          usage_when?: string | null;
          usage_when_not?: string | null;
          examples?: Json;
          common_mistakes?: Json;
          wrong_correct_examples?: Json;
          short_notes?: Json;
          mini_practice?: Json;
          lesson_order: number;
          estimated_minutes?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          topic_id?: string;
          title?: string;
          slug?: string;
          difficulty?: CurriculumDifficulty;
          summary?: string | null;
          explanation?: string;
          formula?: string | null;
          usage_when?: string | null;
          usage_when_not?: string | null;
          examples?: Json;
          common_mistakes?: Json;
          wrong_correct_examples?: Json;
          short_notes?: Json;
          mini_practice?: Json;
          lesson_order?: number;
          estimated_minutes?: number;
          is_published?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          lesson_id: string | null;
          topic_id: string | null;
          question_type: QuestionType;
          difficulty: CurriculumDifficulty;
          question_scope: QuestionScope;
          prompt: string;
          options: Json;
          correct_answer: string;
          explanation: string | null;
          wrong_answer_explanation: string | null;
          question_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lesson_id?: string | null;
          topic_id?: string | null;
          question_type: QuestionType;
          difficulty?: CurriculumDifficulty;
          question_scope?: QuestionScope;
          prompt: string;
          options?: Json;
          correct_answer: string;
          explanation?: string | null;
          wrong_answer_explanation?: string | null;
          question_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          lesson_id?: string | null;
          topic_id?: string | null;
          question_type?: QuestionType;
          difficulty?: CurriculumDifficulty;
          question_scope?: QuestionScope;
          prompt?: string;
          options?: Json;
          correct_answer?: string;
          explanation?: string | null;
          wrong_answer_explanation?: string | null;
          question_order?: number;
          is_published?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          status: LessonProgressStatus;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          status?: LessonProgressStatus;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: LessonProgressStatus;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_answers: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          lesson_id: string | null;
          answer: string;
          is_correct: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          lesson_id?: string | null;
          answer: string;
          is_correct: boolean;
          created_at?: string;
        };
        Update: {
          answer?: string;
          is_correct?: boolean;
        };
        Relationships: [];
      };
      user_mistakes: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          lesson_id: string | null;
          submitted_answer: string;
          correct_answer: string;
          is_resolved: boolean;
          notes: string | null;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          lesson_id?: string | null;
          submitted_answer: string;
          correct_answer: string;
          is_resolved?: boolean;
          notes?: string | null;
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          submitted_answer?: string;
          correct_answer?: string;
          is_resolved?: boolean;
          notes?: string | null;
          resolved_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: EmptyObject;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      question_type: QuestionType;
      curriculum_difficulty: CurriculumDifficulty;
      question_scope: QuestionScope;
      lesson_progress_status: LessonProgressStatus;
    };
    CompositeTypes: EmptyObject;
  };
}
