import type { AnswersRepository } from "../repositories/answers-repository"
import { AnswerComment } from "../../enterprise/entities/answer-comment"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { AnswersCommentsRepository } from "../repositories/answers-comment-repository"
import { Either, left, right } from "../../../../core/either"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"

interface CommentOnAnswerUseCaseRequest {
  // id: string
  authorId: string
  answerId: string
  content: string
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  { answerComment: AnswerComment }
>

export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswersCommentsRepository
  ) {}
  async execute({
    // id,
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content,
    })

    await this.answerCommentsRepository.create(answerComment)

    return right({ answerComment })
  }
}
