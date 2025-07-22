// id: UUID, created_at: timestamptz, user_id: UUID; From supabase
export type todo = {
  id: number;
  name: string;
  completed: boolean;
  created_at: string;
  user_id: string;
};

export type CreateTodo = {
  name: string;
  completed?: boolean;
};
