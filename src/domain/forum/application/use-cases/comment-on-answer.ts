import type { AnswersRepository } from "../repositories/answers-repository"
import { AnswerComment } from "../../enterprise/entities/answer-comment"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { AnswersCommentsRepository } from "../repositories/answers-comment-repository"

interface CommentOnAnswerUseCaseRequest {
  // id: string
  authorId: string
  answerId: string
  content: string
}

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
  }: CommentOnAnswerUseCaseRequest) {
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      throw new Error("Answer not found.")
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content,
    })

    await this.answerCommentsRepository.create(answerComment)
  }
}
