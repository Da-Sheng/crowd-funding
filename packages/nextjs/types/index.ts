export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  raised: number;
  target: number;
  supporters: number;
  category: string;
  daysLeft: number;
  creator?: string;
  beneficiary?: string;
  timestamp?: bigint;
}

export interface FormData {
  title: string;
  description: string;
  targetAmount: string;
  category: string;
  location: string;
  duration: string;
  beneficiary: string;
  returnOnExpire: boolean;
  imageUrl: string;
}

export interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
  raised: number;
  target: number;
  supporters: number;
  creator?: string;
  beneficiary?: string;
  timestamp?: bigint;
}
