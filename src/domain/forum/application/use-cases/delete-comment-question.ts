import { QuestionsCommentsRepository } from "../repositories/questions-comments-repository"

interface DeleteCommentQuestionUseCaseRequest {
  questionCommentId: string
  authorId: string
}

export class DeleteCommentQuestionUseCase {
  constructor(
    private questionCommentsRepository: QuestionsCommentsRepository
  ) {}
  async execute({
    questionCommentId,
    authorId,
  }: DeleteCommentQuestionUseCaseRequest) {
    const questionComment = await this.questionCommentsRepository.findById(
      questionCommentId
    )

    if (!questionComment) {
      throw new Error("Question comment not found.")
    }

    if (questionComment.authorId.toString() !== authorId) {
      throw new Error("You are not allowed to delete this question comment.")
    }

    await this.questionCommentsRepository.delete(questionComment)
  }
}
