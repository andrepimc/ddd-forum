import type { QuestionsRepository } from "../repositories/questions-repository"

interface EditQuestionUseCaseRequest {
  id: string
  authorId: string
  title: string
  content: string
}

export class EditQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}
  async execute({ id, authorId, title, content }: EditQuestionUseCaseRequest) {
    const question = await this.questionsRepository.findById(id)

    if (!question) {
      throw new Error("Question not found.")
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error("You are not allowed to delete this question.")
    }

    question.title = title
    question.content = content

    await this.questionsRepository.save(question)

    return { question }
  }
}
