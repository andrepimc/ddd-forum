import { AnswersCommentsRepository } from "../repositories/answers-comment-repository"

interface DeleteCommentAnswerUseCaseRequest {
  answerCommentId: string
  authorId: string
}

export class DeleteCommentAnswerUseCase {
  constructor(private answerCommentsRepository: AnswersCommentsRepository) {}
  async execute({
    answerCommentId,
    authorId,
  }: DeleteCommentAnswerUseCaseRequest) {
    const answerComment = await this.answerCommentsRepository.findById(
      answerCommentId
    )

    if (!answerComment) {
      throw new Error("Answer comment not found.")
    }

    if (answerComment.authorId.toString() !== authorId) {
      throw new Error("You are not allowed to delete this answer comment.")
    }

    await this.answerCommentsRepository.delete(answerComment)
  }
}
