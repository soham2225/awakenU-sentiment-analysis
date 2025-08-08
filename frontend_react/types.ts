
export enum Sentiment {
  Positive = 'Positive',
  Negative = 'Negative',
  Neutral = 'Neutral',
}

export enum FeedbackType {
  Complaint = 'Complaint',
  Suggestion = 'Suggestion',
  Praise = 'Praise',
}

export enum Urgency {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export enum Platform {
  Email = 'Email',
  Reddit = 'Reddit',
  Twitter = 'Twitter',
  YouTube = 'YouTube',
  Website = 'Website',
}

export interface FeedbackItem {
  id: string;
  date: string;
  platform: Platform;
  sender: string;
  product: string;
  sentiment: Sentiment;
  confidence: number;
  feedbackType: FeedbackType;
  urgency: Urgency;
  department: string;
  message: string;
  tags: string[];
}

export type PageProps = {
  setPageTitle: (title: string) => void;
};
