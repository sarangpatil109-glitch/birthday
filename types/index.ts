export interface Website {
  id: string;
  slug: string;
  from_name: string;
  to_name: string;
  message: string;
  photos: string[];
  video: string | null;
  song: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  website_id: string;
  cashfree_order_id: string;
  cashfree_payment_id: string | null;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  created_at: string;
}
