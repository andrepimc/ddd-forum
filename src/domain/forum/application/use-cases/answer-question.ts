import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { Answer } from "../../../forum/enterprise/entities/answer"
import type { AnswersRespository } from "../repositories/answers-repository"

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
}

export class AnswerQuestionUseCase {
  constructor(
    private answersRepository: AnswersRespository
  ) { }
  async execute({ content, instructorId, questionId }: AnswerQuestionUseCaseRequest) {
    const answer = Answer.create(
      {
        content,
        authorId: new UniqueEntityId(instructorId),
        questionId: new UniqueEntityId(questionId),
      }
    )

    await this.answersRepository.create(answer)

    return answer
  }
}
