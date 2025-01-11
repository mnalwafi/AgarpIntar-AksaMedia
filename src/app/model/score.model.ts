export interface ScoreTableFilter {
  name?: string;
  course?: string;
  score?: string;
}

export interface ScoreTablePagination {
  page: number;
  amount: number;
}

export interface ScoreTableData {
  _id: number;
  name: string;
  student_id: string;
  course: string;
  score: string;
  class: string;
  count_documents: number;
}
