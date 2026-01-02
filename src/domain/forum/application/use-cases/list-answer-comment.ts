import { Either, right } from "../../../../core/either"
import { AnswerComment } from "../../enterprise/entities/answer-comment"
import { AnswersCommentsRepository } from "../repositories/answers-comment-repository"

interface ListAnswerCommentsUseCaseRequest {
  answerId: string
}

type ListAnswerCommentsUseCaseResponse = Either<
  null,
  { answerComments: AnswerComment[] }
>

export class ListAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswersCommentsRepository) {}
  async execute({
    answerId,
  }: ListAnswerCommentsUseCaseRequest): Promise<ListAnswerCommentsUseCaseResponse> {
    const answerComments = await this.answerCommentsRepository.listAll(answerId)

    return right({ answerComments })
  }
}
