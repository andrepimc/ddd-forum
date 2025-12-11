import type { QuestionsRepository } from "../repositories/questions-repository"
import { QuestionComment } from "../../enterprise/entities/question-comment"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { QuestionsCommentsRepository } from "../repositories/questions-comments-repository"

interface CommentOnQuestionUseCaseRequest {
  // id: string
  authorId: string
  questionId: string
  content: string
}

export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionsCommentsRepository
  ) {}
  async execute({
    // id,
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest) {
    const question = await this.questionsRepository.findById(questionId)
    if (!question) {
      throw new Error("Question not found.")
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content,
    })

    await this.questionCommentsRepository.create(questionComment)
  }
}
