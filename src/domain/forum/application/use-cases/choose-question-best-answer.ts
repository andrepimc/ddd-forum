import { QuestionsRepository } from "../repositories/questions-repository"
import { AnswersRepository } from "../repositories/answers-repository"

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerUseCaseRequest) {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error("Answer not found.")
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toString()
    )

    if (!question) {
      throw new Error("Question not found.")
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error("You are not allowed to choose the best answer.")
    }

    question.bestAnswerId = answer.id

    await this.questionsRepository.save(question)

    return { question }
  }
}
