import type { Question } from "../../enterprise/entities/question";

export interface QuestionsRespository {
  create(question: Question): Promise<void>;
  findBySlug(slug: string): Promise<Question | null>;
}