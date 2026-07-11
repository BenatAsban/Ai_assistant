export interface HCP {
  id: number;
  name: string;
  title?: string;
  organization?: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface FollowUp {
  id: number;
  interaction_id: number;
  action_description: string;
  due_date?: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: number;
  user_id: number;
  hcp_id: number;
  hcp?: HCP;
  interaction_type: 'Call' | 'Meeting' | 'Email' | 'In-Person' | 'Virtual';
  date: string;
  time: string;
  attendees?: string;
  topics_discussed?: string;
  materials_shared?: string;
  samples_distributed?: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  outcomes?: string;
  summary?: string;
  follow_ups?: FollowUp[];
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  extracted_data?: Partial<Interaction>;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface InteractionFormData {
  hcp_id?: number;
  hcp_name?: string;
  interaction_type: 'Call' | 'Meeting' | 'Email' | 'In-Person' | 'Virtual';
  date: string;
  time: string;
  attendees?: string;
  topics_discussed?: string;
  materials_shared?: string;
  samples_distributed?: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  outcomes?: string;
}

export interface ChatResponse {
  response: string;
  extracted_data: Partial<InteractionFormData>;
  sentiment: string;
  follow_ups: string[];
  confidence: number;
}
