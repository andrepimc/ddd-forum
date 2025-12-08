import { UniqueEntityId } from "../../../../core/entities/unique-entity-id";
import { Question } from "../../enterprise/entities/question";
import type { QuestionsRespository } from "../repositories/questions-repository";

interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
}

export class CreateQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRespository
  ) { }
  async execute({ authorId, title, content }: CreateQuestionUseCaseRequest) {
    const question = Question.create(
      {
        authorId: new UniqueEntityId(authorId),
        title,
        content
      }
    )

    await this.questionsRepository.create(question)

    return { question }
  }
}