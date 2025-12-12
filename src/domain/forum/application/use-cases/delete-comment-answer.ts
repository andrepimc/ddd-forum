import { left, right, type Either } from "../../../../core/either"
import { AnswersCommentsRepository } from "../repositories/answers-comment-repository"

interface DeleteCommentAnswerUseCaseRequest {
  answerCommentId: string
  authorId: string
}

type DeleteCommentAnswerUseCaseResponse = Either<string, {}>

export class DeleteCommentAnswerUseCase {
  constructor(private answerCommentsRepository: AnswersCommentsRepository) { }
  async execute({
    answerCommentId,
    authorId,
  }: DeleteCommentAnswerUseCaseRequest): Promise<DeleteCommentAnswerUseCaseResponse> {
    const answerComment = await this.answerCommentsRepository.findById(
      answerCommentId
    )

    if (!answerComment) {
      return left("Answer comment not found.")
    }

    if (answerComment.authorId.toString() !== authorId) {
      return left("You are not allowed to delete this answer comment.")
    }

    await this.answerCommentsRepository.delete(answerComment)

    return right({})
  }
}
